export default function Hero() {
  return (
    <section className="flex flex-col md:flex-row items-center justify-between min-h-screen px-6 md:px-16 lg:px-24 xl:px-32 bg-gradient-to-br from-[#0f2f2a] to-[#1f4f47] text-white overflow-hidden py-20">

      {/* Left Content */}
      <div className="flex flex-col items-center md:items-start max-w-xl">

        {/* Community Badge */}
        <div className="flex flex-wrap items-center justify-center p-2 rounded-full border border-slate-400 text-[#b8d9cf] text-[12px]">
          <div className="flex items-center">
            <img className="w-8 h-8 rounded-full border-2 border-white"
              src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=50" />
            <img className="w-8 h-8 rounded-full border-2 border-white -translate-x-2"
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=50" />
            <img className="w-8 h-8 rounded-full border-2 border-white -translate-x-4"
              src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=50" />
          </div>
          <p className="-translate-x-2">Join 1M+ fashion lovers</p>
        </div>

        {/* Heading */}
        <h1 className="text-center md:text-left text-5xl md:text-6xl lg:text-7xl leading-tight font-bold mt-6">
          Your Smart Closet <br /> Powered by AI
        </h1>

        {/* Subtitle */}
        <p className="text-center md:text-left text-sm md:text-base text-[#b8d9cf] max-w-md mt-4">
          Upload your wardrobe. Let AI craft outfits, detect colors,
          and design your week in style.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-8 text-sm">
          {/* Silver Glow Button for Upload Clothes */}
          <div className="silver-glow relative z-0 bg-white/15 overflow-hidden p-0.5 flex items-center justify-center rounded-full hover:scale-105 transition duration-300 active:scale-100">
            <button className="px-8 text-sm py-3 text-white rounded-full font-medium bg-gray-900/80 backdrop-blur">
              Upload Clothes
            </button>
          </div>

          {/* Silver Glow Button for Watch Demo */}
          <div className="silver-glow relative z-0 bg-white/15 overflow-hidden p-0.5 flex items-center justify-center rounded-full hover:scale-105 transition duration-300 active:scale-100">
            <button className="flex items-center gap-2 px-6 py-3 border border-[#a9d6ca] text-[#d4efe7] rounded-full hover:bg-white/10">
              Watch Demo
            </button>
          </div>
        </div>
      </div>

      {/* Right Floating Images */}
      <div className="relative mt-16 md:mt-0 w-[300px] sm:w-[400px] lg:w-[480px] h-[440px]">

        {/* Main Center Image */}
        <img
          src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/hero/hero-section-showcase-4.png"
          className="absolute top-0 left-1/2 -translate-x-1/2 w-56 sm:w-64 lg:w-72 drop-shadow-2xl z-20"
        />

        {/* Floating Left */}
        <img
          src="https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=400"
          className="absolute top-24 -left-4 w-28 sm:w-32 lg:w-36 rounded-xl rotate-[-8deg] shadow-xl opacity-90"
        />

        {/* Floating Right */}
        <img
          src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=400"
          className="absolute top-28 -right-4 w-28 sm:w-32 lg:w-36 rounded-xl rotate-[6deg] shadow-xl opacity-90"
        />

        {/* Bottom Card */}
        <img
          src="https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=400"
          className="absolute bottom-4 left-1/2 -translate-x-1/2 w-32 sm:w-36 lg:w-40 rounded-xl shadow-xl opacity-95"
        />
      </div>

      {/* Silver Glow CSS */}
      <style>{`
        @keyframes rotate {
          100% {
            transform: rotate(1turn);
          }
        }
    
        .silver-glow::before {
          content: '';
          position: absolute;
          z-index: -2;
          left: -50%;
          top: -50%;
          width: 200%;
          height: 200%;
          background-position: 100% 50%;
          background-repeat: no-repeat;
          background-size: 50% 30%;
          filter: blur(6px);
          background-image: linear-gradient(45deg, #ffffff, #c0c0c0, #ffffff);
          animation: rotate 4s linear infinite;
        }
      `}</style>
    </section>
  );
}
