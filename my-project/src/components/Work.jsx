import { motion } from "framer-motion";

export default function HowItWorks() {
  const steps = [
    {
      id: "01",
      title: "Build Your Digital Closet",
      desc: "Snap your outfits, tag colors, categories and moods. Your chaotic cupboard turns into a calm digital museum.",
      sub: "AI groups similar items and tracks how often you actually wear them.",
      img: "https://pocketstylist.app/screenshots/closet_tab.png"
    },
    {
      id: "02",
      title: "AI Reads Your Style",
      desc: "ClosetIQ studies your color palette, layering habits and patterns like it’s reading your soul.",
      sub: "No guessing. No filters. Just data-driven drip.",
      img: "https://pocketstylist.app/screenshots/today_tab_daily_reccomendations.png"
    },
    {
      id: "03",
      title: "Outfit Suggestions",
      desc: "Every day starts with clarity — weather based looks, mood based layers, occasion perfect fits.",
      sub: "Your personal stylist never sleeps.",
      img: "https://pocketstylist.app/screenshots/virtual_try_on_result.png"
    },
    {
      id: "04",
      title: "Weekly Outfit Planner",
      desc: "No repeats. No rush. Just a 7-day fashion roadmap designed only for you.",
      sub: "Because confidence loves preparation.",
      img: "https://pocketstylist.app/screenshots/feedback_result_score_hype.png"
    },
  ];

  return (
<section className="bg-gradient-to-br from-[#0f2f2a] to-[#1f4f47] 
text-white py-24 px-8 sm:px-14 md:px-32 lg:px-56 xl:px-72">


      <h2 className="text-3xl md:text-4xl font-semibold text-center mb-20">
        How ClosetIQ Works
      </h2>

      <div className="flex flex-col gap-28">
        {steps.map((step, i) => (
          <motion.div
  key={i}
  initial={{ opacity: 0, x: i % 2 === 0 ? -120 : 120 }}
  whileInView={{ opacity: 1, x: 0 }}
  transition={{ duration: 0.8, ease: "easeOut", delay: i * 0.12 }}
  viewport={{ once: true }}
  className={`flex flex-col md:flex-row items-center justify-between md:gap-12 gap-6 ${
    i % 2 !== 0 && "md:flex-row-reverse"
  }`}
>

         
            <div className="max-w-xl">
              <span className="text-[#8fbfb2] text-5xl font-bold block mb-3">
                {step.id}
              </span>

              <h3 className="text-2xl md:text-3xl font-semibold mb-3">
                {step.title}
              </h3>

              <p className="text-[#b8d9cf] text-base leading-relaxed">
                {step.desc}
              </p>

              <p className="text-[#7fc7b7] text-sm mt-3 italic">
                {step.sub}
              </p>
            </div>

         
            <div className="hidden md:flex bg-white/10 backdrop-blur-xl p-3 rounded-[2.5rem] shadow-2xl h-[520px] w-[260px]">
              <img
                src={step.img}
                alt={step.title}
                className="rounded-[2rem] object-cover w-full h-full"
              />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
