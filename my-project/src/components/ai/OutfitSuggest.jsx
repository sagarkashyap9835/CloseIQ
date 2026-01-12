// import { detectColorsAndSuggest } from "../api/aiApi";
// import { useEffect, useState } from "react";

// export default function OutfitSuggest({ outfits }) {
//   if (!outfits || outfits.length === 0) return null;

//   return (
//     <div>
//       <h2>✨ AI Outfit Suggestions</h2>
//       {outfits.map((item) => (
//         <p key={item._id}>{item.image}</p>
//       ))}
//     </div>
//   );
// }


export default function OutfitSuggest({ outfits }) {
  if (!outfits || outfits.length === 0) return null;

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4 text-slate-800 flex items-center gap-2">
        ✨ AI Recommended Matches
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {outfits.map((item) => (
          <div key={item._id} className="bg-white p-2 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
            {/* Actual Image Tag */}
            <img 
              src={item.image} // Cloudinary ka direct URL
              alt="suggested" 
              className="w-full h-48 object-cover rounded-xl mb-2"
              onError={(e) => e.target.src = "https://via.placeholder.com/150"} // Image na milne par placeholder
            />
            <p className="text-xs font-bold text-emerald-700 uppercase px-1">{item.category}</p>
            <p className="text-sm text-slate-600 px-1 capitalize">{item.color}</p>
          </div>
        ))}
      </div>
    </div>
  );
}