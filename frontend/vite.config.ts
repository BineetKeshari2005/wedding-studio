import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// Custom Vite plugin to proxy global and regional BFL API requests
const bflProxyPlugin = () => ({
  name: "bfl-proxy",
  configureServer(server: any) {
    server.middlewares.use(async (req: any, res: any, next: any) => {
      const url = req.url || "";
      
      if (url.startsWith("/api-bfl-regional/") || url.startsWith("/api-bfl/")) {
        try {
          let targetUrl = "";
          
          if (url.startsWith("/api-bfl-regional/")) {
            const match = url.match(/^\/api-bfl-regional\/([^/]+)(.*)$/);
            if (!match) {
              res.statusCode = 400;
              res.end("Invalid regional proxy URL");
              return;
            }
            const region = match[1];
            const path = match[2];
            targetUrl = `https://api.${region}.bfl.ai${path}`;
          } else {
            const path = url.replace(/^\/api-bfl/, "");
            targetUrl = `https://api.bfl.ai${path}`;
          }

          console.log(`[Vite BFL Proxy] ${req.method} -> ${targetUrl}`);

          const headers: Record<string, string> = {};
          if (req.headers["x-key"]) {
            headers["x-key"] = req.headers["x-key"] as string;
          }
          if (req.headers["content-type"]) {
            headers["content-type"] = req.headers["content-type"] as string;
          }

          let body: any = undefined;
          if (req.method === "POST") {
            const chunks: any[] = [];
            for await (const chunk of req) {
              chunks.push(chunk);
            }
            body = Buffer.concat(chunks);
          }

          const bflRes = await fetch(targetUrl, {
            method: req.method,
            headers: headers,
            body: body,
          });

          res.statusCode = bflRes.status;
          res.setHeader("Content-Type", bflRes.headers.get("Content-Type") || "application/json");
          res.setHeader("Access-Control-Allow-Origin", "*");
          
          const text = await bflRes.text();
          res.end(text);
        } catch (err) {
          console.error("[Vite BFL Proxy] Error:", err);
          res.statusCode = 500;
          res.end(JSON.stringify({ error: "Proxy connection failed", details: String(err) }));
        }
      } else {
        next();
      }
    });
  }
});

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [
    react(), 
    mode === "development" && componentTagger(),
    bflProxyPlugin()
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
