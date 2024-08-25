import axios from "axios";
import React, { useEffect, useState } from "react";
import secret from "../../../secret.json";
import path from "../../../path.json";

interface SelectTextProps {
  selectedFile: boolean;
  uniqueId: string | null;
  onNewVideo: (newVideoUrl: string) => void;
}

const SelectText: React.FC<SelectTextProps> = ({
  selectedFile,
  uniqueId,
  onNewVideo,
}) => {
  const [fontSize, setFontSize] = useState<string>("medium");
  const [strokeColor, setStrokeColor] = useState<string>("black");
  const [strokeWidth, setStrokeWidth] = useState<string>("2");
  const [transparent, setTransparent] = useState<boolean>(false);
  const [letterSpacing, setLetterSpacing] = useState<string>("normal");
  const [lineSpacing, setLineSpacing] = useState<string>("normal");
  const [selectedFont, setSelectedFont] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const handleSelect = (option: string) => {
    setSelectedFont(option);
  };

  const handleSubmit = () => {
    if (!selectedFile) return;
    if (uniqueId === null) return console.error("Can't receive unique ID");

    setIsProcessing(true);

    const letterSpacingMap: { [key: string]: number } = {
      normal: 0,
      wide: 2,
      wider: 4,
      widest: 6,
    };

    const lineSpacingMap: { [key: string]: number } = {
      normal: 0,
      wide: 1.5,
      wider: 2,
      widest: 2.5,
    };

    axios
      .post(
        `${path.server}/api/process-video`,
        {
          uniqueId,
          fontSize,
          strokeColor,
          strokeWidth,
          transparent,
          letterSpacing:
            letterSpacingMap[letterSpacing as keyof typeof letterSpacingMap],
          lineSpacing:
            lineSpacingMap[lineSpacing as keyof typeof lineSpacingMap],
          selectedFont,
        },
        {
          headers: {
            Authorization: secret.SECRET_API_TOKEN,
            "Content-Type": "multipart/form-data",
          },
          responseType: "json",
          timeout: 14400000,
        }
      )
      .then((response) => {
        const videoData = atob(response.data.output_video);
        const byteNumbers = new Array(videoData.length);
        for (let i = 0; i < videoData.length; i++) {
          byteNumbers[i] = videoData.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const videoBlob = new Blob([byteArray], { type: "video/mp4" });
        const videoUrl = URL.createObjectURL(videoBlob);
        onNewVideo(videoUrl);
      })
      .catch((error) => {
        console.error("Error uploading file:", error);
      })
      .finally(() => {
        setIsProcessing(false);
      });
  };

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (uniqueId) {
        axios.post(
          `${path.server}/api/delete-folder`,
          { uniqueId },
          {
            headers: {
              Authorization: secret.SECRET_API_TOKEN,
            },
          }
        );
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [uniqueId]);

  return (
    <div className="bg-zinc-800 text-white w-full h-full flex flex-col justify-center items-center gap-4 p-4 select-none">
      <div className="w-full h-full grid grid-cols-2 grid-rows-4 gap-4">
        {/* Font Size */}
        <label className="flex flex-col gap-2">
          <span>Font Size</span>
          <select
            className="p-2 rounded text-black"
            value={fontSize}
            onChange={(e) => setFontSize(e.target.value)}
            disabled={!selectedFile}
          >
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
        </label>

        {/* Stroke Color */}
        <label className="flex flex-col gap-2">
          <span>Stroke Color</span>
          <select
            className="p-2 rounded text-black"
            value={strokeColor}
            onChange={(e) => setStrokeColor(e.target.value)}
            disabled={!selectedFile}
          >
            <option value="black">Black</option>
            <option value="white">White</option>
            <option value="red">Red</option>
            <option value="blue">Blue</option>
          </select>
        </label>

        {/* Stroke Width */}
        <label className="flex flex-col gap-2">
          <span>Stroke Width</span>
          <select
            className="p-2 rounded text-black"
            value={strokeWidth}
            onChange={(e) => setStrokeWidth(e.target.value)}
            disabled={!selectedFile}
          >
            <option value="1">1px</option>
            <option value="2">2px</option>
            <option value="3">3px</option>
            <option value="4">4px</option>
          </select>
        </label>

        {/* Transparent Background */}
        <label className="flex items-center">
          <input
            type="checkbox"
            className="hidden peer"
            checked={transparent}
            onChange={() => setTransparent(!transparent)}
            disabled={!selectedFile}
          />
          <div
            className={`flex items-center justify-center w-20 h-8 rounded-full cursor-pointer transition-all duration-300 ${
              transparent ? "bg-blue-500 text-white" : "bg-gray-300 text-black"
            } ${!selectedFile ? "bg-gray-400 text-gray-700" : ""}`}
          >
            {transparent ? "On" : "Off"}
          </div>
          <span className="ml-2 text-sm font-medium">
            Transparent Background
          </span>
        </label>

        {/* Letter Spacing */}
        <label className="flex flex-col gap-2">
          <span>Letter Spacing</span>
          <select
            className="p-2 rounded text-black"
            value={letterSpacing}
            onChange={(e) => setLetterSpacing(e.target.value)}
            disabled={!selectedFile}
          >
            <option value="normal">Normal</option>
            <option value="wide">Wide</option>
            <option value="wider">Wider</option>
            <option value="widest">Widest</option>
          </select>
        </label>

        {/* Line Spacing */}
        <label className="flex flex-col gap-2">
          <span>Line Spacing</span>
          <select
            className="p-2 rounded text-black"
            value={lineSpacing}
            onChange={(e) => setLineSpacing(e.target.value)}
            disabled={!selectedFile}
          >
            <option value="normal">Normal</option>
            <option value="wide">Wide</option>
            <option value="wider">Wider</option>
            <option value="widest">Widest</option>
          </select>
        </label>
      </div>

      <div className="w-full h-full grid grid-cols-2 grid-rows-4 gap-4">
        <button
          className={`p-2 rounded ${
            selectedFont === "ProximaNova_Bold.ttf"
              ? "bg-blue-500 text-white"
              : `bg-gray-200 ${selectedFile ? "text-black" : "text-gray-500"}`
          }`}
          onClick={() => handleSelect("ProximaNova_Bold.ttf")}
          disabled={!selectedFile}
        >
          ProximaNova
        </button>
        <button
          className={`p-2 rounded ${
            selectedFont === "Arial_Bold.ttf"
              ? "bg-blue-500 text-white"
              : `bg-gray-200 ${selectedFile ? "text-black" : "text-gray-500"}`
          }`}
          onClick={() => handleSelect("Arial_Bold.ttf")}
          disabled={!selectedFile}
        >
          Arial
        </button>
        <button
          className={`p-2 rounded ${
            selectedFont === "Futura_Bold.ttf"
              ? "bg-blue-500 text-white"
              : `bg-gray-200 ${selectedFile ? "text-black" : "text-gray-500"}`
          }`}
          onClick={() => handleSelect("Futura_Bold.ttf")}
          disabled={!selectedFile}
        >
          Futura
        </button>
        <button
          className={`p-2 rounded ${
            selectedFont === "Lato_Bold.ttf"
              ? "bg-blue-500 text-white"
              : `bg-gray-200 ${selectedFile ? "text-black" : "text-gray-500"}`
          }`}
          onClick={() => handleSelect("Lato_Bold.ttf")}
          disabled={!selectedFile}
        >
          Lato
        </button>
        <button
          className={`p-2 rounded ${
            selectedFont === "Quicksand.ttf"
              ? "bg-blue-500 text-white"
              : `bg-gray-200 ${selectedFile ? "text-black" : "text-gray-500"}`
          }`}
          onClick={() => handleSelect("Quicksand.ttf")}
          disabled={!selectedFile}
        >
          Quicksand
        </button>
        <button
          className={`p-2 rounded ${
            selectedFont === "OpenSans.ttf"
              ? "bg-blue-500 text-white"
              : `bg-gray-200 ${selectedFile ? "text-black" : "text-gray-500"}`
          }`}
          onClick={() => handleSelect("OpenSans.ttf")}
          disabled={!selectedFile}
        >
          OpenSans
        </button>
        <button
          className={`p-2 rounded ${
            selectedFont === "Poppins_Bold.ttf"
              ? "bg-blue-500 text-white"
              : `bg-gray-200 ${selectedFile ? "text-black" : "text-gray-500"}`
          }`}
          onClick={() => handleSelect("Poppins_Bold.ttf")}
          disabled={!selectedFile}
        >
          Poppins
        </button>
        <button
          className={`p-2 rounded ${
            selectedFont === "Roboto_Bold.ttf"
              ? "bg-blue-500 text-white"
              : `bg-gray-200 ${selectedFile ? "text-black" : "text-gray-500"}`
          }`}
          onClick={() => handleSelect("Roboto_Bold.ttf")}
          disabled={!selectedFile}
        >
          Roboto
        </button>
      </div>
      <div className="mt-5 w-[50%] h-[40px] grid grid-cols-1 grid-rows-1 gap-4">
        <button
          className={`text-lg font-semibold bg-neutral-900 rounded-2xl ${
            selectedFile && !isProcessing ? " hover:bg-neutral-950" : ""
          }`}
          disabled={!selectedFile || isProcessing}
          onClick={handleSubmit}
        >
          {isProcessing ? "Processing..." : "Submit"}
        </button>
      </div>
    </div>
  );
};

export default SelectText;
