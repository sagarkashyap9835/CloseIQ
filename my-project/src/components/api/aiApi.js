// import axios from "axios";

// export const detectColorsAndSuggest = async (image) => {
//   const res = await axios.post("http://localhost:5000/api/ai/detect", { image });
//   return res.data;
// };


import axios from "axios";

export const detectColorsAndSuggest = async (image) => {
  // Yahan "aiApi" likhein kyunki backend mein yahi define hai
  const res = await axios.post("http://localhost:5000/api/aiApi/detect", { image });
  return res.data;
};