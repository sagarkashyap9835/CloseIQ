import axios from "axios";

const API_URL = "http://localhost:5000/api/aiApi";

// Main detection function - sends image + detected data to backend
export const detectAndSuggest = async (imageData, detectedCategory, detectedColor) => {
  const res = await axios.post(`${API_URL}/detect`, {
    image: imageData,
    detectedCategory,
    detectedColor
  });
  return res.data;
};

// Get available categories and colors
export const getCategories = async () => {
  const res = await axios.get(`${API_URL}/categories`);
  return res.data;
};

// Legacy function for backward compatibility
export const detectColorsAndSuggest = async (image) => {
  return detectAndSuggest(image, "Tops", "unknown");
};