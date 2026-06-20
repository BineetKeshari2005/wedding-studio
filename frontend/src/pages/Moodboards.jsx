import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useStudio, JOURNEY_STEPS } from "../contexts/StudioContext";
import EditorialImageCard from "../components/moodboards/EditorialImageCard";
import MoodboardModal from "../components/moodboards/MoodboardModal";

const SECTION_DESCRIPTIONS = {
  "Entry": "Elegant first impressions and guest arrival experiences.",
  "Lounge": "Comfortable spaces designed for conversation and relaxation.",
  "Dining": "Curated dining experiences and luxury tablescapes.",
  "Bar": "Signature cocktails and celebratory moments.",
  "Stage": "The centerpiece of timeless memories.",
  "Photo Booth": "Playful moments and candid captures."
};

export default function Moodboards() {
  const navigate = useNavigate();
  const { selectedConcepts, removeConcept, preferences } = useStudio();
  const [previewConcept, setPreviewConcept] = useState(null);
  
  // Intersection Observer for scroll animations
  const observerRef = useRef(null);
  useEffect(() => {
    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('moodboard-visible');
        }
      });
    }, { threshold: 0.1 });
    
    // Add brief delay to ensure DOM is ready
    setTimeout(() => {
      document.querySelectorAll('.moodboard-section-enter').forEach(el => {
        observerRef.current.observe(el);
      });
    }, 100);
    
    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [selectedConcepts]);

  // Highlight active section in sticky nav
  const [activeSection, setActiveSection] = useState("");
  const populatedSteps = JOURNEY_STEPS.filter(step => selectedConcepts[step] && selectedConcepts[step].length > 0);

  useEffect(() => {
    const handleScroll = () => {
      const sections = populatedSteps.map(step => document.getElementById(`section-${step}`));
      let current = "";
      for (const section of sections) {
        if (!section) continue;
        const rect = section.getBoundingClientRect();
        if (rect.top <= 200) {
          current = section.id.replace('section-', '');
        }
      }
      setActiveSection(current || populatedSteps[0] || "");
    };
    
    // Initialize active section
    if (populatedSteps.length > 0 && !activeSection) {
      setActiveSection(populatedSteps[0]);
    }
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [selectedConcepts, populatedSteps, activeSection]);

  const totalConcepts = Object.values(selectedConcepts).reduce((sum, arr) => sum + arr.length, 0);

  const handlePreview = (concept) => {
    setPreviewConcept(concept);
  };

  const scrollToSection = (stepName) => {
    const el = document.getElementById(`section-${stepName}`);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  // Wedding DNA from preferences
  const hasPrefs = preferences && Object.keys(preferences).length > 0;
  const style = preferences?.weddingStyle || "Modern Luxury";
  const palette = preferences?.colorPalette ? `${preferences.colorPalette} Celebration` : "Ivory & Gold Celebration";
  const venue = preferences?.venueType || "Banquet";
  const timing = preferences?.timing || "Morning";

  return (
    <main className="loverai-wedding-shell min-h-screen text-white flex flex-col items-center overflow-x-hidden relative">
      <div className="loverai-wedding-bg fixed inset-0 z-0" style={{ backgroundImage: 'url("/images/signup.png")' }} />
      <div className="loverai-wedding-overlay fixed inset-0 z-0" />

      {previewConcept && (
        <MoodboardModal
          concept={previewConcept}
          onClose={() => setPreviewConcept(null)}
        />
      )}

      {totalConcepts === 0 ? (
        // Global Empty State
        <div className="relative z-10 w-full min-h-screen flex flex-col items-center justify-center text-center p-6">
          <h2 className="font-['Cormorant_Garamond'] text-4xl md:text-5xl text-white/90 mb-4 tracking-wide drop-shadow-lg">
            Your wedding vision is waiting to be created.
          </h2>
          <p className="text-white/60 text-base md:text-lg max-w-md mb-10 tracking-wide font-light">
            Return to Studio to begin curating your inspirations.
          </p>
          <button
            onClick={() => navigate("/studio")}
            className="loverai-btn-accent text-[#3D1B2D] px-10 py-4 rounded-full font-semibold uppercase tracking-widest text-sm shadow-[0_0_30px_rgba(242,218,208,0.3)] hover:shadow-[0_0_50px_rgba(242,218,208,0.5)] transition-shadow duration-500"
          >
            Back to Studio
          </button>
        </div>
      ) : (
        <div className="w-full relative z-10 flex flex-col pb-24">
          
          {/* Small Elegant Hero */}
          <section className="w-full flex flex-col items-center justify-center relative pt-20 pb-12 min-h-[200px] md:min-h-[250px] border-b border-white/[0.05] bg-black/20">
            <div className="z-20 text-center flex flex-col items-center gap-3 md:gap-4 max-w-4xl px-6 moodboard-section-enter">
              <h1 className="font-['Cormorant_Garamond'] text-4xl md:text-5xl font-semibold tracking-wide text-white leading-none drop-shadow-md mb-2">
                Wedding Vision
              </h1>
              
              <div className="flex flex-col items-center gap-1">
                <span className="text-[#e6c6b2] text-xs md:text-sm font-semibold tracking-[0.2em] uppercase">
                  {hasPrefs ? style : "Your Curated"}
                </span>
                <span className="text-white/80 text-lg md:text-xl font-['Cormorant_Garamond'] tracking-widest italic">
                  {hasPrefs ? palette : "Wedding Experience"}
                </span>
              </div>
              
              <button
                type="button"
                onClick={() => navigate("/studio")}
                className="group flex items-center gap-2 text-white/60 hover:text-white transition-colors duration-300 uppercase tracking-widest text-[10px] md:text-xs font-semibold z-30 mt-2 mb-2"
              >
                <svg className="w-3 h-3 md:w-4 md:h-4 transform group-hover:-translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
                Return to Studio
              </button>

              {hasPrefs && (
                <div className="text-white/50 text-[10px] md:text-xs font-semibold tracking-[0.3em] uppercase">
                  {venue} • {timing.split(" ")[0]}
                </div>
              )}
              
              <p className="text-white/60 text-xs md:text-sm tracking-[0.1em] max-w-lg font-light leading-relaxed mt-2">
                A curated collection of your selected wedding inspirations.
              </p>
            </div>
          </section>

          {/* Sticky Navigation */}
          <nav className="moodboard-sticky-nav w-full py-4 px-6 shadow-2xl bg-[#0a0604]/80 backdrop-blur-md border-b border-white/[0.05]">
            <div className="max-w-[1440px] mx-auto flex justify-center gap-6 md:gap-12 overflow-x-auto no-scrollbar">
              {populatedSteps.map((stepName) => (
                <button
                  key={stepName}
                  onClick={() => scrollToSection(stepName)}
                  className={`uppercase text-[10px] md:text-xs tracking-[0.2em] font-semibold transition-all duration-300 whitespace-nowrap px-2 py-1 border-b-2 ${
                    activeSection === stepName 
                      ? "text-[#e6c6b2] border-[#e6c6b2]" 
                      : "text-white/40 border-transparent hover:text-white/80"
                  }`}
                >
                  {stepName}
                </button>
              ))}
            </div>
          </nav>

          {/* Selection Board Chapters */}
          <div className="w-full max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12 pt-12 flex flex-col gap-12">
            {populatedSteps.map((stepName) => {
              const concepts = selectedConcepts[stepName];

              return (
                <section id={`section-${stepName}`} key={stepName} className="flex flex-col moodboard-section-enter">
                  <div className="w-full bg-white/[0.02] border border-white/[0.05] rounded-3xl p-6 md:p-10 backdrop-blur-sm shadow-2xl">
                    
                    {/* Chapter Header */}
                    <div className="mb-8 flex flex-col items-start border-b border-white/[0.08] pb-6">
                      <h2 className="text-white font-['Cormorant_Garamond'] text-3xl md:text-4xl font-semibold uppercase tracking-[0.15em] mb-2 drop-shadow-md">
                        {stepName}
                      </h2>
                      <p className="text-[#f2dad0]/70 text-sm md:text-base font-['Cormorant_Garamond'] tracking-widest italic">
                        {SECTION_DESCRIPTIONS[stepName]}
                      </p>
                    </div>

                    {/* Horizontal Scrolling Card Row */}
                    <div className="w-full overflow-x-auto no-scrollbar py-4 -mx-2 px-2">
                      <div className="flex flex-row gap-6 md:gap-8 w-max">
                        {concepts.map((concept) => (
                          <EditorialImageCard
                            key={concept.id}
                            concept={concept}
                            sectionName={stepName}
                            onRemove={removeConcept}
                            onClick={handlePreview}
                          />
                        ))}
                      </div>
                    </div>

                  </div>
                </section>
              );
            })}
          </div>
        </div>
      )}
    </main>
  );
}
