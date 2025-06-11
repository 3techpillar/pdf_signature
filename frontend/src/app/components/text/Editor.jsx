'use client';
import { useState } from "react";
import { AiOutlineClose } from 'react-icons/ai';

const Editor = ({ setActiveTool, setTextData, setFontSize, fontSize ,penColor ,setPenColor ,fontFamily ,setFontFamily}) => {
  const [inputValue, setInputValue] = useState("");

  const fontSizes = [12, 14, 16, 18, 20, 24, 28, 32];
  const colors = [
    { name: "Red", value: "red" },
    { name: "Blue", value: "blue" },
    { name: "Yellow", value: "yellow" },
    { name: "Black", value: "black" },
    { name: "Green", value: "green" },
    { name: "Purple", value: "purple" },
  ];

  const fonts = [
    { name: "Arial", value: "Arial, sans-serif" },
    { name: "Georgia", value: "Georgia, serif" },
    { name: "Courier New", value: "'Courier New', monospace" },
    { name: "Times New Roman", value: "'Times New Roman', serif" },
    { name: "Verdana", value: "Verdana, sans-serif" },
    { name: "Comic Sans MS", value: "'Comic Sans MS', cursive" },
  ];

  const handleSubmit = () => {
    if (!inputValue.trim()) return; // Prevent empty submissions

    setTextData(inputValue);
    setActiveTool('none');
  };

  return (
    <div className="p-4 space-y-4">

      {/* Close Button */}
      <div className="flex justify-end">
        <button onClick={() => setActiveTool('none')} aria-label="Close editor">
          <AiOutlineClose />
        </button>
      </div>

      {/* Font Size Selector */}
      <div>
        <label className="mr-2">Font Size:</label>
        <select
          value={fontSize}
          onChange={(e) => setFontSize(parseInt(e.target.value))}
          className="border px-2 py-1 rounded"
        >
          {fontSizes.map((size) => (
            <option key={size} value={size}>
              {size}px
            </option>
          ))}
        </select>
      </div>

      {/* Font Family & Color Picker */}
      <div 
      className="flex items-center flex-wrap gap-4">
      <label className="mr-2">Font Family:</label>
        {/* Font Selector */}
        <select
          value={fontFamily}
          onChange={(e) => setFontFamily(e.target.value)}
          className="border border-gray-300 rounded px-2 py-1"
        >
          {fonts.map((font) => (
            <option
              key={font.value}
              value={font.value}
              style={{ fontFamily: font.value }}
            >
              {font.name}
            </option>
          ))}
        </select>

       
        
      </div>
      <div className="flex gap-2  z-50 relative ">
      <label className="mr-2">PenColor:</label>
          {colors.map((color) => (
            <button
              key={color.value}
              onClick={() => setPenColor(color.value)}
              className={`w-8 h-8 rounded-full border-2 transition duration-200 ${
                penColor === color.value ? "border-gray-800" : "border-white"
              }`}
              style={{ backgroundColor: color.value }}
              title={color.name}
              aria-label={`Select ${color.name}`}
            />
          ))}
        </div>

      {/* Text Input */}
      <input
        type="text"
        value={inputValue}
        placeholder="Enter text here"
        onChange={(e) => setInputValue(e.target.value)}
        style={{ color: penColor, fontFamily, fontSize }}
        className="border border-gray-300 rounded px-3 py-2 w-full"
      />



      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={() => setInputValue('')}
          className="p-2 bg-gray-500 text-white font-bold hover:bg-gray-700 rounded"
          aria-label="Clear input"
        >
          Clear
        </button>
        <button
          onClick={handleSubmit}
          className="p-2 bg-green-500 text-white font-bold hover:bg-green-700 rounded"
          aria-label="Submit form"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default Editor;
