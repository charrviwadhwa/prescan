
import { useRef, useState } from "react";
import {
  UploadCloud,
  FileText,
  Image as ImageIcon,
  X,
  ArrowUpRight,
  ShieldCheck,
} from "lucide-react";
import API from "../services/auth";
import { useNavigate } from "react-router-dom";

function Upload() {
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

const [loading, setLoading] = useState(false);
const [error, setError] = useState("");

  const handleFile = (selectedFile) => {
    if (!selectedFile) return;

    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(selectedFile.type)) {
      alert("Please select a PDF, JPG, PNG or WEBP file.");
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5 MB.");
      return;
    }

    setFile(selectedFile);
  };

  const formatSize = (bytes) => {
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };
  const handleUpload = async () => {
  if (!file) return;

  setLoading(true);
  setError("");

  try {
    const formData = new FormData();
    formData.append("prescription", file);

    const response = await API.post(
      "/prescriptions/upload",
      formData
    );

    navigate("/history", {
      state: {
        prescription: response.data.prescription,
        message: response.data.message,
      },
    });

  } catch (err) {
    setError(
      err.response?.data?.message ||
      "Unable to upload prescription. Please try again."
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <main className="flex-1 min-h-screen bg-[#F8F8F1] p-8 lg:p-12">
        
      {/* Header */}
      <header className="mb-12">
        <p className="text-sm text-[#87968A]">
          Workspace / Upload prescription
        </p>

        <h1 className="text-3xl font-semibold text-[#34443D] mt-2">
          Upload prescription
        </h1>

        <p className="text-sm text-gray-500 mt-2">
          Upload a doctor's prescription to identify its written investigations.
        </p>
      </header>

      {/* Upload Content */}
      <div className="w-full max-w-4xl mx-auto">

        <section className="bg-white border border-[#E8EBE3] rounded-xl p-7 lg:p-9">

          <div className="mb-7">
            <h2 className="text-lg font-semibold text-[#34443D]">
              Select your prescription
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Choose a document from your device or drag it here.
            </p>
          </div>

          {/* Drop Area */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              handleFile(e.dataTransfer.files[0]);
            }}
            onClick={() => inputRef.current.click()}
            className={`border border-dashed rounded-xl p-10 lg:p-14 text-center cursor-pointer transition ${
              dragging
                ? "border-[#527C69] bg-[#DCEBDD]"
                : "border-[#B9CBBE] bg-[#FAFBF7] hover:bg-[#F1F5EF]"
            }`}
          >
            <input
              ref={inputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,.webp"
              className="hidden"
              onChange={(e) => handleFile(e.target.files[0])}
            />

            <div className="w-14 h-14 mx-auto rounded-full bg-[#DCEBDD] flex items-center justify-center mb-5">
              <UploadCloud size={27} className="text-[#527C69]" />
            </div>

            <h3 className="font-medium text-[#34443D]">
              Drop your prescription here
            </h3>

            <p className="text-sm text-gray-500 mt-2">
              or{" "}
              <span className="text-[#527C69] font-medium underline underline-offset-4">
                browse files
              </span>
            </p>

            <p className="text-xs text-gray-400 mt-5">
              PDF, JPG, PNG or WEBP · Maximum 5 MB
            </p>
          </div>

          {/* Selected File */}
          {file && (
            <div className="mt-6 border border-[#DCEBDD] bg-[#F5F8F2] rounded-lg p-4 flex items-center gap-4">

              <div className="w-11 h-11 rounded-lg bg-[#DCEBDD] flex items-center justify-center">
                {file.type === "application/pdf" ? (
                  <FileText className="text-[#527C69]" />
                ) : (
                  <ImageIcon className="text-[#527C69]" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#34443D] truncate">
                  {file.name}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {formatSize(file.size)}
                </p>
              </div>

              <button
                onClick={() => {
                  setFile(null);
                  inputRef.current.value = "";
                }}
                className="text-gray-400 hover:text-red-500"
              >
                <X size={19} />
              </button>
            </div>
          )}
            {error && (
  <p className="text-sm text-red-600 mt-4">{error}</p>
)}
          {/* Analyze Button */}
          <div className="mt-7 flex justify-end">
            <button
              disabled={!file || loading}
              className="flex items-center gap-2 bg-[#527C69] hover:bg-[#426653] disabled:opacity-40 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg text-sm font-medium transition"
              onClick={handleUpload}
            >
              {loading ? "Analyzing prescription..." : "Upload and analyze"}
              <ArrowUpRight size={17} />
            </button>
          </div>

        </section>

        {/* Privacy Note */}
        <div className="flex items-start gap-3 mt-6 px-2">
          <ShieldCheck size={19} className="text-[#527C69] mt-0.5" />

          <div>
            <p className="text-sm font-medium text-[#34443D]">
              Your documents stay private
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Your prescriptions are stored securely and associated with your account.
            </p>
          </div>
        </div>

      </div>
    </main>
  );
}

export default Upload;
