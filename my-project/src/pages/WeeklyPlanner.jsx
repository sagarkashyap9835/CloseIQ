import { useState, useEffect } from "react";
import axios from "axios";
import { Calendar, RefreshCw, Sparkles, Shirt, Footprints, Watch, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";

const API_URL = "http://localhost:5000/api/aiApi";

export default function WeeklyPlanner() {
    const [weeklyPlan, setWeeklyPlan] = useState([]);
    const [stats, setStats] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedDay, setSelectedDay] = useState(null);

    const fetchWeeklyPlan = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await axios.get(`${API_URL}/weekly-plan`);
            setWeeklyPlan(res.data.weeklyPlan || []);
            setStats(res.data.stats || {});
        } catch (err) {
            console.error("Failed to fetch weekly plan:", err);
            setError("Unable to generate weekly plan. Make sure backend is running!");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWeeklyPlan();
    }, []);

    const getImageUrl = (item) => {
        if (!item?.image) return null;
        return item.image.startsWith("http")
            ? item.image
            : `http://localhost:5000/uploads/${item.image}`;
    };

    const dayColors = {
        Monday: "from-blue-500 to-blue-600",
        Tuesday: "from-purple-500 to-purple-600",
        Wednesday: "from-emerald-500 to-teal-500",
        Thursday: "from-orange-500 to-amber-500",
        Friday: "from-pink-500 to-rose-500",
        Saturday: "from-indigo-500 to-violet-500",
        Sunday: "from-red-500 to-rose-600"
    };

    const renderOutfitItem = (item, type, icon) => {
        if (!item) {
            return (
                <div className="bg-slate-100 rounded-xl p-3 flex items-center gap-3 border-2 border-dashed border-slate-300">
                    {icon}
                    <span className="text-slate-400 text-sm">No {type} added</span>
                </div>
            );
        }

        return (
            <div className="bg-white rounded-xl p-3 flex items-center gap-3 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                <img
                    src={getImageUrl(item)}
                    alt={type}
                    className="w-14 h-14 rounded-lg object-cover"
                    onError={(e) => {
                        e.target.src = "https://placehold.co/100x100/f1f5f9/475569?text=?";
                    }}
                />
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-700 capitalize truncate">
                        {item.color} {item.category}
                    </p>
                    <p className="text-xs text-slate-400">{type}</p>
                </div>
                <div
                    className="w-4 h-4 rounded-full border border-slate-200"
                    style={{ backgroundColor: item.color || "#9ca3af" }}
                />
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/30">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white py-12 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div>
                            <h1 className="text-4xl font-bold flex items-center gap-3">
                                <Calendar className="w-10 h-10" />
                                Weekly Planner
                            </h1>
                            <p className="mt-2 text-purple-200 text-lg">
                                AI-generated outfit plan for your entire week
                            </p>
                        </div>

                        <button
                            onClick={fetchWeeklyPlan}
                            disabled={loading}
                            className={`flex items-center gap-2 px-6 py-3 bg-white/20 hover:bg-white/30 rounded-xl font-semibold transition-all ${loading ? "opacity-50 cursor-not-allowed" : ""
                                }`}
                        >
                            <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
                            Regenerate Plan
                        </button>
                    </div>

                    {/* Stats */}
                    <div className="flex flex-wrap gap-4 mt-6">
                        <div className="bg-white/10 backdrop-blur-sm px-5 py-3 rounded-2xl">
                            <p className="text-2xl font-bold">{stats.totalTops || 0}</p>
                            <p className="text-sm text-purple-200">Tops</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm px-5 py-3 rounded-2xl">
                            <p className="text-2xl font-bold">{stats.totalBottoms || 0}</p>
                            <p className="text-sm text-purple-200">Bottoms</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm px-5 py-3 rounded-2xl">
                            <p className="text-2xl font-bold">{stats.totalFootwear || 0}</p>
                            <p className="text-sm text-purple-200">Footwear</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm px-5 py-3 rounded-2xl">
                            <p className="text-2xl font-bold">{stats.totalAccessories || 0}</p>
                            <p className="text-sm text-purple-200">Accessories</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-6 py-8">
                {/* Loading */}
                {loading && (
                    <div className="text-center py-16">
                        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto" />
                        <p className="mt-4 text-slate-500">Generating your weekly plan...</p>
                    </div>
                )}

                {/* Error */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-8">
                        <div className="flex items-center gap-3">
                            <AlertCircle className="w-6 h-6 text-red-500" />
                            <div>
                                <p className="font-semibold text-red-700">Error</p>
                                <p className="text-sm text-red-600">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Weekly Grid */}
                {!loading && weeklyPlan.length > 0 && (
                    <>
                        {/* Desktop View - Grid */}
                        <div className="hidden md:grid md:grid-cols-7 gap-3 mb-8">
                            {weeklyPlan.map((dayPlan, index) => (
                                <button
                                    key={dayPlan.day}
                                    onClick={() => setSelectedDay(selectedDay === index ? null : index)}
                                    className={`p-3 rounded-2xl text-center transition-all ${selectedDay === index
                                            ? `bg-gradient-to-br ${dayColors[dayPlan.day]} text-white shadow-lg scale-105`
                                            : "bg-white text-slate-700 hover:shadow-md border border-slate-200"
                                        }`}
                                >
                                    <p className="font-bold text-sm">{dayPlan.day.slice(0, 3)}</p>
                                    <div className="mt-2 flex justify-center gap-1">
                                        {dayPlan.outfit.top && <div className="w-2 h-2 bg-emerald-400 rounded-full" />}
                                        {dayPlan.outfit.bottom && <div className="w-2 h-2 bg-blue-400 rounded-full" />}
                                        {dayPlan.outfit.footwear && <div className="w-2 h-2 bg-purple-400 rounded-full" />}
                                        {dayPlan.outfit.accessory && <div className="w-2 h-2 bg-pink-400 rounded-full" />}
                                    </div>
                                </button>
                            ))}
                        </div>

                        {/* Day Cards */}
                        <div className="space-y-4">
                            {weeklyPlan.map((dayPlan, index) => (
                                <div
                                    key={dayPlan.day}
                                    className={`bg-white rounded-3xl shadow-lg overflow-hidden border border-slate-100 transition-all ${selectedDay !== null && selectedDay !== index ? "opacity-50 scale-98" : ""
                                        }`}
                                >
                                    {/* Day Header */}
                                    <div className={`bg-gradient-to-r ${dayColors[dayPlan.day]} p-4 text-white`}>
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-bold text-xl">{dayPlan.day}</h3>
                                            <Sparkles className="w-5 h-5 text-white/70" />
                                        </div>
                                    </div>

                                    {/* Outfit Grid */}
                                    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                                        {renderOutfitItem(dayPlan.outfit.top, "Top", <Shirt className="w-5 h-5 text-slate-400" />)}
                                        {renderOutfitItem(dayPlan.outfit.bottom, "Bottom", <Shirt className="w-5 h-5 text-slate-400 rotate-180" />)}
                                        {renderOutfitItem(dayPlan.outfit.footwear, "Footwear", <Footprints className="w-5 h-5 text-slate-400" />)}
                                        {renderOutfitItem(dayPlan.outfit.accessory, "Accessory", <Watch className="w-5 h-5 text-slate-400" />)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {/* Empty State */}
                {!loading && !error && weeklyPlan.length === 0 && (
                    <div className="text-center py-16 px-6 bg-white rounded-3xl shadow-sm border border-slate-100">
                        <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Calendar className="w-10 h-10 text-purple-500" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-700 mb-2">
                            No outfits in your wardrobe!
                        </h3>
                        <p className="text-slate-500 max-w-md mx-auto mb-6">
                            Add some clothes to your wardrobe first, then come back here to generate your weekly outfit plan.
                        </p>
                        <a
                            href="/my-wardrobe"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                        >
                            <Shirt className="w-5 h-5" />
                            Go to Wardrobe
                        </a>
                    </div>
                )}

                {/* Tips Section */}
                {!loading && weeklyPlan.length > 0 && (
                    <div className="mt-8 p-6 bg-gradient-to-r from-slate-50 to-purple-50 rounded-3xl border border-slate-200">
                        <h3 className="font-bold text-slate-700 mb-3 flex items-center gap-2">
                            💡 Tips
                        </h3>
                        <ul className="space-y-2 text-sm text-slate-600">
                            <li>• Click <strong>Regenerate Plan</strong> to get new outfit combinations</li>
                            <li>• Add more clothes to your wardrobe for more variety</li>
                            <li>• The AI tries to avoid repeating the same outfit twice in a week</li>
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}
