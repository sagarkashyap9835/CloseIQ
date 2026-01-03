import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import clothRoutes from "./routes/clothRoutes.js";
import aiRoutes from "./routes/aiRoutes.js"
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Atlas Connected"))
  .catch(err => console.log("Mongo Error:", err.message));

app.use("/api/clothesApi", clothRoutes);
app.use("/api/aiApi",aiRoutes);

app.listen(process.env.PORT, () => {
  console.log(` Backend running on ${process.env.PORT}`);
});
