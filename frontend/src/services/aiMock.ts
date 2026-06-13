// AI generation service using Black Forest Labs (BFL) FLUX API

export interface GeneratedResult {
  images: GeneratedImage[];
  palette: string[];
}

export interface GeneratedImage {
  id: string;
  label: string;
  stageName: string;
  imageUrl?: string;
}

export const STAGES = [
  { key: "entry", label: "Entry", icon: "🚪" },
  { key: "lounge", label: "Lounge", icon: "🛋️" },
  { key: "dining", label: "Dining", icon: "🍽️" },
  { key: "bar", label: "Bar", icon: "🍸" },
  { key: "stage", label: "Stage", icon: "🎭" },
] as const;

export type StageKey = (typeof STAGES)[number]["key"] | string;

const STYLE_LABELS = [
  "Floral Canopy Arch",
  "Crystal Chandelier Setup",
  "Vintage Garden Elegance",
  "Modern Minimalist",
  "Royal Palace Grandeur",
  "Boho Chic Dreamscape",
  "Art Deco Statement",
  "Pastel Cloud Nine",
  "Enchanted Forest",
  "Mediterranean Sunset",
  "Tropical Luxe",
  "Classic Ivory & Gold",
];

const PALETTES = [
  ["#D6AE88", "#AA7484", "#F5E6D3", "#8B6F47", "#E8D5C4"],
  ["#C9A87C", "#9B4F6A", "#F0DCC8", "#6B5B3E", "#DBC1B0"],
  ["#E8C9A0", "#B8627A", "#FFF0E0", "#7D6B50", "#F2DCC6"],
  ["#BFA07A", "#A05070", "#EAD8C0", "#5A4830", "#D4B8A0"],
  ["#D4A574", "#C47A8E", "#F8ECD6", "#9E8465", "#E6D0BA"],
];

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

const API_KEY = import.meta.env.VITE_FLUX_API_KEY;

interface InitiationResponse {
  id: string;
  polling_url?: string;
}

// Poll the status endpoint until the image is ready
async function pollResult(taskId: string, pollingUrl?: string): Promise<string> {
  let url = `/api-bfl/v1/get_result?id=${taskId}`;
  
  if (pollingUrl) {
    const match = pollingUrl.match(/https:\/\/api\.([^.]+)\.bfl\.ai/);
    if (match && match[1]) {
      const region = match[1];
      url = `/api-bfl-regional/${region}/v1/get_result?id=${taskId}`;
      console.log(`[BFL Proxy] Routing polling to region: ${region}`);
    }
  }

  const headers = {
    "Content-Type": "application/json",
    "x-key": API_KEY,
  };

  // Poll every 3 seconds, up to 25 times (75 seconds max)
  for (let i = 0; i < 25; i++) {
    await delay(3000);
    const res = await fetch(url, { headers });
    if (!res.ok) {
      if (url.includes("/api-bfl-regional")) {
        console.warn(`Regional polling failed with status ${res.status}. Falling back to global...`);
        url = `/api-bfl/v1/get_result?id=${taskId}`;
        continue;
      }
      throw new Error(`Polling failed with status ${res.status}`);
    }
    
    const data = await res.json();
    if (data.status === "Ready") {
      if (data.result && data.result.sample) {
        return data.result.sample;
      }
      throw new Error("API status is Ready but no sample URL was returned");
    } else if (data.status === "Error" || data.status === "Failed") {
      throw new Error(`BFL task failed: ${data.error || "Unknown generation error"}`);
    }
    console.log(`Polling task ${taskId}... current status: ${data.status}`);
  }
  throw new Error("Generation task timed out");
}

// Initiate an asynchronous image generation task on BFL API
async function initiateTask(endpoint: string, prompt: string): Promise<InitiationResponse> {
  const url = `/api-bfl/v1/${endpoint}`;
  const headers = {
    "Content-Type": "application/json",
    "x-key": API_KEY,
  };
  const body = JSON.stringify({
    prompt,
    width: 1024,
    height: 1024,
    output_format: "jpeg",
  });

  const res = await fetch(url, {
    method: "POST",
    headers,
    body,
  });

  if (!res.ok) {
    throw new Error(`Task initiation failed with status ${res.status}`);
  }

  const data = await res.json();
  if (!data.id) {
    throw new Error("Response did not contain a valid task ID");
  }
  return { id: data.id, polling_url: data.polling_url };
}

// Generate single image using FLUX.1 [dev] or fallback to FLUX.1 [pro]
async function generateSingleImage(prompt: string): Promise<string> {
  let initRes: InitiationResponse;
  try {
    initRes = await initiateTask("flux-dev", prompt);
  } catch (err) {
    console.warn("flux-dev failed to initiate, attempting fallback to flux-pro-1.1...", err);
    initRes = await initiateTask("flux-pro-1.1", prompt);
  }
  return await pollResult(initRes.id, initRes.polling_url);
}

export const generateStageImages = async (
  _stageKey: StageKey,
  stageName: string,
  _options: Record<string, any>
): Promise<GeneratedResult> => {
  if (API_KEY && API_KEY !== "YOUR_API_KEY_HERE" && API_KEY.trim() !== "") {
    try {
      console.log(`[BFL Flux] Initiating generations for ${stageName} stage...`);

      // 4 different styling descriptors to ensure distinct variation options
      const variations = [
        "close-up editorial shot, focusing on floral details, elegant centerpieces, luxury tableware",
        "wide-angle cinematic view of the entire setup, grand scale decorations, dramatic lighting",
        "romantic warm lighting, twilight ambiance, dreamy and glowing wedding design",
        "modern chic style, with geometric gold structures, hanging lanterns, and premium pastel draping"
      ];

      const imagePromises = variations.map(async (variation, i) => {
        const prompt = `A professional high-end wedding moodboard photo of the ${stageName} stage. Venue: ${_options.celebration || "any"}, theme: ${_options.theme || "any"}, function: ${_options.function || "any"}, time of day: ${_options.time || "any"}, budget: ${_options.budget ? _options.budget + " Lakhs" : "any"}, guest count: ${_options.guest || "any"} pax. Vibe: ${_options.vibe || "beautiful decoration"}. Scene detail: ${variation}. Ultra-realistic, award-winning wedding design, cinematic lighting, 8k resolution, elegant, premium, clean details, no text.`;
        
        const imageUrl = await generateSingleImage(prompt);
        return {
          id: `${_stageKey}-${i}-${Date.now()}`,
          label: `${_options.theme || "Wedding"} Design ${i + 1}`,
          stageName,
          imageUrl,
        };
      });

      const images = await Promise.all(imagePromises);
      const palette = PALETTES[Math.floor(Math.random() * PALETTES.length)];
      return { images, palette };

    } catch (error) {
      console.error("[BFL Flux] Image generation failed. Falling back to mock data.", error);
    }
  } else {
    console.log("[BFL Flux] No API key found. Defaulting to mock placeholders.");
  }

  // Fallback to Mock Data
  await delay(1500);
  const labels = [...STYLE_LABELS].sort(() => Math.random() - 0.5).slice(0, 4);
  const images: GeneratedImage[] = labels.map((label, i) => ({
    id: `${_stageKey}-${i}-${Date.now()}`,
    label,
    stageName,
  }));
  const palette = PALETTES[Math.floor(Math.random() * PALETTES.length)];

  return { images, palette };
};
