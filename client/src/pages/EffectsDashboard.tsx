import React, { useState } from "react";
import AddVideo from "../components/AddVideo";
import SelectText from "../components/SelectText";
import axios from "axios";

const EffectsDashboard: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [outputVideoUrl, setOutputVideoUrl] = useState<string | null>(null);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    console.log("File received!");

    const formData = new FormData();
    formData.append("video", file);

    axios
      .post("http://127.0.0.1:5000/api/process-video", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        responseType: "json",
        timeout: 14400000,
      })
      .then((response) => {
        console.log(response.data);

        const videoData = atob(response.data.input_video);
        const byteNumbers = new Array(videoData.length);
        for (let i = 0; i < videoData.length; i++) {
          byteNumbers[i] = videoData.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const videoBlob = new Blob([byteArray], { type: "video/mp4" });
        const videoUrl = URL.createObjectURL(videoBlob);
        setOutputVideoUrl(videoUrl);

        const subtitlesText = response.data.subtitles;
        console.log("Subtitles:", subtitlesText);
      })
      .catch((error) => {
        console.error("Error uploading file:", error);
      });
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      <div className="border-2 rounded-lg p-4 flex flex-col md:flex-row justify-center items-center w-full max-w-[90vw] h-auto gap-4">
        <div className="flex flex-col justify-center items-center w-full md:w-[60%] h-full md:max-h-[90vh]">
          {outputVideoUrl ? (
            <div className="w-full h-full flex items-center justify-center rounded-lg overflow-hidden">
              <video controls className="max-w-full max-h-full">
                <source src={outputVideoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          ) : (
            <AddVideo onFileSelect={handleFileSelect} />
          )}
        </div>
        <div className="flex flex-col justify-center items-center w-full md:w-[40%] h-auto max-h-[90vh] overflow-auto">
          <SelectText />
        </div>
      </div>
    </div>
  );
};

export default EffectsDashboard;
