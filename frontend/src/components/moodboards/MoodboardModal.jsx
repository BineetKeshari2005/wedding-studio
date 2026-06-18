export default function MoodboardModal({ concept, sectionName, onClose }) {
  if (!concept) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 md:p-8"
      onClick={onClose}
    >
      <button
        className="absolute top-6 right-6 text-white/70 hover:text-white transition bg-black/40 rounded-full p-2 border border-white/10"
        onClick={onClose}
      >
        <svg
          className="w-6 h-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>

      <div
        className="relative max-w-[90vw] max-h-[90vh] flex flex-col items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={concept.image}
          alt="Preview"
          className="max-w-full max-h-[80vh] object-contain rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/20"
        />

        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 via-black/60 to-transparent rounded-b-xl flex flex-col gap-1">
          <div className="flex items-center gap-3 mb-1">
            <span className="bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-2.5 py-1 text-white/90 text-[10px] font-bold uppercase tracking-widest">
              {sectionName}
            </span>
            <span className="text-white/60 text-xs font-medium tracking-wide">
              Saved today
            </span>
          </div>
          <h2 className="text-white text-2xl md:text-3xl font-bold tracking-wide drop-shadow-md">
            {concept.title}
          </h2>
          <p className="text-white/80 text-sm md:text-base font-medium max-w-2xl">
            {concept.description}
          </p>
        </div>
      </div>
    </div>
  );
}
