import mongoose from "mongoose";

const clothSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: "My Cloth"
    },
    category: {
      type: String,
      required: true
    },
    color: {
      type: String,
      default: "unknown"
    },
    image: {
      type: String,
      required: true
    },
    gender: { 
    type: String, 
    enum: ['men', 'women', 'unisex'], 
    default: 'unisex' 
  }
  },
  { timestamps: true }    
);

export default mongoose.model("Cloth", clothSchema);
