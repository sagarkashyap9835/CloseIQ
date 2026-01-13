// import { useState } from "react";
// import CameraCapture from "../components/ai/CameraCapture";
// import ColorPreview from "../components/ai/ColorPreview";
// import OutfitSuggestions from "../components/ai/OutfitSuggest";
// import { detectColorsAndSuggest } from "../components/api/aiApi";
// import AiHero from "../components/ai/AiHero";

// export default function AiSuggestions() {
//   const [colors, setColors] = useState([]);
//   const [outfits, setOutfits] = useState([]);

//   const handleCapture = async (image) => {
//     const res = await detectColorsAndSuggest(image);
//     setColors(res.colors);
//     setOutfits(res.outfits);
//   };

//   return (
//     <div className="p-6">
//       <AiHero />
//       <CameraCapture onCapture={handleCapture} />
//       <ColorPreview colors={colors} />
//       <OutfitSuggestions outfits={outfits} />
//     </div>
//   );
// }


import { useState } from "react";
import CameraCapture from "../components/ai/CameraCapture";
import ColorPreview from "../components/ai/ColorPreview";
import OutfitSuggestions from "../components/ai/OutfitSuggest";
import { detectColorsAndSuggest } from "../components/api/aiApi";
import AiHero from "../components/ai/AiHero";

export default function AiSuggestions() {
  const [colors, setColors] = useState([]);
  const [outfits, setOutfits] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleCapture = async (image) => {
    setLoading(true);
    try {
      const res = await detectColorsAndSuggest(image);
      setColors(res.colors || []);
      setOutfits(res.outfits || []); // Database se matching top/bottom
    } catch (err) {
      console.error("AI Processing failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <AiHero />
      <CameraCapture onCapture={handleCapture} />
      
      {loading && <p className="text-center text-blue-500 font-bold mt-4">AI Analyzing your outfit...</p>}
      
      <ColorPreview colors={colors} />
      <OutfitSuggestions outfits={outfits} />
    </div>
  );
}