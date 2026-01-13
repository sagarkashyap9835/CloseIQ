import express from "express";
import Cloth from "../models/cloth.js";

const router = express.Router();

// Color matching logic - complementary colors
const colorMatches = {
  red: ["black", "white", "blue", "beige"],
  blue: ["white", "black", "beige", "brown"],
  black: ["white", "red", "blue", "green", "beige", "pink", "grey"],
  white: ["black", "blue", "red", "green", "beige", "brown"],
  green: ["black", "white", "beige", "brown"],
  beige: ["black", "blue", "white", "green", "brown"],
  pink: ["black", "white", "blue", "grey"],
  yellow: ["black", "blue", "white", "grey"],
  brown: ["white", "beige", "black", "blue"],
  grey: ["black", "white", "blue", "red", "pink"]
};

// Accessory and Footwear suggestions based on outfit type
const accessorySuggestions = {
  casual: ["watch", "cap", "sunglasses", "bracelet"],
  formal: ["watch", "tie", "belt", "cufflinks"],
  sporty: ["cap", "sports watch", "wristband"]
};

// Main AI Detection Endpoint
router.post("/detect", async (req, res) => {
  try {
    const { image, detectedCategory, detectedColor } = req.body;

    const userWearing = detectedCategory || "Tops";
    const wearingColor = detectedColor || "unknown";

    console.log(`🔍 User wearing: ${userWearing} (Color: ${wearingColor})`);

    // Get matching colors
    const matchingColors = colorMatches[wearingColor.toLowerCase()] || [];

    // ===== BOTTOMS SUGGESTIONS =====
    let bottomsCategory = userWearing === "Bottoms" ? "Tops" : "Bottoms";
    let bottomsList = await Cloth.find({ category: bottomsCategory });

    // Sort by color match
    let colorMatchedBottoms = [];
    let otherBottoms = [];
    bottomsList.forEach(item => {
      if (matchingColors.includes(item.color?.toLowerCase())) {
        colorMatchedBottoms.push(item);
      } else {
        otherBottoms.push(item);
      }
    });
    const sortedBottoms = [...colorMatchedBottoms, ...otherBottoms].slice(0, 3);

    // ===== FOOTWEAR SUGGESTIONS =====
    let footwearList = await Cloth.find({ category: "Footwear" });
    let colorMatchedFootwear = [];
    let otherFootwear = [];
    footwearList.forEach(item => {
      if (matchingColors.includes(item.color?.toLowerCase()) ||
        item.color?.toLowerCase() === "black" ||
        item.color?.toLowerCase() === "white") {
        colorMatchedFootwear.push(item);
      } else {
        otherFootwear.push(item);
      }
    });
    const sortedFootwear = [...colorMatchedFootwear, ...otherFootwear].slice(0, 2);

    // ===== ACCESSORIES SUGGESTIONS =====
    let accessoriesList = await Cloth.find({ category: "Accessories" });
    let colorMatchedAccessories = [];
    let otherAccessories = [];
    accessoriesList.forEach(item => {
      if (matchingColors.includes(item.color?.toLowerCase()) ||
        item.color?.toLowerCase() === "black" ||
        item.color?.toLowerCase() === "gold" ||
        item.color?.toLowerCase() === "silver") {
        colorMatchedAccessories.push(item);
      } else {
        otherAccessories.push(item);
      }
    });
    const sortedAccessories = [...colorMatchedAccessories, ...otherAccessories].slice(0, 2);

    // ===== BUILD RESPONSE =====
    let message = "";
    let needNewClothes = false;
    let shoppingList = [];

    // Check what's missing
    if (sortedBottoms.length === 0) {
      shoppingList.push(bottomsCategory);
    }
    if (sortedFootwear.length === 0) {
      shoppingList.push("Footwear");
    }
    if (sortedAccessories.length === 0) {
      shoppingList.push("Accessories");
    }

    if (shoppingList.length > 0) {
      needNewClothes = true;
      message = `😅 You're missing: ${shoppingList.join(", ")}. Time to go shopping! 🛍️`;
    } else if (colorMatchedBottoms.length > 0) {
      message = `✨ Perfect outfit found! Color-coordinated ${bottomsCategory.toLowerCase()}, footwear & accessories for your ${wearingColor} ${userWearing.toLowerCase()}.`;
    } else {
      message = `👍 Great options! Here's what would look good with your ${wearingColor} ${userWearing.toLowerCase()}.`;
    }

    res.json({
      success: true,
      detectedOutfit: {
        category: userWearing,
        color: wearingColor
      },
      suggestions: {
        main: sortedBottoms,          // Main clothing (opposite category)
        footwear: sortedFootwear,      // Shoes
        accessories: sortedAccessories  // Accessories
      },
      mainCategory: bottomsCategory,
      message,
      needNewClothes,
      shoppingList,
      stats: {
        mainMatched: colorMatchedBottoms.length,
        footwearMatched: colorMatchedFootwear.length,
        accessoriesMatched: colorMatchedAccessories.length
      }
    });

  } catch (error) {
    console.error("❌ AI Detection Error:", error);
    res.status(500).json({
      success: false,
      error: "AI processing failed",
      message: error.message
    });
  }
});

// Get categories for filtering
router.get("/categories", async (req, res) => {
  try {
    const categories = await Cloth.distinct("category");
    const colors = await Cloth.distinct("color");
    res.json({ success: true, categories, colors });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ===== WEEKLY PLANNER ENDPOINTS =====

// Get random outfit for a day
router.get("/random-outfit", async (req, res) => {
  try {
    const tops = await Cloth.find({ category: "Tops" });
    const bottoms = await Cloth.find({ category: "Bottoms" });
    const footwear = await Cloth.find({ category: "Footwear" });
    const accessories = await Cloth.find({ category: "Accessories" });

    const getRandomItem = (arr) => arr.length > 0 ? arr[Math.floor(Math.random() * arr.length)] : null;

    res.json({
      success: true,
      outfit: {
        top: getRandomItem(tops),
        bottom: getRandomItem(bottoms),
        footwear: getRandomItem(footwear),
        accessory: getRandomItem(accessories)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Generate weekly plan
router.get("/weekly-plan", async (req, res) => {
  try {
    const tops = await Cloth.find({ category: "Tops" });
    const bottoms = await Cloth.find({ category: "Bottoms" });
    const footwear = await Cloth.find({ category: "Footwear" });
    const accessories = await Cloth.find({ category: "Accessories" });

    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

    const getRandomItem = (arr, usedIds = []) => {
      const available = arr.filter(item => !usedIds.includes(item._id.toString()));
      if (available.length === 0) return arr.length > 0 ? arr[Math.floor(Math.random() * arr.length)] : null;
      return available[Math.floor(Math.random() * available.length)];
    };

    const usedTops = [];
    const usedBottoms = [];

    const weeklyPlan = days.map(day => {
      const top = getRandomItem(tops, usedTops);
      const bottom = getRandomItem(bottoms, usedBottoms);

      if (top) usedTops.push(top._id.toString());
      if (bottom) usedBottoms.push(bottom._id.toString());

      return {
        day,
        outfit: {
          top,
          bottom,
          footwear: getRandomItem(footwear),
          accessory: getRandomItem(accessories)
        }
      };
    });

    res.json({
      success: true,
      weeklyPlan,
      stats: {
        totalTops: tops.length,
        totalBottoms: bottoms.length,
        totalFootwear: footwear.length,
        totalAccessories: accessories.length
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;