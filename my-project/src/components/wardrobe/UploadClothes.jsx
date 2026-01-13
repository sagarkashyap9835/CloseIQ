import { useState } from "react";
import { uploadCloth } from "../../components/api/clothesApi";
import { Upload, ImagePlus, CheckCircle } from "lucide-react";

export default function UploadClothes({ refresh }) {
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleUpload = async (e) => {
    e.preventDefault();
    setUploading(true);
    setUploadSuccess(false);

    try {
      const formData = new FormData(e.target);
      await uploadCloth(formData);
      refresh();
      e.target.reset();
      setSelectedFile(null);
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000);
    } catch (err) {
      console.error("Upload Error:", err);
      alert("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file?.name || null);
  };

  return (
    <form
      onSubmit={handleUpload}
      className="bg-gradient-to-r from-white to-slate-50 border border-slate-200 rounded-3xl p-6 mb-8 shadow-lg"
    >
      <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
        <ImagePlus className="w-5 h-5 text-emerald-500" />
        Add to Wardrobe
      </h3>

      <div className="flex flex-wrap items-center gap-4">
        {/* Category Selection */}
        <div className="flex-1 min-w-[140px]">
          <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">
            Category
          </label>
          <select
            name="category"
            required
            className="w-full bg-white text-slate-700 border border-slate-200 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all"
          >
            <option value="Tops">👕 Tops</option>
            <option value="Bottoms">👖 Bottoms</option>
            <option value="Footwear">👟 Footwear</option>
            <option value="Accessories">⌚ Accessories</option>
          </select>
        </div>

        {/* Color Selection */}
        <div className="flex-1 min-w-[140px]">
          <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">
            Color
          </label>
          <select
            name="color"
            required
            className="w-full bg-white text-slate-700 border border-slate-200 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all"
          >
            <option value="black">⚫ Black</option>
            <option value="white">⚪ White</option>
            <option value="red">🔴 Red</option>
            <option value="blue">🔵 Blue</option>
            <option value="green">🟢 Green</option>
            <option value="yellow">🟡 Yellow</option>
            <option value="pink">🩷 Pink</option>
            <option value="brown">🟤 Brown</option>
            <option value="grey">⚫ Grey</option>
            <option value="beige">🟤 Beige</option>
          </select>
        </div>

        {/* Image Upload */}
        <div className="flex-1 min-w-[160px]">
          <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">
            Image
          </label>
          <label className="relative cursor-pointer block">
            <div className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed transition-all ${selectedFile
                ? "bg-emerald-50 border-emerald-300 text-emerald-700"
                : "bg-slate-50 border-slate-300 text-slate-600 hover:border-emerald-400 hover:bg-emerald-50"
              }`}>
              <ImagePlus className="w-5 h-5" />
              <span className="text-sm font-medium truncate max-w-[120px]">
                {selectedFile || "Choose Image"}
              </span>
            </div>
            <input
              type="file"
              name="image"
              accept="image/*"
              required
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </label>
        </div>

        {/* Upload Button */}
        <div className="flex-shrink-0">
          <label className="block text-xs font-semibold text-transparent mb-1">.</label>
          <button
            type="submit"
            disabled={uploading}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${uploading
                ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                : uploadSuccess
                  ? "bg-emerald-500 text-white"
                  : "bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:shadow-lg hover:shadow-emerald-500/30 hover:scale-105"
              }`}
          >
            {uploading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Uploading...
              </>
            ) : uploadSuccess ? (
              <>
                <CheckCircle className="w-5 h-5" />
                Added!
              </>
            ) : (
              <>
                <Upload className="w-5 h-5" />
                Upload
              </>
            )}
          </button>
        </div>
      </div>

      {/* Success Message */}
      {uploadSuccess && (
        <div className="mt-4 p-3 bg-emerald-50 text-emerald-700 rounded-xl text-sm font-medium flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          Item added to your wardrobe successfully!
        </div>
      )}
    </form>
  );
}