// import express from "express";
// import multer from "multer";
// import path from "path";
// import { fileURLToPath } from "url";
// import { dirname } from "path";
// import Cloth from "../models/cloth.js";

// const router = express.Router();

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// const storage = multer.diskStorage({
//   destination: path.join(__dirname, "../uploads"),
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname));
//   }
// });

// const upload = multer({ storage });

// router.post("/upload", upload.single("image"), async (req, res) => {
//   const cloth = new Cloth({
//     name: req.body.name || "My Cloth",
//     category: req.body.category,
//     color: req.body.color || "unknown",
//     image: req.file.filename
//   });
//   await cloth.save();
//   res.json({ success: true, cloth });
// });

// router.get("/", async (req, res) => {
//   const clothes = await Cloth.find().sort({ createdAt: -1 });
//   res.json({ success: true, clothes });
// });

// router.delete("/:id", async (req, res) => {
//   await Cloth.findByIdAndDelete(req.params.id);
//   res.json({ success: true });
// });

// export default router;




import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import Cloth from "../models/cloth.js";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Cloudinary Storage Setup
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "closetiq_wardrobe", // Cloudinary mein folder ka naam
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});

const upload = multer({ storage });

// POST: Upload to Cloudinary
router.post("/upload", upload.single("image"), async (req, res) => {
  try {
    const cloth = new Cloth({
      name: req.body.name || "My Cloth",
      category: req.body.category,
      color: req.body.color || "unknown",
      image: req.file.path // 🔥 Yahan ab filename nahi, Cloudinary ka URL save hoga
    });
    
    await cloth.save();
    res.json({ success: true, cloth });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET & DELETE (Pehle jaisa hi rahega)
router.get("/", async (req, res) => {
  const clothes = await Cloth.find().sort({ createdAt: -1 });
  res.json({ success: true, clothes });
});

router.delete("/:id", async (req, res) => {
  await Cloth.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

export default router;