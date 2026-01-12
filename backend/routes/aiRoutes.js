import express from "express";
import Cloth from "../models/cloth.js";

const router = express.Router();

router.post("/detect", async (req, res) => {
  const clothes = await Cloth.find();

  res.json({
    colors: ["Black", "Blue"],
    outfits: clothes.slice(0, 1),
  });
});

export default router;
