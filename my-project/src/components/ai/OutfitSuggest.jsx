import { detectColorsAndSuggest } from "../api/aiApi";
import { useEffect, useState } from "react";

export default function OutfitSuggest({ outfits }) {
  if (!outfits || outfits.length === 0) return null;

  return (
    <div>
      <h2>✨ AI Outfit Suggestions</h2>
      {outfits.map((item) => (
        <p key={item._id}>{item.image}</p>
      ))}
    </div>
  );
}
