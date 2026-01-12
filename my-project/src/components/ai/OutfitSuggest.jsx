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


// export default function OutfitSuggest({ outfits }) {
//   if (!outfits || outfits.length === 0) return null;

//   return (
//     <div className="mt-8">
//       <h2 className="text-xl font-bold mb-4 text-slate-800 flex items-center gap-2">
//         ✨ AI Recommended Matches
//       </h2>
//       <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
//         {outfits.map((item) => (
//           <div key={item._id} className="bg-white p-2 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
//             {/* Actual Image Tag */}
//             <img 
//               src={item.image} // Cloudinary ka direct URL
//               alt="suggested" 
//               className="w-full h-48 object-cover rounded-xl mb-2"
//               onError={(e) => e.target.src = "https://via.placeholder.com/150"} // Image na milne par placeholder
//             />
//             <p className="text-xs font-bold text-emerald-700 uppercase px-1">{item.category}</p>
//             <p className="text-sm text-slate-600 px-1 capitalize">{item.color}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// src/components/ai/OutfitSuggest.jsx

export default function OutfitSuggest({ outfits }) {
  if (!outfits || outfits.length === 0) return null;

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4 text-slate-800 flex items-center gap-2">
        ✨ AI Recommended Match
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 justify-center">
        {outfits.map((item) => {
          // 🔥 URL logic: Agar Cloudinary URL hai toh wahi use karein, 
          // nahi toh localhost ka path banayein
          const finalImageUrl = item.image.startsWith("http") 
            ? item.image 
            : `http://localhost:5000/uploads/${item.image}`;

          return (
            <div key={item._id} className="bg-white p-4 rounded-3xl shadow-lg border border-gray-100">
              <img 
                src={finalImageUrl} 
                alt="suggested" 
                className="w-full h-72 object-cover rounded-2xl mb-4"
                onError={(e) => {
                  // via.placeholder fail ho raha hai, isliye alternative use karein
                  e.target.src = "https://placehold.co/400x500?text=Check+Internet";
                }}
              />
              <div className="px-2">
                <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                  {item.category}
                </p>
                <p className="text-lg font-semibold text-slate-700 capitalize">
                  {item.color || "Personal Choice"}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}