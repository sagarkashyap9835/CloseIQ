import { motion } from "framer-motion";
import {
  Clock,
  ShoppingBag,
  Leaf,
  Smile,
  TrendingUp,
} from "lucide-react";

export default function Benefits() {
  return (
    <section className="bg-white py-28 px-6">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
        
        {/* Left side..... */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="space-y-10"
        >
          <h2 className="text-4xl font-semibold text-gray-900">
            Why Choose <span className="text-emerald-500">ClosetIQ?</span>
          </h2>

          <p className="text-gray-600 max-w-lg leading-relaxed">
            ClosetIQ is not just a wardrobe app — it’s your quiet stylist,
            planning your looks, saving your time, and evolving your fashion
            story every single day.
          </p>

          <div className="space-y-7">
            <Benefit icon={<Clock size={22} />} title="Save Time Every Morning"
              desc="No more staring into your closet. Get instant outfit ideas that match your mood." />

            <Benefit icon={<ShoppingBag size={22} />} title="Shop Smarter"
              desc="See what you already own before buying duplicates. Spend with intention." />

            <Benefit icon={<Leaf size={22} />} title="Sustainable Fashion"
              desc="Rediscover forgotten clothes. Create more while wasting less." />

            <Benefit icon={<Smile size={22} />} title="Boost Confidence"
              desc="Feel sharp every day with outfits that truly reflect you." />

            <Benefit icon={<TrendingUp size={22} />} title="Style Evolution"
              desc="Track your fashion journey and watch your style level up." />
          </div>
        </motion.div>

     
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="flex justify-center"
        >
       <img
  src="https://pocketstylist.app/screenshots/calendar.png"
  alt="ClosetIQ App UI"
  className="w-60 md:w-80 lg:w-96
    drop-shadow-[0_30px_60px_rgba(16,185,129,0.30)]
    rounded-xl
    hover:scale-105 transition-transform duration-500"
/>




        </motion.div>
      </div>

    
      <div className="max-w-4xl mx-auto grid grid-cols-2 gap-8 mt-20">
        <Stat value="10 min" label="Saved every morning" />
        <Stat value="95%" label="Users feel more confident" />
      </div>
    </section>
  );
}



function Benefit({ icon, title, desc }) {
  return (
    <div className="flex gap-4 items-start">
      <div className="bg-emerald-100 text-emerald-500 p-2 rounded-full">
        {icon}
      </div>
      <div>
        <h4 className="font-medium text-gray-900">{title}</h4>
        <p className="text-sm text-gray-600 max-w-md leading-relaxed">
          {desc}
        </p>
      </div>
    </div>
  );
}

function Stat({ value, label }) {
  return (
    <div className="relative group p-[3px] rounded-full overflow-hidden
      hover:scale-105 transition-transform duration-300
      before:content-[''] before:absolute before:inset-0
      before:bg-[conic-gradient(from_0deg,_#34d399,_#ecfdf5,_#34d399)]
      before:animate-[spin-gradient_6s_linear_infinite]">

      <div className="relative z-10 bg-white rounded-full px-14 py-7 text-center
        shadow-[0_20px_40px_-15px_rgba(16,185,129,0.35)]
        group-hover:shadow-[0_30px_60px_-10px_rgba(16,185,129,0.6)]
        transition-shadow duration-300">

        <p className="text-4xl font-bold text-emerald-500">{value}</p>
        <p className="text-gray-600 text-sm mt-1 tracking-wide">
          {label}
        </p>
      </div>
    </div>
  );
}


