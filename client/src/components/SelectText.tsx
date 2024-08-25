import React, { useState } from "react";

const SelectText: React.FC = () => {
  const [fontSize, setFontSize] = useState<string>("medium");
  const [strokeColor, setStrokeColor] = useState<string>("black");
  const [strokeWidth, setStrokeWidth] = useState<string>("2");
  const [transparent, setTransparent] = useState<boolean>(false);
  const [letterSpacing, setLetterSpacing] = useState<string>("normal");
  const [lineSpacing, setLineSpacing] = useState<string>("normal");
  const [selectedFont, setSelectedFont] = useState<string | null>(null);

  const handleSelect = (option: string) => {
    setSelectedFont(option);
  };

  return (
    <div className="bg-zinc-800 text-white w-full h-full flex flex-col justify-center items-center gap-4 p-4">
      <div className="w-full h-full grid grid-cols-2 grid-rows-4 gap-4">
        {/* Font Size */}
        <label className="flex flex-col gap-2">
          <span>Font Size</span>
          <select
            className="p-2 rounded text-black"
            value={fontSize}
            onChange={(e) => setFontSize(e.target.value)}
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
          />
          <div
            className={`flex items-center justify-center w-20 h-8 rounded-full cursor-pointer transition-all duration-300 ${
              transparent ? "bg-blue-500 text-white" : "bg-gray-300 text-black"
            }`}
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
            selectedFont === "Option 1"
              ? "bg-blue-500 text-white"
              : "bg-white text-black"
          }`}
          onClick={() => handleSelect("Option 1")}
        >
          Option 1
        </button>
        <button
          className={`p-2 rounded ${
            selectedFont === "Option 2"
              ? "bg-blue-500 text-white"
              : "bg-white text-black"
          }`}
          onClick={() => handleSelect("Option 2")}
        >
          Option 2
        </button>
        <button
          className={`p-2 rounded ${
            selectedFont === "Option 3"
              ? "bg-blue-500 text-white"
              : "bg-white text-black"
          }`}
          onClick={() => handleSelect("Option 3")}
        >
          Option 3
        </button>
        <button
          className={`p-2 rounded ${
            selectedFont === "Option 4"
              ? "bg-blue-500 text-white"
              : "bg-white text-black"
          }`}
          onClick={() => handleSelect("Option 4")}
        >
          Option 4
        </button>
        <button
          className={`p-2 rounded ${
            selectedFont === "Option 5"
              ? "bg-blue-500 text-white"
              : "bg-white text-black"
          }`}
          onClick={() => handleSelect("Option 5")}
        >
          Option 5
        </button>
        <button
          className={`p-2 rounded ${
            selectedFont === "Option 6"
              ? "bg-blue-500 text-white"
              : "bg-white text-black"
          }`}
          onClick={() => handleSelect("Option 6")}
        >
          Option 6
        </button>
        <button
          className={`p-2 rounded ${
            selectedFont === "Option 7"
              ? "bg-blue-500 text-white"
              : "bg-white text-black"
          }`}
          onClick={() => handleSelect("Option 7")}
        >
          Option 7
        </button>
        <button
          className={`p-2 rounded ${
            selectedFont === "Option 8"
              ? "bg-blue-500 text-white"
              : "bg-white text-black"
          }`}
          onClick={() => handleSelect("Option 8")}
        >
          Option 8
        </button>
      </div>
    </div>
  );
};

export default SelectText;
