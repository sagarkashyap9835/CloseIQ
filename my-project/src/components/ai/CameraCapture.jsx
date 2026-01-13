import { useRef, useState, useEffect } from "react";
import { Camera, Scan, X, Sparkles, ShoppingBag } from "lucide-react";

// Clothing detection using canvas color analysis (demo implementation)
// In production, you can integrate TensorFlow.js with COCO-SSD or custom model

export default function CameraCapture({ onCapture, onDetectionComplete }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [started, setStarted] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const streamRef = useRef(null);

  // Color detection from image
  const detectDominantColor = (ctx, width, height) => {
    // Sample the center area (chest/body region)
    const centerX = width * 0.3;
    const centerY = height * 0.3;
    const sampleWidth = width * 0.4;
    const sampleHeight = height * 0.4;

    const imageData = ctx.getImageData(centerX, centerY, sampleWidth, sampleHeight);
    const data = imageData.data;

    let r = 0, g = 0, b = 0, count = 0;

    for (let i = 0; i < data.length; i += 4) {
      r += data[i];
      g += data[i + 1];
      b += data[i + 2];
      count++;
    }

    r = Math.round(r / count);
    g = Math.round(g / count);
    b = Math.round(b / count);

    // Map RGB to color name
    return getColorName(r, g, b);
  };

  const getColorName = (r, g, b) => {
    // Simple color classification
    if (r > 200 && g > 200 && b > 200) return "white";
    if (r < 50 && g < 50 && b < 50) return "black";
    if (r > 150 && g < 100 && b < 100) return "red";
    if (r < 100 && g > 150 && b < 100) return "green";
    if (r < 100 && g < 100 && b > 150) return "blue";
    if (r > 200 && g > 200 && b < 100) return "yellow";
    if (r > 150 && g < 100 && b > 150) return "pink";
    if (r > 150 && g > 100 && b < 100) return "brown";
    if (Math.abs(r - g) < 30 && Math.abs(g - b) < 30) return "grey";
    if (r > 200 && g > 180 && b > 150) return "beige";
    return "unknown";
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 640 },
          height: { ideal: 480 }
        }
      });
      streamRef.current = stream;
      setStarted(true);
    } catch (err) {
      alert("Camera access denied. Please allow camera permission.");
      console.error(err);
    }
  };

  useEffect(() => {
    if (started && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
  }, [started]);

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach(track => track.stop());
    setStarted(false);
    setCapturedImage(null);
    setScanResult(null);
  };

  // Main detection function
  const detectOutfit = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video) return;

    setScanning(true);

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0);

    const imageData = canvas.toDataURL("image/jpeg");
    setCapturedImage(imageData);

    // Simulate AI detection delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Detect color from image
    const detectedColor = detectDominantColor(ctx, canvas.width, canvas.height);

    // For demo: detect based on where we sample
    // Upper body = Tops, Lower body = Bottoms
    const upperRegion = canvas.height * 0.4;

    // Sample upper body region to determine category
    const detectedCategory = "Tops"; // Default - user shows their top

    const result = {
      category: detectedCategory,
      color: detectedColor,
      confidence: 0.85
    };

    setScanResult(result);
    setScanning(false);

    // Send to parent with detection results
    if (onDetectionComplete) {
      onDetectionComplete(imageData, result.category, result.color);
    } else if (onCapture) {
      onCapture(imageData, result.category, result.color);
    }
  };

  // Cleanup
  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach(track => track.stop());
    };
  }, []);

  return (
    <div className="max-w-md mx-auto">
      {/* Start Camera Button */}
      {!started && (
        <div className="text-center">
          <button
            onClick={startCamera}
            className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-2xl font-semibold text-lg shadow-xl hover:shadow-emerald-500/30 transition-all duration-300 hover:scale-105"
          >
            <Camera className="w-6 h-6" />
            <span>Start Camera</span>
            <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
          <p className="mt-4 text-slate-500 text-sm">
            📸 Show your outfit to get AI suggestions
          </p>
        </div>
      )}

      {/* Camera View */}
      {started && (
        <div className="relative">
          {/* Video Container */}
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full aspect-[4/3] object-cover"
            />

            {/* Scanning Overlay */}
            {scanning && (
              <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/20 to-teal-500/20 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin" />
                  <p className="text-white font-semibold text-lg animate-pulse">
                    🔍 Scanning your outfit...
                  </p>
                </div>
              </div>
            )}

            {/* Detection Result Badge */}
            {scanResult && !scanning && (
              <div className="absolute bottom-4 left-4 right-4">
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full border-2 border-slate-200"
                      style={{ backgroundColor: scanResult.color !== "unknown" ? scanResult.color : "#gray" }}
                    />
                    <div>
                      <p className="font-bold text-slate-800 capitalize">
                        {scanResult.category} Detected
                      </p>
                      <p className="text-sm text-slate-500 capitalize">
                        Color: {scanResult.color}
                      </p>
                    </div>
                    <Sparkles className="w-5 h-5 text-yellow-500 ml-auto" />
                  </div>
                </div>
              </div>
            )}

            {/* Close Button */}
            <button
              onClick={stopCamera}
              className="absolute top-4 right-4 p-2 bg-white/90 rounded-full shadow-lg hover:bg-red-50 transition-colors"
            >
              <X className="w-5 h-5 text-slate-700" />
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-6 justify-center">
            <button
              onClick={detectOutfit}
              disabled={scanning}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${scanning
                  ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:shadow-lg hover:shadow-emerald-500/30 hover:scale-105"
                }`}
            >
              <Scan className="w-5 h-5" />
              {scanning ? "Analyzing..." : "Detect Outfit"}
            </button>
          </div>

          {/* Captured Image Preview */}
          {capturedImage && !scanning && (
            <div className="mt-6 p-4 bg-slate-50 rounded-2xl">
              <p className="text-sm font-semibold text-slate-600 mb-2">📷 Captured Frame</p>
              <img
                src={capturedImage}
                alt="Captured"
                className="w-24 h-24 object-cover rounded-xl shadow-md"
              />
            </div>
          )}
        </div>
      )}

      <canvas ref={canvasRef} hidden />
    </div>
  );
}
