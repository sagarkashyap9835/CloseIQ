import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

/* ===================== FEATURES DATA ===================== */

const features = [
  {
    title: "Personalized Outfits",
    description: "AI suggests perfect outfits based on your style, mood, and wardrobe items.",
    icon: "👗",
  },
  {
    title: "Color Detection",
    description: "Smart color matching so your fits never clash again.",
    icon: "🎨",
  },
  {
    title: "Wardrobe Organizer",
    description: "Every cloth digitized. Every outfit remembered.",
    icon: "🧥",
  },
  {
    title: "Weekly Planner",
    description: "Plan your whole week of looks in seconds.",
    icon: "📅",
  },
  {
    title: "Occasion AI",
    description: "From party nights to college mornings — AI picks the vibe.",
    icon: "✨",
  },
];

/* ===================== COMPONENT ===================== */

export default function FeaturesSection() {
  return (
    <section className="py-24 px-4 bg-gray-50 flex flex-col items-center gap-6">
      <h2 className="text-4xl font-medium text-black text-center">
        AI Wardrobe Assistant <br /> Designed To Think With You
      </h2>

      <p className="text-gray-700 max-w-xl text-center">
        Your wardrobe stops being static. AI plans, matches, and styles —
        before you even ask.
      </p>

      <div className="max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
        {features.map((f, idx) => (
          <FeatureCard key={idx} data={f} />
        ))}
      </div>
    </section>
  );
}

/* ===================== CARD ===================== */

function FeatureCard({ data }) {
  const { ref, inView } = useInView({
    threshold: 0.35,
    triggerOnce: false,
  });

  return (
    <motion.div
      ref={ref}
      className={`reveal-card ${inView ? "active" : ""}`}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
    >
      <div className="reveal-inner p-6 space-y-4 shadow-xl rounded-[16px]">
        <div className="icon-ring">
          <span className="text-xl">{data.icon}</span>
        </div>

        <p className="text-lg font-semibold text-black">{data.title}</p>
        <p className="text-sm text-gray-700 leading-relaxed">
          {data.description}
        </p>
      </div>
    </motion.div>
  );
}
