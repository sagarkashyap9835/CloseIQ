import React from "react";

export default function UploadButton({ handleUpload }) {
  return (
    <div className="mb-6">
      <button
        onClick={handleUpload}
        className="bg-gray-900 text-white px-6 py-2 rounded-full hover:bg-gray-800 transition"
      >
        Upload Clothes
      </button>
    </div>
  );
}
