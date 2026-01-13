import { Palette } from "lucide-react";

export default function ColorPreview({ colors, detectedOutfit }) {
  if ((!colors || colors.length === 0) && !detectedOutfit) return null;

  // Color name to actual color
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
    beige: "#d4a574",
    unknown: "#9ca3af"
  };

  const getColorValue = (colorName) => {
    if (!colorName) return "#9ca3af";
    if (colorName.startsWith("#")) return colorName;
    return colorMap[colorName.toLowerCase()] || colorName;
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Palette className="w-5 h-5 text-emerald-500" />
        <h3 className="font-semibold text-slate-700">Detected Colors</h3>
      </div>

      <div className="flex flex-wrap gap-4 items-center">
        {detectedOutfit && (
          <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-xl">
            <div
              className="w-10 h-10 rounded-full shadow-inner border-2 border-white"
              style={{ backgroundColor: getColorValue(detectedOutfit.color) }}
            />
            <div>
              <p className="text-xs text-slate-500">You're wearing</p>
              <p className="font-semibold text-slate-700 capitalize">
                {detectedOutfit.color} {detectedOutfit.category}
              </p>
            </div>
          </div>
        )}

        {colors && colors.length > 0 && (
          <div className="flex gap-3">
            {colors.map((c, i) => (
              <div key={i} className="text-center">
                <div
                  className="w-12 h-12 rounded-full shadow-lg border-2 border-white ring-2 ring-slate-100"
                  style={{ backgroundColor: getColorValue(c) }}
                  title={c}
                />
                <p className="text-xs text-slate-500 mt-1 capitalize">{c}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
