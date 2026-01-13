import { Sparkles, Camera, Zap } from "lucide-react";

export default function AiHero() {
  return (
    <section className="w-full bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700 px-6 md:px-16 lg:px-24 xl:px-32 py-16 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-400/10 rounded-full blur-3xl" />

      <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-12 relative z-10">

        {/* LEFT TEXT */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <span className="bg-white/20 backdrop-blur-sm text-white text-xs px-4 py-2 rounded-full mb-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            AI-Powered Outfit Suggestions
          </span>

          <h1 className="text-4xl md:text-5xl font-bold leading-tight text-white max-w-xl">
            Scan Your Outfit.
            <br />
            <span className="text-emerald-200">Get Perfect Matches.</span>
          </h1>

          <p className="text-emerald-100 max-w-lg mt-4 text-lg">
            Point your camera at what you're wearing. Our AI analyzes colors & style,
            then suggests the perfect matching items from your wardrobe.
          </p>

          {/* Features */}
          <div className="flex flex-wrap gap-4 mt-8">
            {[
              { icon: Camera, text: "Live Camera Scan" },
              { icon: Zap, text: "Instant Detection" },
              { icon: Sparkles, text: "Smart Matching" }
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl text-white text-sm"
              >
                <item.icon className="w-4 h-4 text-emerald-200" />
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT VISUAL */}
        <div className="relative">
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 border border-white/20">
            <div className="w-72 h-72 bg-gradient-to-br from-emerald-400/30 to-teal-400/30 rounded-2xl flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <Camera className="w-10 h-10 text-white" />
                </div>
                <p className="text-white font-medium">Camera Ready</p>
                <p className="text-emerald-200 text-sm mt-1">Scroll down to start</p>
              </div>
            </div>
          </div>

          {/* Floating Stats */}
          <div className="absolute -bottom-4 -left-4 bg-white px-4 py-3 rounded-2xl shadow-xl">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500">AI Accuracy</p>
                <p className="font-bold text-slate-800">95%+</p>
              </div>
            </div>
          </div>

          <div className="absolute -top-4 -right-4 bg-white px-4 py-3 rounded-2xl shadow-xl">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                ⚡
              </div>
              <div>
                <p className="text-xs text-slate-500">Detection</p>
                <p className="font-bold text-slate-800">~2sec</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
