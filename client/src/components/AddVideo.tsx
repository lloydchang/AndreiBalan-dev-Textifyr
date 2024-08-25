import React, { useState } from "react";

interface AddVideoProps {
  onFileSelect: (file: File) => void;
}

const AddVideo: React.FC<AddVideoProps> = ({ onFileSelect }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "video/*";
    input.onchange = (event) => {
      const target = event.target as HTMLInputElement;
      const file = target.files?.[0];
      if (file) {
        if (file.size > 10 * 1024 * 1024) {
          setError("File size exceeds 10MB. Please upload a smaller video.");
          return;
        }
        setIsUploading(true);
        setError(null);
        onFileSelect(file);
      }
    };
    input.click();
  };

  return (
    <div className="bg-zinc-800 text-white w-full h-full flex flex-col justify-center items-center aspect-[9/16]">
      <div
        onClick={!isUploading ? handleUpload : undefined}
        className={`flex flex-col items-center justify-center opacity-50 font-normal text-2xl w-full h-full ${
          isUploading ? "" : "cursor-pointer"
        }`}
      >
        {isUploading ? "Processing..." : "Upload Video"}
      </div>
      {error && <div className="text-red-500 mt-2 text-center">{error}</div>}
    </div>
  );
};

export default AddVideo;
