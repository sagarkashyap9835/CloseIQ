// import express from "express";
// import Cloth from "../models/cloth.js";

// const router = express.Router();

// router.post("/detect", async (req, res) => {
//   const clothes = await Cloth.find();

//   res.json({
//     colors: ["Black", "Blue"],
//     outfits: clothes.slice(0, 1),
//   });
// });

// export default router;

// import express from "express";
// import Cloth from "../models/cloth.js";

// const router = express.Router();

// router.post("/detect", async (req, res) => {
//   try {
//     const clothes = await Cloth.find();
    
//     if (clothes.length === 0) {
//       return res.json({ colors: [], outfits: [] });
//     }

//     // Sirf 1 random item suggest karne ke liye
//     const randomOutfit = [clothes[Math.floor(Math.random() * clothes.length)]];

//     res.json({
//       colors: ["Black", "Blue"],
//       outfits: randomOutfit,
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // 🔥 YEH LINE MISSING HAI, ISE ADD KAREIN:
// export default router;



// // backend/routes/aiRoutes.js ka naya logic
// router.post("/detect", async (req, res) => {
//   try {
//     const { image } = req.body; // Base64 image from camera

//     // Step 1: AI Logic (Abhi simulated hai, Vision API integrate hone tak)
//     const detectedColor = "Red"; // AI ne detect kiya
//     const detectedType = "Top";

//     // Step 2: Matching Logic (Color Wheel Rules)
//     let matchColor = "Black"; 
//     if(detectedColor === "Black") matchColor = "White";

//     // Step 3: Wardrobe search
//     const suggestion = await Cloth.findOne({ color: matchColor });

//     res.json({
//       colors: [detectedColor, matchColor],
//       outfit: suggestion || await Cloth.findOne() // Agar match na mile toh koi bhi 1 dikhao
//     });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });


router.post("/detect", async (req, res) => {
  try {
    // User ka gender ya toh request body se aayega ya profile se
    const { userGender } = req.body; 

    // Filter: Sirf wahi kapde dikhao jo user ke gender se match karein
    const clothes = await Cloth.find({ 
      $or: [{ gender: userGender }, { gender: 'unisex' }] 
    });

    if (clothes.length === 0) {
      return res.json({ outfit: null, message: "No matching clothes found!" });
    }

    const randomOutfit = clothes[Math.floor(Math.random() * clothes.length)];

    res.json({
      colors: ["Detected Color"],
      outfit: randomOutfit
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});