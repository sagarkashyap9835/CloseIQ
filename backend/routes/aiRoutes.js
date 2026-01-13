

import express from "express";
import Cloth from "../models/cloth.js";

const router = express.Router();

router.post("/detect", async (req, res) => {
  try {
    const { image } = req.body; // Base64 image aayegi frontend se

    // 1. Kyunki abhi API key nahi hai, hum simulate kar rahe hain
    // Real project mein yahan Vision API labels deta hai
    const simulatedLabels = ["shirt", "top", "fashion"]; 

    // 2. Logic: User ne kya pehna hai?
    const topKeywords = ["shirt", "top", "t-shirt", "sweater", "hoodie"];
    
    // Check karein ki kya user ne 'Top' pehna hai
    let userWearing = "Tops"; 
    
    // 3. Opposite Category dhoondo
    // Agar Top pehna hai to Bottoms dhoondo, varna Tops
    let targetCategory = (userWearing === "Tops") ? "Bottoms" : "Tops";

    console.log(`User wearing: ${userWearing}, Suggesting from: ${targetCategory}`);

    // 4. Wardrobe (MongoDB) se us category ke items nikalo
    const suggestionList = await Cloth.find({ category: targetCategory });

    // Agar database mein us category ka kuch nahi hai, toh koi bhi 1 item de do
    let finalSuggestion = [];
    if (suggestionList.length > 0) {
      // Randomly pick one from the list
      finalSuggestion = [suggestionList[Math.floor(Math.random() * suggestionList.length)]];
    } else {
      // Fallback: Agar matching category nahi mili toh pure wardrobe se koi bhi 1
      const anyItem = await Cloth.findOne();
      finalSuggestion = anyItem ? [anyItem] : [];
    }

    res.json({
      colors: ["Detected", userWearing], // Tags dikhane ke liye
      outfits: finalSuggestion // Frontend expects array
    });

  } catch (error) {
    console.error("Backend Error:", error);
    res.status(500).json({ error: "Server logic error" });
  }
});

export default router;