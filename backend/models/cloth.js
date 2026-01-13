import mongoose from "mongoose";

const clothSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: "My Cloth"
    },
    category: {
      type: String,
      required: true,
      enum: ["Tops", "Bottoms", "Footwear", "Accessories"]
    },
    color: {
      type: String,
      default: "unknown"
    },
    image: {
      type: String,
      required: true
    }
    // Gender field removed as per user request
  },
  { timestamps: true }
);

export default mongoose.model("Cloth", clothSchema);
