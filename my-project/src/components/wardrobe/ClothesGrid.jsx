import React from "react";
import ClothesCard from "./ClothesCard";

export default function ClothesGrid({ clothes, activeCategory, handleDelete }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
      {clothes
        .filter((item) => item.category === activeCategory)
        .map((item) => (
          <ClothesCard key={item.id} item={item} handleDelete={handleDelete} />
        ))}
    </div>
  );
}
