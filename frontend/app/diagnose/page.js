"use client";

import Card from "@/components/Card";
import FileUploadCard from "@/components/FileUploadCard";

export default function DiagnosisPage() {
  const handleFileProcessed = (csvData) => {
    console.log("Received CSV data from FileUploadCard:", csvData);
  };

  return (
    <div className="grid grid-cols-3 gap-6">
      <div className="col-span-2 space-y-6">
        <Card title="Symptoms">
          <input
            type="text"
            className="w-full p-2 border rounded-md"
            placeholder="Enter symptoms"
          />
        </Card>
        <Card title="Medical History">
          <input
            type="text"
            className="w-full p-2 border rounded-md"
            placeholder="Enter medical history"
          />
        </Card>
        <FileUploadCard onFileProcessed={handleFileProcessed} />
      </div>
      <div className="col-span-1">
        <Card title="More Resources"></Card>
      </div>
    </div>
  );
}
