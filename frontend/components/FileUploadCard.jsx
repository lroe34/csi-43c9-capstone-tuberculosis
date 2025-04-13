"use client";

import { useState } from "react";
import SingleButtonModal from "@/components/SingleButtonModal";
import Card from "@/components/Card";
import * as XLSX from "xlsx";
import { requiredColumns, fileToManualMapping } from "@/utils/columnMappings";

export default function FileUploadCard({ onFileProcessed }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalVariant, setModalVariant] = useState("error");

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileName = file.name;
    const extension = fileName.split(".").pop().toLowerCase();

    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = evt.target.result;
      let csvData = "";
      if (extension === "csv") {
        csvData = data;
      } else if (extension === "xlsx" || extension === "xls") {
        const workbook = XLSX.read(data, { type: "binary" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        csvData = XLSX.utils.sheet_to_csv(worksheet);
      } else {
        setModalVariant("error");
        setModalMessage(
          "Unsupported file type. Please upload a CSV or Excel file."
        );
        setModalOpen(true);
        return;
      }
      processCSVData(csvData);
    };

    if (extension === "csv") {
      reader.readAsText(file);
    } else if (extension === "xlsx" || extension === "xls") {
      reader.readAsBinaryString(file);
    }
  };

  const processCSVData = (csvString) => {
    const rows = csvString.split(/\r?\n/).filter((row) => row.trim() !== "");
    if (rows.length < 2) {
      setModalVariant("error");
      setModalMessage("The file does not contain enough data.");
      setModalOpen(true);
      return;
    }
    const headers = rows[0].split(",").map((header) => header.trim());
    const values = rows[1].split(",").map((val) => val.trim());

    const parsedData = {};
    requiredColumns.forEach((col) => {
      const manualKey = fileToManualMapping[col];
      const index = headers.indexOf(col);
      parsedData[manualKey] = index !== -1 ? values[index] || "" : "";
    });

    const missingFields = requiredColumns.filter((col) => {
      const manualKey = fileToManualMapping[col];
      return !parsedData[manualKey] || parsedData[manualKey].trim() === "";
    });

    onFileProcessed(parsedData);

    if (missingFields.length === 0) {
      setModalVariant("success");
      setModalMessage(
        "File processed successfully! Please verify data is correct and submit."
      );
    } else {
      setModalVariant("error");
      setModalMessage(
        `File processed successfully, but the following fields are missing: ${missingFields.join(
          ", "
        )}. Please update them in the manual form.`
      );
    }
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
      </Card>
      <SingleButtonModal
        open={modalOpen}
        setOpen={setModalOpen}
        title="File Status"
        message={modalMessage}
        buttonText="OK"
        variant={modalVariant}
      />
    </>
  );
}
