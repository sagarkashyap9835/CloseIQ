import { uploadCloth } from "../../components/api/clothesApi";

export default function UploadClothes({ refresh }) {

  const handleUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target); // Yeh line saara data (category, color, image, gender) utha legi
    await uploadCloth(formData);
    refresh();
    e.target.reset();
  };

  return (
    <form
      onSubmit={handleUpload}
      className="bg-white border border-green-300/40 rounded-2xl p-5 mb-8
                 flex flex-wrap items-center gap-4 shadow-sm"
    >
      {/* Category Selection */}
      <select
        name="category"
        className="bg-white text-slate-700 border border-green-400/60 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
      >
        <option value="Tops">Tops</option>
        <option value="Bottoms">Bottoms</option>
        <option value="Footwear">Footwear</option>
        <option value="Accessories">Accessories</option>
      </select>

      {/* Color Selection */}
      <select
        name="color"
        className="bg-white text-slate-700 border border-green-400/60 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
      >
        <option value="red">Red</option>
        <option value="green">Green</option>
        <option value="blue">Blue</option>
        <option value="black">Black</option>
        <option value="white">White</option>
      </select>

      {/* Gender Selection - onChange hata diya gaya hai */}
      <select 
        name="gender" 
        className="bg-white text-slate-700 border border-green-400/60 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
      >
        <option value="men">Men</option>
        <option value="women">Women</option>
        <option value="unisex">Unisex</option>
      </select>

      {/* Image Upload */}
      <label className="relative cursor-pointer">
        <span className="bg-green-50 text-green-700 px-4 py-2 rounded-lg border border-green-300 hover:bg-green-100 transition">
          Choose Image
        </span>
        <input
          type="file"
          name="image"
          required
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
      </label>

      <button
        type="submit"
        className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-500 transition-all shadow-md"
      >
        Upload
      </button>
    </form>
  );
}