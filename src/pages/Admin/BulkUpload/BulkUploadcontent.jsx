import { useState } from "react";
import axiosInstance from "../../../utils/axiosinstance";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as XLSX from "xlsx";

const BulkUploadContent = () => {
  const [file, setFile] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Handle file input change
  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile && uploadedFile.name.endsWith(".xlsx")) {
      setFile(uploadedFile);
      parseExcel(uploadedFile);
    } else {
      toast.error("Please upload a valid Excel file (.xlsx).");
    }
  };

  // Parse the Excel file and extract data
  const parseExcel = (file) => {
    const reader = new FileReader();
    reader.onload = () => {
      const arrayBuffer = reader.result;
      const workBook = XLSX.read(arrayBuffer, { type: "array" });
      const sheetName = workBook.SheetNames[0];
      const sheet = workBook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet);
      setData(jsonData);
    };
    reader.readAsArrayBuffer(file);
  };

  // Handle file upload and send to backend API
  const handleUpload = async () => {
    if (!file) {
      toast.error("Please upload an Excel file first.");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file); // Append the file to the FormData object

    try {
      const response = await axiosInstance.post(
        "/organizations/bulk-register",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success(response.data.message || "Bulk registration successful!");
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to upload file. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full mx-auto p-6 border border-gray-300 rounded-lg bg-gray-50">
      <ToastContainer position="top-right" autoClose={4000} hideProgressBar />

      <div className="max-h-[500px] overflow-y-auto hide-scrollbar">
        {/* File Upload Section */}
        <div className="mb-5">
          <label className="block mb-2 font-bold text-gray-700">
            Upload Excel File
          </label>
          <input
            type="file"
            accept=".xlsx"
            onChange={handleFileChange}
            className="w-full p-3 text-base border border-gray-300 rounded-md"
          />
        </div>

        {/* Data Display Section */}
        {data.length > 0 && (
          <div className="mb-5">
            <h3 className="text-xl font-bold text-gray-700">Uploaded Data:</h3>
            <pre className="text-sm text-gray-600 overflow-auto max-h-60">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        )}

        {/* Button Section */}
        <div className="flex justify-center space-x-4">
          {/* Download Sample Button */}
          <button
            className="bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-md text-lg"
            onClick={() => downloadSample()}
          >
            Download Sample 📥
          </button>

          {/* Upload Button */}
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-md text-lg"
            onClick={handleUpload}
            disabled={loading}
          >
            {loading ? "Uploading..." : "Upload Data 📤"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BulkUploadContent;
