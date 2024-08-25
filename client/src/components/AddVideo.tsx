import React, { useState } from "react";

interface AddVideoProps {
  onFileSelect: (file: File) => void;
}

const AddVideo: React.FC<AddVideoProps> = ({ onFileSelect }) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "video/*";
    input.onchange = (event) => {
      const target = event.target as HTMLInputElement;
      const file = target.files?.[0];
      if (file) {
        setIsUploading(true);
        onFileSelect(file);
      }
    };
    input.click();
  };

  return (
    <div className="bg-zinc-800 text-white w-full h-full flex justify-center items-center aspect-[9/16]">
      <div
        onClick={!isUploading ? handleUpload : undefined}
        className={`flex flex-col items-center justify-center opacity-50 font-normal text-2xl w-full h-full ${
          isUploading ? "" : "cursor-pointer"
        }`}
      >
        {isUploading ? "Processing..." : "Upload Video"}
      </div>
    </div>
  );
};

export default AddVideo;
