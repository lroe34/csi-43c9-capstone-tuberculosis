"use client";

import { useRouter } from "next/navigation";
import Card from "@/components/Card";
import FileUploadCard from "@/components/FileUploadCard";

export default function DiagnosisPage() {
  const router = useRouter();

  const handleFileProcessed = async (csvData) => {
    try {
      // const uploadResponse = await fetch("http://localhost:5001/api/upload", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ csvData }),
      // });
      // const uploadResult = await uploadResponse.json();
      // console.log("Upload result:", uploadResult);

      const features = [10, 1, 35, 0];

      const predictionResponse = await fetch(
        "https://dummy-function-750908721088.us-central1.run.app",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ features }),
        }
      );
      const predictionResult = await predictionResponse.json();
      console.log("Prediction result:", predictionResult);

      router.push(
        `/results?prediction=${encodeURIComponent(predictionResult.prediction)}`
      );
    } catch (error) {
      console.error("Error processing file or predicting data:", error);
    }
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
