"use client";
import axios from "axios";
import { UploadCloud } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function PdfUpload() {
  const [fileName, setFileName] = useState("");
  const [fileUrl, setFileUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResponse, setUploadResponse] = useState(null);
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleFileChange = async (e) => {
    setError(null);
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      alert("Please upload a PDF file.");
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      alert("File size exceeds 50MB limit.");
      return;
    }

    setFileName(file.name);
    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("http://localhost:3000/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200 && response.data?.file) {
        setUploadResponse(response.data.file);
        router.push(`/view?fileUrl=${encodeURIComponent(response.data.file.url)}`);
      } else {
        setError("Unexpected response from server");
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">
        Online PDF editor <span className="text-xs font-semibold align-super">BETA</span>
      </h1>
      <p className="text-gray-500 mb-6">Edit PDF files for free. Fill & sign PDF</p>

      <label
        className={`cursor-pointer bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg inline-flex items-center gap-2 ${uploading ? "opacity-50 cursor-not-allowed" : ""}`}
        aria-disabled={uploading}
      >
        <UploadCloud className="w-5 h-5" />
        {uploading ? "Uploading..." : fileName || "Upload PDF file"}
        <input type="file" accept="application/pdf" className="hidden" onChange={handleFileChange} disabled={uploading} />
      </label>

      {error && <p className="mt-2 text-red-600">{error}</p>}

      {uploadResponse && (
        <p className="mt-4 text-sm text-blue-600">
          ✅ File uploaded:{" "}
          <a href={uploadResponse.url} target="_blank" rel="noopener noreferrer" className="underline">
            {uploadResponse.originalName}
          </a>
        </p>
      )}

      <p
        className="mt-4 text-green-600 hover:underline cursor-pointer"
        onClick={() => router.push("/editor/blank")}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && router.push("/editor/blank")}
      >
        or start with a blank document
      </p>

      <div className="mt-6 max-w-md text-sm text-gray-400">
        <p>Files stay private. Automatically deleted after 2 hours.</p>
        <p>Free service for documents up to 200 pages or 50 MB and 3 tasks per hour.</p>
      </div>

      <div className="mt-4 text-xs text-gray-400">
        <a href="#" className="hover:underline">
          Terms of Use
        </a>{" "}
        and{" "}
        <a href="#" className="hover:underline">
          Privacy Policy
        </a>
      </div>
    </div>
  );
}
