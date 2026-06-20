export default function EditorialImageCard({
  concept,
  sectionName,
  onRemove,
  onClick,
  className = "",
}) {
  const imageUrl = concept.imageUrl || concept.image;
  
  return (
    <div className={`flex flex-col group ${className} w-[280px] sm:w-[300px] shrink-0`}>
      {/* Image Container with explicit height to guarantee 4:5 Aspect Ratio */}
      <div
        onClick={() => onClick(concept)}
        className="relative w-full h-[350px] sm:h-[375px] rounded-xl overflow-hidden cursor-pointer transition-all duration-700 ease-in-out shrink-0 border border-white/5 shadow-lg bg-black/20"
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={concept.title || "Wedding Inspiration"}
            className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/30 text-xs uppercase tracking-widest bg-black/40">
            Image Missing
          </div>
        )}
        
        {/* Luxury Soft Overlay on Hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500 ease-in-out" />
        
        {/* Action Icons - Centered on Hover */}
        <div className="absolute inset-0 flex items-center justify-center gap-4 z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 scale-95 group-hover:scale-100">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClick(concept);
            }}
            className="p-3 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md border border-white/20 transition-all hover:scale-110 shadow-xl"
            title="Preview Inspiration"
          >
            <svg className="w-5 h-5 text-white/90" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove(sectionName, concept.id);
            }}
            className="p-3 rounded-full bg-black/40 hover:bg-red-500/80 backdrop-blur-md border border-white/20 transition-all hover:scale-110 shadow-xl"
            title="Remove Inspiration"
          >
            <svg className="w-5 h-5 text-white/90" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18" />
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
            </svg>
          </button>
        </div>
      </div>

      {/* Text Details - Below Image */}
      <div className="mt-4 px-1">
        <h3 className="text-white/90 font-['Cormorant_Garamond'] text-xl tracking-wide truncate">
          {concept.title || "Wedding Inspiration"}
        </h3>
        {concept.description && (
          <p className="text-white/50 text-xs font-medium tracking-wide mt-1 line-clamp-2">
            {concept.description}
          </p>
        )}
      </div>
    </div>
  );
}
