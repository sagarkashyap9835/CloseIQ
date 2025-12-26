import { useRef, useState } from "react";

export default function Categories() {

  const [cards, setCards] = useState([
    {
      title: "Dresses",
      count: "320 Styles",
      img: "https://images.unsplash.com/photo-1520975682031-a6fa0e7ec2a0?q=80&w=800"
    },
    {
      title: "Accessories",
      count: "540 Items",
      img: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800"
    },
    {
      title: "Shoes",
      count: "210 Pairs",
      img: "https://images.unsplash.com/photo-1528701800489-20be3c9b98ad?q=80&w=800"
    },
    {
      title: "Hairstyles",
      count: "120 Looks",
      img: "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?q=80&w=800"
    }
  ]);

  const slider = useRef(null);

  const scroll = (dir) => {
    slider.current.scrollBy({ left: dir === "left" ? -300 : 300, behavior: "smooth" });
  };

  const addCard = () => {
    setCards([...cards, {
      title: "New Style",
      count: "0 Items",
      img: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=800"
    }]);
  };

  return (
    <section className="py-14 px-4 md:px-16 bg-gradient-to-br from-[#0f2f2a] to-[#1f4f47] text-white">

      {/* Heading */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-semibold">Explore Your Wardrobe</h2>
          <p className="text-sm text-[#b8d9cf] mt-1">
            Slide. Add. Style. Your closet just went cosmic.
          </p>
        </div>

        <div className="hidden md:flex gap-3">
          <button onClick={() => scroll("left")} className="size-9 rounded-full bg-white/20 hover:bg-white/30">←</button>
          <button onClick={() => scroll("right")} className="size-9 rounded-full bg-white/20 hover:bg-white/30">→</button>
        </div>
      </div>

      {/* Slider */}
      <div
        ref={slider}
        className="flex gap-6 overflow-x-auto scroll-smooth no-scrollbar pl-1 pb-4"
      >

        {/* Add Card */}
        <div onClick={addCard}
          className="min-w-[260px] h-[260px] rounded-2xl border-2 border-dashed border-[#a9d6ca]
          flex flex-col items-center justify-center text-[#d4efe7] hover:bg-white/10 cursor-pointer">
          <div className="text-5xl">+</div>
          <p className="text-sm mt-1">Add New Item</p>
        </div>

        {cards.map((item, i) => (
          <div key={i}
            className="min-w-[260px] bg-white text-gray-800 rounded-2xl p-4 shadow-lg hover:-translate-y-1 transition">
            <img src={item.img} className="h-44 w-full object-cover rounded-xl" />
            <h3 className="mt-4 text-lg font-semibold text-[#1f4f47]">{item.title}</h3>
            <p className="text-sm text-gray-500">{item.count}</p>
          </div>
        ))}

      </div>
    </section>
  );
}
