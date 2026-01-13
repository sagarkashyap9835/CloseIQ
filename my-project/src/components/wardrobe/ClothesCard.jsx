import { Trash2 } from "lucide-react";

export default function ClothesCard({ item, remove }) {
  const imageUrl = item.image?.startsWith("http")
    ? item.image
    : `http://localhost:5000/uploads/${item.image}`;

  // Color to display color
  const colorMap = {
    black: "#1f2937",
    white: "#f9fafb",
    red: "#ef4444",
    blue: "#3b82f6",
    green: "#22c55e",
    yellow: "#eab308",
    pink: "#ec4899",
    brown: "#92400e",
    grey: "#6b7280",
    beige: "#d4a574"
  };

  const displayColor = colorMap[item.color?.toLowerCase()] || "#9ca3af";

  return (
    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-100 hover:border-emerald-200">
      {/* Image Container */}
      <div className="relative overflow-hidden">
        <img
          src={imageUrl}
          alt={item.category}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.src = "https://placehold.co/300x400/f1f5f9/475569?text=Image+Error";
          }}
        />

        {/* Hover Overlay with Delete */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={() => remove(item._id)}
            className="absolute top-3 right-3 p-2.5 bg-white/95 rounded-full shadow-lg hover:bg-red-50 hover:scale-110 transition-all duration-200"
            title="Delete Item"
          >
            <Trash2 className="w-4 h-4 text-red-500" />
          </button>

          {/* Bottom Info on Hover */}
          <div className="absolute bottom-4 left-4 right-4">
            <p className="text-white font-semibold capitalize">
              {item.name || item.category}
            </p>
          </div>
        </div>

        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="bg-white/95 backdrop-blur-sm text-slate-700 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm uppercase tracking-wider">
            {item.category}
          </span>
        </div>
      </div>

      {/* Card Footer */}
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-slate-800 capitalize">
              {item.category}
            </p>
            <p className="text-sm text-slate-500 capitalize">
              {item.color || "No color"}
            </p>
          </div>

          {/* Color Indicator */}
          <div
            className="w-8 h-8 rounded-full border-2 border-slate-200 shadow-inner"
            style={{ backgroundColor: displayColor }}
            title={item.color}
          />
        </div>
      </div>
    </div>
  );
}