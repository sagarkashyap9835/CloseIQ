import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CategoryTabs from "../components/wardrobe/CategoryTabs";
import UploadButton from "../components/wardrobe/UploadButton";
import ClothesGrid from "../components/wardrobe/ClothesGrid";

const initialClothes = [
  { id: 1, name: "Red T-Shirt", category: "Tops", image: "https://via.placeholder.com/150" },
  { id: 2, name: "Blue Jeans", category: "Bottoms", image: "https://via.placeholder.com/150" },
  { id: 3, name: "Sneakers", category: "Footwear", image: "https://via.placeholder.com/150" },
  { id: 4, name: "Sunglasses", category: "Accessories", image: "https://via.placeholder.com/150" },
];

export default function MyWardrobe() {
  const [clothes, setClothes] = useState(initialClothes);
  const [activeCategory, setActiveCategory] = useState("Tops");

  const categories = ["Tops", "Bottoms", "Footwear", "Accessories"];

  const handleDelete = (id) => setClothes(clothes.filter((item) => item.id !== id));

  const handleUpload = () => {
    const newCloth = {
      id: Date.now(),
      name: "New Item",
      category: activeCategory,
      image: "https://via.placeholder.com/150",
    };
    setClothes([...clothes, newCloth]);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 px-6 md:px-12 lg:px-20 py-12">
        <h1 className="text-3xl font-bold mb-6">My Wardrobe</h1>

        <CategoryTabs
          categories={categories}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
        />

        <UploadButton handleUpload={handleUpload} />

        <ClothesGrid
          clothes={clothes}
          activeCategory={activeCategory}
          handleDelete={handleDelete}
        />
      </main>
      <Footer />
    </div>
  );
}
