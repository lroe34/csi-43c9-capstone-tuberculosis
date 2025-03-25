"use client";

import { useState } from "react";
import SingleButtonModal from "@/components/SingleButtonModal";
import Card from "@/components/Card";
import * as XLSX from "xlsx";

const requiredColumns = [
  "Recurrent",
  "Gender",
  "Age",
  "Residence time",
  "Nationality",
  "Occupation",
  "Education",
  "Revenue",
  "No. families",
  "Tb in family",
  "Tb in neighbor",
  "Tb contact",
  "Cough >=2 weeks",
  "Cough <2 weeks",
  "Emptysis",
  "Fever",
  "Thoracalgia",
  "Others",
  "Sympomless",
  "Have similar sym before",
  "X-ray checking",
  "Sputum specimen",
  "Tb diagnosed",
  "Clinical record checked",
  "Anti-tb drug time",
  "Patient final type decided",
  "Subserotype type",
  "TB Type",
];

export default function FileUploadCard({ onFileProcessed }) {
  const [csvData, setCsvData] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileName = file.name;
    const extension = fileName.split(".").pop().toLowerCase();

    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = evt.target.result;
      if (extension === "csv") {
        setCsvData(data);
      } else if (extension === "xlsx" || extension === "xls") {
        const workbook = XLSX.read(data, { type: "binary" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const csv = XLSX.utils.sheet_to_csv(worksheet);
        setCsvData(csv);
      } else {
        setModalMessage(
          "Unsupported file type. Please upload a CSV or Excel file."
        );
        setModalOpen(true);
      }
    };

    if (extension === "csv") {
      reader.readAsText(file);
    } else if (extension === "xlsx" || extension === "xls") {
      reader.readAsBinaryString(file);
    }
  };

  const validateCSVHeaders = (csvString) => {
    const rows = csvString.split(/\r?\n/).filter((line) => line.trim() !== "");
    if (rows.length === 0) {
      return { valid: false, missing: requiredColumns };
    }
    const headers = rows[0].split(",").map((header) => header.trim());
    const missingColumns = requiredColumns.filter(
      (col) => !headers.includes(col)
    );
    return { valid: missingColumns.length === 0, missing: missingColumns };
  };

  const handleProcessFile = () => {
    if (!csvData) {
      setModalMessage("No file uploaded or file is empty.");
      setModalOpen(true);
      return;
    }

    const { valid, missing } = validateCSVHeaders(csvData);
    if (!valid) {
      setModalMessage("Missing required columns: " + missing.join(", "));
      setModalOpen(true);
      return;
    }

    console.log("CSV Data validated:", csvData);
    if (onFileProcessed) {
      onFileProcessed(csvData);
    }
    setModalMessage("File processed successfully!");
    setModalOpen(true);
  };

  return (
    <>
      <Card title="Upload Information">
        <input
          type="file"
          accept=".csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          onChange={handleFileUpload}
          className="w-full p-2 border rounded-md"
        />
        <button
          onClick={handleProcessFile}
          className="bg-gray-700 text-white px-4 py-2 rounded-md mt-2"
        >
          Process File
        </button>
      </Card>
      <SingleButtonModal
        open={modalOpen}
        setOpen={setModalOpen}
        title="File Validation"
        message={modalMessage}
        buttonText="OK"
      />
    </>
  );
}
