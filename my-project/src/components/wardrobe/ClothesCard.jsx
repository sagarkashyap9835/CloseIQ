// export default function ClothesCard({ item, remove }) {
//   return (
//     <div className="max-w-64 font-poppins">
//       <div className="group relative">
//         <img
//           src={`http://localhost:5000/uploads/${item.image}`}
//           alt="img1"
//           className="rounded-lg w-full h-72 object-cover group-hover:hidden transition-all duration-300"
//         />

//         <img
//           src={`http://localhost:5000/uploads/${item.image}`}
//           alt="img2"
//           className="hidden group-hover:block rounded-lg w-full h-72 object-cover shadow-lg transition-all duration-300"
//         />
//       </div>

//       <p className="text-sm mt-2 text-slate-700 capitalize">
//         {item.category}
//       </p>

//       <button
//         onClick={() => remove(item._id)}
//         className="mt-2 text-xs bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
//       >
//         Delete
//       </button>
//     </div>
//   );
// }


export default function ClothesCard({ item, remove }) {
  // 🔥 Yeh logic check karega: Agar image Cloudinary ki hai toh direct dikhao, 
  // varna local uploads folder se uthao.
  const imageUrl = item.image.startsWith("http") 
    ? item.image 
    : `http://localhost:5000/uploads/${item.image}`;

  return (
    <div className="max-w-64 font-poppins bg-white p-2 rounded-xl shadow-sm hover:shadow-md transition-shadow">
      <div className="group relative overflow-hidden rounded-lg">
        {/* Pehli Image */}
        <img
          src={imageUrl}
          alt={item.category}
          className="rounded-lg w-full h-72 object-cover group-hover:scale-105 transition-all duration-300"
        />

        {/* Delete Button Overlay (Optional: Hover par dikhega) */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-start justify-end p-2">
           <button
            onClick={() => remove(item._id)}
            className="bg-white/90 text-red-600 p-2 rounded-full hover:bg-red-50 shadow-md"
            title="Delete Item"
          >
            🗑️
          </button>
        </div>
      </div>

      <div className="mt-3 px-1">
        <div className="flex justify-between items-center">
          <p className="text-sm font-semibold text-slate-800 capitalize">
            {item.category}
          </p>
          {/* Gender Badge */}
          <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full uppercase">
            {item.gender || "unisex"}
          </span>
        </div>
        
        <p className="text-xs text-slate-500 capitalize mt-0.5">
          Color: {item.color}
        </p>
      </div>
    </div>
  );
}