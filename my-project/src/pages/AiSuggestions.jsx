import { useState } from "react";
import CameraCapture from "../components/ai/CameraCapture";
import OutfitSuggest from "../components/ai/OutfitSuggest";
import { detectAndSuggest } from "../components/api/aiApi";
import AiHero from "../components/ai/AiHero";
import { Sparkles, Camera, Shirt } from "lucide-react";

export default function AiSuggestions() {
  const [aiResult, setAiResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleDetection = async (imageData, detectedCategory, detectedColor) => {
    setLoading(true);
    setError(null);

    try {
      // Send to backend with detected category and color
      const result = await detectAndSuggest(imageData, detectedCategory, detectedColor);
      setAiResult(result);
    } catch (err) {
      console.error("AI Processing failed:", err);
      setError("Unable to connect to AI server. Make sure backend is running!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30">
      <AiHero />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Section Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-800 flex items-center justify-center gap-2">
            <Camera className="w-6 h-6 text-emerald-500" />
            Scan Your Outfit
          </h2>
          <p className="text-slate-500 mt-2">
            Point your camera at your outfit and let AI suggest the perfect match
          </p>
        </div>

        {/* Camera Section */}
        <div className="bg-white rounded-3xl shadow-xl p-6 mb-8">
          <CameraCapture onDetectionComplete={handleDetection} />
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-flex items-center gap-3 px-6 py-4 bg-emerald-50 rounded-2xl">
              <div className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin" />
              <div className="text-left">
                <p className="font-semibold text-emerald-700">AI is thinking...</p>
                <p className="text-sm text-emerald-600">Finding perfect matches from your wardrobe</p>
              </div>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-xl">⚠️</span>
              </div>
              <div>
                <p className="font-semibold text-red-700">Connection Error</p>
                <p className="text-sm text-red-600">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* AI Results */}
        {aiResult && !loading && (
          <OutfitSuggest data={aiResult} />
        )}

        {/* How It Works Section */}
        {!aiResult && !loading && (
          <div className="bg-white rounded-3xl shadow-lg p-8 mt-8">
            <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-500" />
              How It Works
            </h3>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: "📸",
                  title: "1. Scan",
                  desc: "Point camera at your current outfit"
                },
                {
                  icon: "🔍",
                  title: "2. Detect",
                  desc: "AI identifies what you're wearing & its color"
                },
                {
                  icon: "✨",
                  title: "3. Match",
                  desc: "Get perfect suggestions from your wardrobe"
                }
              ].map((step, i) => (
                <div key={i} className="text-center p-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl">
                    {step.icon}
                  </div>
                  <h4 className="font-bold text-slate-700">{step.title}</h4>
                  <p className="text-sm text-slate-500 mt-1">{step.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 p-4 bg-amber-50 rounded-2xl border border-amber-100">
              <p className="text-sm text-amber-700 flex items-center gap-2">
                <Shirt className="w-4 h-4" />
                <span>
                  <strong>Pro Tip:</strong> Upload your clothes to "My Wardrobe" first for better suggestions!
                </span>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}