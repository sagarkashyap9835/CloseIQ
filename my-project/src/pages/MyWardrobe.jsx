import { useEffect, useState } from "react";
import { getClothes, deleteCloth } from "../components/api/clothesApi";
import UploadClothes from "../components/wardrobe/UploadClothes";
import ClothesGrid from "../components/wardrobe/ClothesGrid";
import { Shirt, Filter, Sparkles } from "lucide-react";

export default function MyWardrobe() {
  const [clothes, setClothes] = useState([]);
  const [filteredClothes, setFilteredClothes] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  const categories = ["All", "Tops", "Bottoms", "Footwear", "Accessories"];

  const fetchClothes = async () => {
    try {
      setLoading(true);
      const data = await getClothes();
      setClothes(data.clothes || []);
      setFilteredClothes(data.clothes || []);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteCloth(id);
      setClothes(prev => prev.filter(item => item._id !== id));
      setFilteredClothes(prev => prev.filter(item => item._id !== id));
    } catch (err) {
      console.error("Delete Error:", err);
    }
  };

  // Filter by category
  const handleCategoryFilter = (category) => {
    setActiveCategory(category);
    if (category === "All") {
      setFilteredClothes(clothes);
    } else {
      setFilteredClothes(clothes.filter(item => item.category === category));
    }
  };

  useEffect(() => {
    fetchClothes();
  }, []);

  // Update filtered when clothes change
  useEffect(() => {
    handleCategoryFilter(activeCategory);
  }, [clothes]);

  // Category counts
  const getCategoryCount = (cat) => {
    if (cat === "All") return clothes.length;
    return clothes.filter(item => item.category === cat).length;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold flex items-center gap-3">
            <Shirt className="w-10 h-10" />
            My AI Wardrobe
          </h1>
          <p className="mt-2 text-emerald-100 text-lg">
            Organize your clothes and let AI suggest perfect outfits
          </p>

          {/* Stats */}
          <div className="flex gap-6 mt-6">
            <div className="bg-white/10 backdrop-blur-sm px-5 py-3 rounded-2xl">
              <p className="text-3xl font-bold">{clothes.length}</p>
              <p className="text-sm text-emerald-200">Total Items</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm px-5 py-3 rounded-2xl">
              <p className="text-3xl font-bold">{getCategoryCount("Tops")}</p>
              <p className="text-sm text-emerald-200">Tops</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm px-5 py-3 rounded-2xl">
              <p className="text-3xl font-bold">{getCategoryCount("Bottoms")}</p>
              <p className="text-sm text-emerald-200">Bottoms</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Upload Section */}
        <UploadClothes refresh={fetchClothes} />

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-slate-500" />
            <h3 className="font-semibold text-slate-700">Filter by Category</h3>
          </div>

          <div className="flex flex-wrap gap-3">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => handleCategoryFilter(cat)}
                className={`px-5 py-2.5 rounded-xl font-medium transition-all duration-300 ${activeCategory === cat
                    ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30 scale-105"
                    : "bg-white text-slate-600 border border-slate-200 hover:border-emerald-300 hover:text-emerald-600"
                  }`}
              >
                {cat}
                <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${activeCategory === cat
                    ? "bg-white/20"
                    : "bg-slate-100"
                  }`}>
                  {getCategoryCount(cat)}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-16">
            <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="mt-4 text-slate-500">Loading your wardrobe...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredClothes.length === 0 && (
          <div className="text-center py-16 px-6 bg-white rounded-3xl shadow-sm border border-slate-100">
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Shirt className="w-10 h-10 text-emerald-500" />
            </div>
            <h3 className="text-xl font-bold text-slate-700 mb-2">
              {activeCategory === "All"
                ? "Your wardrobe is empty!"
                : `No ${activeCategory} found`
              }
            </h3>
            <p className="text-slate-500 max-w-md mx-auto">
              {activeCategory === "All"
                ? "Start by uploading your clothes above. The AI will use these to suggest perfect outfit combinations."
                : `You haven't added any ${activeCategory.toLowerCase()} yet. Upload some to get started!`
              }
            </p>
          </div>
        )}

        {/* Clothes Grid */}
        {!loading && filteredClothes.length > 0 && (
          <>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-700 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-yellow-500" />
                Showing {filteredClothes.length} item{filteredClothes.length !== 1 ? 's' : ''}
              </h3>
            </div>
            <ClothesGrid clothes={filteredClothes} remove={handleDelete} />
          </>
        )}
      </div>
    </div>
  );
}
