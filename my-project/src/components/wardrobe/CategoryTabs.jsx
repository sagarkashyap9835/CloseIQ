import React from "react";

export default function CategoryTabs({ categories, activeCategory, setActiveCategory }) {
  return (
    <div className="flex gap-4 mb-6">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => setActiveCategory(cat)}
          className={`px-4 py-2 rounded-full font-medium transition ${
            activeCategory === cat
              ? "bg-[#8fbfb2] text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
