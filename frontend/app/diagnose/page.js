"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Card from "@/components/Card";
import FileUploadCard from "@/components/FileUploadCard";
import SingleButtonModal from "@/components/SingleButtonModal";
import DynamicForm from "@/components/DynamicForm";
import convertManualDataToFeatures from "@/utils/convertManualDataToFeatures";
import { requiredColumns, fileToManualMapping } from "@/utils/columnMappings";

export default function DiagnosisPage() {
  const router = useRouter();

  const initialManualData = requiredColumns.reduce((acc, col) => {
    const stateKey = fileToManualMapping[col];
    if (stateKey) {
      acc[stateKey] = "";
    }
    return acc;
  }, {});

  const [manualData, setManualData] = useState(initialManualData);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [missingFields, setMissingFields] = useState([]);

  const handleFileProcessed = (parsedData) => {
    setManualData((prev) => ({ ...prev, ...parsedData }));
  };

  const handleManualChange = (e) => {
    const { name, value } = e.target;
    setManualData((prev) => ({ ...prev, [name]: value }));
    if (value.trim() !== "") {
      setMissingFields((prev) => prev.filter((field) => field !== name));
    }
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();

    const missing = Object.keys(manualData).filter(
      (key) => manualData[key].trim() === ""
    );

    if (missing.length > 0) {
      setMissingFields(missing);
      setModalMessage(
        `There are missing fields. Please complete the highlighted fields. Missing fields: ${missing
          .map((field) => field.replace(/([A-Z])/g, " $1"))
          .join(", ")}`
      );
      setModalOpen(true);
      return;
    }

    const featuresArray = convertManualDataToFeatures(manualData);
    console.log("Features array:", featuresArray);
    console.log("Features array length:", featuresArray.length);
    console.log("Manual data length:", Object.keys(manualData).length);
    try {
      const initialPredictionURL =
        "https://dummy-function-750908721088.us-central1.run.app";

      const predictionResponse = await fetch(initialPredictionURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ features: featuresArray }),
      });
      const predictionResult = await predictionResponse.json();
      const predictedValue = String(predictionResult.prediction);
      console.log("Prediction result:", predictionResult);

      const additionalEndpoints = {
        0: "get-this-later",
        1: "get-this-later",
        2: "get-this-later",
        3: "get-this-later",
      };

      if (additionalEndpoints[predictedValue]) {
        const additionalResponse = await fetch(
          additionalEndpoints[predictedValue],
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              features: featuresArray,
              prediction: predictedValue,
            }),
          }
        );
        const additionalResult = await additionalResponse.json();
        console.log("Additional result:", additionalResult);

        router.push(
          `/results?prediction=${encodeURIComponent(
            predictedValue
          )}&extra=${encodeURIComponent(JSON.stringify(additionalResult))}`
        );
      } else {
        // In theory we never get here
        router.push(
          `/results?prediction=${encodeURIComponent(predictedValue)}`
        );
      }
    } catch (error) {
      console.error("Error processing manual data:", error);
    }
  };

  // helper for styling the 20 billion diffreent input fields
  const inputClass = (field) =>
    `w-full p-2 border rounded-md ${
      missingFields.includes(field) ? "border-red-500" : "border-gray-300"
    }`;

  return (
    <div className="grid grid-cols-3 gap-6 p-6">
      <div className="col-span-2 space-y-6">
        <FileUploadCard onFileProcessed={handleFileProcessed} />

        <Card title="Data Input">
          <DynamicForm
            manualData={manualData}
            handleManualChange={handleManualChange}
            handleManualSubmit={handleManualSubmit}
            inputClass={inputClass}
          />
        </Card>
      </div>
      <div className="col-span-1">
        <Card title="More Resources" />
      </div>
      <SingleButtonModal
        open={modalOpen}
        setOpen={setModalOpen}
        title="Form Error"
        message={modalMessage}
        buttonText="OK"
      />
    </div>
  );
}
