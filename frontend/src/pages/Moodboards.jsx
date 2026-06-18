import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useStudio, JOURNEY_STEPS } from "../contexts/StudioContext";
import EditorialImageCard from "../components/moodboards/EditorialImageCard";
import MoodboardModal from "../components/moodboards/MoodboardModal";

const SECTION_DESCRIPTIONS = {
  "Entry": "Grand entrances and first impressions for your guests.",
  "Lounge": "Intimate conversations and comfortable elegance.",
  "Dining": "Unforgettable culinary experiences and beautiful tablescapes.",
  "Bar": "Signature cocktails and celebratory moments.",
  "Stage": "The focal point of your entertainment and speeches.",
  "Photo Booth": "Playful memories and candid captures."
};

export default function Moodboards() {
  const navigate = useNavigate();
  const { selectedConcepts, removeConcept } = useStudio();
  const [previewConcept, setPreviewConcept] = useState(null);
  const [previewSection, setPreviewSection] = useState(null);

  useEffect(() => {
    console.log("MOODBOARDS RECEIVED:", selectedConcepts);
  }, [selectedConcepts]);

  const totalConcepts = Object.values(selectedConcepts).reduce(
    (sum, arr) => sum + arr.length,
    0
  );

  const handlePreview = (concept, sectionName) => {
    setPreviewConcept(concept);
    setPreviewSection(sectionName);
  };

  return (
    <main className="loverai-wedding-shell min-h-screen text-white flex flex-col items-center overflow-x-hidden">
      <div
        className="loverai-wedding-bg fixed inset-0 z-0"
        style={{ backgroundImage: 'url("/images/signup.png")' }}
      />
      <div className="loverai-wedding-overlay fixed inset-0 z-0" />

      {/* Preview Modal */}
      {previewConcept && (
        <MoodboardModal
          concept={previewConcept}
          sectionName={previewSection}
          onClose={() => {
            setPreviewConcept(null);
            setPreviewSection(null);
          }}
        />
      )}

      {/* Scrollable Main Content */}
      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-4 md:px-12 lg:px-24 py-12 md:py-20 flex flex-col min-h-screen">
        
        {/* Cinematic Header */}
        <header className="mb-24 flex flex-col items-center justify-center text-center relative mt-8">
          <div className="absolute left-0 top-0">
            <button
              type="button"
              onClick={() => navigate("/studio")}
              className="group flex items-center gap-2 text-white/60 hover:text-white transition-colors duration-300 uppercase tracking-widest text-xs font-semibold"
            >
              <svg className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Return to Studio
            </button>
          </div>

          <h1 className="font-['Cormorant_Garamond'] text-5xl md:text-7xl font-semibold tracking-wide text-white leading-tight drop-shadow-lg mt-12 md:mt-0">
            Wedding Vision
          </h1>
          <p className="text-[#f2dad0]/80 text-base md:text-lg font-medium tracking-[0.2em] uppercase mt-6 max-w-2xl">
            A curated collection of your selected wedding inspirations
          </p>
        </header>

        {/* Global Empty State */}
        {totalConcepts === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center pb-32">
            <h2 className="font-['Cormorant_Garamond'] text-4xl text-white/80 mb-4 tracking-wide">
              Your canvas is waiting
            </h2>
            <p className="text-white/50 text-base max-w-md mb-10 tracking-wide">
              Return to the Studio to begin curating inspirations that will shape your extraordinary day.
            </p>
            <button
              onClick={() => navigate("/studio")}
              className="loverai-btn-accent text-[#3D1B2D] px-10 py-4 rounded-full font-semibold uppercase tracking-widest text-sm shadow-[0_0_30px_rgba(242,218,208,0.3)] hover:shadow-[0_0_50px_rgba(242,218,208,0.5)] transition-shadow duration-500"
            >
              Enter Studio
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-32 pb-32">
            {JOURNEY_STEPS.map((stepName) => {
              const concepts = selectedConcepts[stepName] || [];

              // NEVER show empty sections
              if (concepts.length === 0) return null;

              return (
                <section key={stepName} className="flex flex-col">
                  {/* Section Header */}
                  <div className="mb-10 text-center flex flex-col items-center">
                    <h2 className="text-white font-['Cormorant_Garamond'] text-4xl md:text-5xl font-bold uppercase tracking-[0.15em] mb-4">
                      {stepName}
                    </h2>
                    <p className="text-[#f2dad0]/60 text-sm md:text-base font-medium tracking-widest max-w-xl italic">
                      {SECTION_DESCRIPTIONS[stepName]}
                    </p>
                  </div>

                  {/* Section Content */}
                  <div className="w-full">
                    {concepts.length === 1 && (
                      <EditorialImageCard
                        concept={concepts[0]}
                        sectionName={stepName}
                        onRemove={removeConcept}
                        onClick={(c) => handlePreview(c, stepName)}
                        className="w-full h-[400px] md:h-[600px] lg:h-[700px]"
                      />
                    )}

                    {concepts.length === 2 && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                        {concepts.map((concept) => (
                          <EditorialImageCard
                            key={concept.id}
                            concept={concept}
                            sectionName={stepName}
                            onRemove={removeConcept}
                            onClick={(c) => handlePreview(c, stepName)}
                            className="w-full h-[500px] md:h-[600px]"
                          />
                        ))}
                      </div>
                    )}

                    {concepts.length >= 3 && (
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10">
                        {/* Hero Image */}
                        <div className="md:col-span-8 flex">
                          <EditorialImageCard
                            concept={concepts[0]}
                            sectionName={stepName}
                            onRemove={removeConcept}
                            onClick={(c) => handlePreview(c, stepName)}
                            className="w-full h-[400px] md:h-[600px]"
                          />
                        </div>
                        
                        {/* Supporting Images */}
                        <div className="md:col-span-4 flex flex-col gap-6 md:gap-10">
                          {concepts.slice(1).map((concept) => (
                            <EditorialImageCard
                              key={concept.id}
                              concept={concept}
                              sectionName={stepName}
                              onRemove={removeConcept}
                              onClick={(c) => handlePreview(c, stepName)}
                              className="flex-1 w-full min-h-[250px] md:min-h-[0px] h-[300px] md:h-full"
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
