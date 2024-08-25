import React, { useState } from "react";
import AddVideo from "../components/AddVideo";
import SelectText from "../components/SelectText";
import axios from "axios";
import secret from "../../../secret.json";
import path from "../../../path.json";

const EffectsDashboard: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [outputVideoUrl, setOutputVideoUrl] = useState<string | null>(null);
  const [uniqueId, setUniqueId] = useState<string | null>(null);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);

    const formData = new FormData();
    formData.append("video", file);

    axios
      .post(`${path.server}/api/receive-video`, formData, {
        headers: {
          Authorization: secret.SECRET_API_TOKEN,
          "Content-Type": "multipart/form-data",
        },
        responseType: "json",
        timeout: 14400000,
      })
      .then((response) => {
        const videoData = atob(response.data.input_video);
        const byteNumbers = new Array(videoData.length);
        for (let i = 0; i < videoData.length; i++) {
          byteNumbers[i] = videoData.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const videoBlob = new Blob([byteArray], { type: "video/mp4" });
        const videoUrl = URL.createObjectURL(videoBlob);
        setOutputVideoUrl(videoUrl);
        setUniqueId(response.data.unique_id);
      })
      .catch((error) => {
        console.error("Error uploading file:", error);
      });
  };

  const handleNewVideo = (newVideoUrl: string) => {
    setOutputVideoUrl(newVideoUrl); // Update the video URL to display the new video
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-4 bg-zinc-900">
      <div className="border-2 rounded-lg p-4 flex flex-col md:flex-row justify-center items-center w-full max-w-[90vw] h-auto gap-4">
        <div className="flex flex-col justify-center items-center w-full md:w-[60%] h-full md:max-h-[90vh]">
          {outputVideoUrl ? (
            <div className="w-full h-full flex items-center justify-center rounded-lg overflow-hidden">
              <video
                key={outputVideoUrl}
                controls
                className="max-w-full max-h-full"
              >
                <source src={outputVideoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          ) : (
            <AddVideo onFileSelect={handleFileSelect} />
          )}
        </div>
        <div className="flex flex-col justify-center items-center w-full md:w-[40%] h-auto max-h-[90vh] overflow-auto">
          <SelectText
            selectedFile={selectedFile !== null}
            uniqueId={uniqueId}
            onNewVideo={handleNewVideo}
          />
        </div>
      </div>
    </div>
  );
};

export default EffectsDashboard;
