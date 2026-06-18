export default function EditorialImageCard({
  concept,
  sectionName,
  onRemove,
  onClick,
  className = "",
}) {
  return (
    <div
      onClick={() => onClick(concept)}
      className={`relative rounded-xl overflow-hidden group cursor-pointer transition-all duration-700 ease-in-out ${className}`}
    >
      {/* The Image */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-in-out group-hover:scale-105"
        style={{ backgroundImage: `url(${concept.image})` }}
      />
      
      {/* Luxury Soft Overlay on Hover */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-500 ease-in-out" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out" />

      {/* Trash Action - Top Right */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove(sectionName, concept.id);
        }}
        className="absolute top-4 right-4 p-2 rounded-full bg-black/40 hover:bg-black/80 backdrop-blur-md border border-white/20 transition-all duration-300 z-20 opacity-0 group-hover:opacity-100 focus:opacity-100 translate-y-2 group-hover:translate-y-0"
        title="Remove Inspiration"
      >
        <svg
          className="w-4 h-4 text-white/90 hover:text-red-400 transition-colors"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 6h18" />
          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
        </svg>
      </button>

      {/* Text Details - Bottom Left */}
      <div className="absolute bottom-0 left-0 right-0 p-6 z-20 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out translate-y-4 group-hover:translate-y-0">
        <h3 className="text-white font-['Cormorant_Garamond'] text-2xl tracking-wide drop-shadow-md">
          {concept.title}
        </h3>
        <p className="text-white/80 text-sm font-medium tracking-wide mt-1 line-clamp-2">
          {concept.description}
        </p>
      </div>
    </div>
  );
}
