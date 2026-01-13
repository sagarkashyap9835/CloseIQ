import { ShoppingBag, Sparkles, AlertCircle, ExternalLink, Shirt, Footprints, Watch } from "lucide-react";

export default function OutfitSuggest({ data }) {
  if (!data) return null;

  const suggestions = data?.suggestions || {};
  const mainItems = suggestions.main || suggestions.outfits || [];
  const footwearItems = suggestions.footwear || [];
  const accessoryItems = suggestions.accessories || [];

  const message = data?.message || "";
  const needNewClothes = data?.needNewClothes || false;
  const shoppingList = data?.shoppingList || [];
  const detectedOutfit = data?.detectedOutfit || null;
  const mainCategory = data?.mainCategory || "Items";
  const stats = data?.stats || {};

  const renderItemCard = (item, index, isFirst = false) => {
    if (!item) return null;

    const finalImageUrl = item.image?.startsWith("http")
      ? item.image
      : `http://localhost:5000/uploads/${item.image}`;

    return (
      <div
        key={item._id || index}
        className="group relative bg-white rounded-2xl shadow-md border border-slate-100 hover:shadow-xl hover:border-emerald-200 transition-all duration-300 overflow-hidden"
      >
        {isFirst && (
          <div className="absolute top-2 right-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg z-10">
            ⭐ Best
          </div>
        )}

        <div className="relative overflow-hidden">
          <img
            src={finalImageUrl}
            alt={item.category || "Item"}
            className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.target.src = "https://placehold.co/300x200/f1f5f9/475569?text=No+Image";
            }}
          />
        </div>

        <div className="p-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full uppercase">
              {item.category}
            </span>
            <div
              className="w-5 h-5 rounded-full border-2 border-slate-200 shadow-inner"
              style={{ backgroundColor: item.color || "#gray" }}
              title={item.color}
            />
          </div>
          <p className="text-sm font-medium text-slate-700 capitalize mt-2">
            {item.color || "Classic"} {item.category?.toLowerCase()}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="mt-8 space-y-6">
      {/* Detection Summary */}
      {detectedOutfit && (
        <div className="p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-2xl border border-slate-200">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-xl shadow-inner border-2 border-white"
              style={{ backgroundColor: detectedOutfit.color !== "unknown" ? detectedOutfit.color : "#9ca3af" }}
            />
            <div>
              <p className="text-sm text-slate-500">You're wearing</p>
              <p className="font-bold text-lg text-slate-800 capitalize">
                {detectedOutfit.color} {detectedOutfit.category}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* AI Message */}
      {message && (
        <div className={`p-4 rounded-2xl ${needNewClothes
            ? "bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200"
            : "bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200"
          }`}>
          <div className="flex items-start gap-3">
            {needNewClothes ? (
              <AlertCircle className="w-6 h-6 text-amber-500 flex-shrink-0 mt-0.5" />
            ) : (
              <Sparkles className="w-6 h-6 text-emerald-500 flex-shrink-0 mt-0.5" />
            )}
            <p className={`font-medium ${needNewClothes ? "text-amber-800" : "text-emerald-800"}`}>
              {message}
            </p>
          </div>
        </div>
      )}

      {/* Shopping Recommendation */}
      {needNewClothes && shoppingList.length > 0 && (
        <div className="p-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl text-white shadow-xl">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-2xl">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-xl mb-1">Shopping Time! 🛍️</h3>
              <p className="text-white/80 text-sm">
                Missing: {shoppingList.join(", ")}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mt-4">
            {["Myntra", "Ajio", "Amazon"].map((store) => (
              <a
                key={store}
                href={`https://www.google.com/search?q=${store}+${shoppingList[0] || "clothes"}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-sm font-medium transition-colors"
              >
                {store}
                <ExternalLink className="w-3 h-3" />
              </a>
            ))}
          </div>
        </div>
      )}

      {/* ===== MAIN CLOTHING SUGGESTIONS ===== */}
      {mainItems.length > 0 && (
        <div className="bg-white rounded-3xl shadow-lg p-6 border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Shirt className="w-5 h-5 text-emerald-500" />
            {mainCategory}
            {stats.mainMatched > 0 && (
              <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full ml-2">
                {stats.mainMatched} color matched
              </span>
            )}
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {mainItems.map((item, index) => renderItemCard(item, index, index === 0))}
          </div>
        </div>
      )}

      {/* ===== FOOTWEAR SUGGESTIONS ===== */}
      {footwearItems.length > 0 && (
        <div className="bg-white rounded-3xl shadow-lg p-6 border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Footprints className="w-5 h-5 text-blue-500" />
            Footwear
            {stats.footwearMatched > 0 && (
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full ml-2">
                {stats.footwearMatched} matching
              </span>
            )}
          </h3>

          <div className="grid grid-cols-2 gap-4">
            {footwearItems.map((item, index) => renderItemCard(item, index))}
          </div>
        </div>
      )}

      {/* ===== ACCESSORIES SUGGESTIONS ===== */}
      {accessoryItems.length > 0 && (
        <div className="bg-white rounded-3xl shadow-lg p-6 border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Watch className="w-5 h-5 text-purple-500" />
            Accessories
            {stats.accessoriesMatched > 0 && (
              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full ml-2">
                {stats.accessoriesMatched} matching
              </span>
            )}
          </h3>

          <div className="grid grid-cols-2 gap-4">
            {accessoryItems.map((item, index) => renderItemCard(item, index))}
          </div>
        </div>
      )}

      {/* Complete Outfit Summary */}
      {(mainItems.length > 0 || footwearItems.length > 0 || accessoryItems.length > 0) && (
        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-3xl p-6 text-white">
          <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Complete Look
          </h3>
          <div className="flex flex-wrap gap-3">
            {detectedOutfit && (
              <span className="bg-white/20 px-4 py-2 rounded-xl text-sm">
                👕 Your {detectedOutfit.category}
              </span>
            )}
            {mainItems[0] && (
              <span className="bg-white/20 px-4 py-2 rounded-xl text-sm">
                + {mainItems[0].color} {mainItems[0].category}
              </span>
            )}
            {footwearItems[0] && (
              <span className="bg-white/20 px-4 py-2 rounded-xl text-sm">
                + {footwearItems[0].color} {footwearItems[0].category}
              </span>
            )}
            {accessoryItems[0] && (
              <span className="bg-white/20 px-4 py-2 rounded-xl text-sm">
                + {accessoryItems[0].color} Accessory
              </span>
            )}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!mainItems.length && !footwearItems.length && !accessoryItems.length && !needNewClothes && (
        <div className="text-center py-12 px-6 bg-slate-50 rounded-3xl">
          <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-600 mb-2">Ready to Style!</h3>
          <p className="text-slate-400">Scan your outfit to get complete suggestions.</p>
        </div>
      )}
    </div>
  );
}