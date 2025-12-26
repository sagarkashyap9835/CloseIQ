import React from "react";

export default function ClothesCard({ item, handleDelete }) {
  return (
    <div className="relative border rounded-lg overflow-hidden shadow-sm">
      <img
        src={item.image}
        alt={item.name}
        className="w-full h-40 object-cover"
      />
      <div className="p-2">
        <p className="text-sm font-medium">{item.name}</p>
        <div className="flex gap-2 mt-1">
          <button className="text-blue-600 hover:underline text-xs">Edit</button>
          <button
            onClick={() => handleDelete(item.id)}
            className="text-red-600 hover:underline text-xs"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
