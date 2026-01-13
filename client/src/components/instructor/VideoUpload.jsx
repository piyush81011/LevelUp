import { useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../config/api";

const VideoUpload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError("");
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a video file.");
      return;
    }
    setUploading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("video", file);
      const res = await axios.post(
        `${API_BASE_URL}/api/v1/upload/video`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );
      setVideoUrl(res.data.url);
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-xl max-w-lg mx-auto mt-8">
      <h2 className="text-xl font-bold mb-4 text-white">Upload Course Video</h2>
      <form onSubmit={handleUpload}>
        <input
          type="file"
          accept="video/*"
          onChange={handleFileChange}
          className="mb-4 block w-full text-white"
        />
        <button
          type="submit"
          disabled={uploading}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50"
        >
          {uploading ? "Uploading..." : "Upload Video"}
        </button>
      </form>
      {error && <p className="text-red-400 mt-2">{error}</p>}
      {videoUrl && (
        <div className="mt-4">
          <p className="text-green-400">Upload successful!</p>
          <video src={videoUrl} controls className="w-full mt-2 rounded-lg" />
          <p className="text-xs text-gray-400 break-all mt-2">URL: {videoUrl}</p>
        </div>
      )}
    </div>
  );
};

export default VideoUpload;
