"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import Card from "@/components/Card";
import FileUploadCard from "@/components/FileUploadCard";
import SingleButtonModal from "@/components/SingleButtonModal";
import DynamicForm from "@/components/DynamicForm";
import convertManualDataToFeatures from "@/utils/convertManualDataToFeatures";
import {
  requiredColumns,
  fileToManualMapping,
  manualToSchemaMapping,
  singleRequiredColumns,
} from "@/utils/columnMappings";
import API_URL from "../../utils/api.js";
import createSingleResistanceData from "@/utils/createSingleResistanceData.js";

const generatePatientId = () => {
  return `PER-${uuidv4()}`;
};

export default function DiagnosisPage() {
  const router = useRouter();

  const [patientId, setPatientId] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const initialManualData = requiredColumns.reduce((acc, schemaKey) => {
    const camelCaseKey = fileToManualMapping[schemaKey];
    if (camelCaseKey) {
      acc[camelCaseKey] = "";
    } else {
      console.warn(
        `No camelCase mapping found for required column: ${schemaKey}`
      );
    }
    return acc;
  }, {});

  const [manualData, setManualData] = useState(initialManualData);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [missingFields, setMissingFields] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setPatientId(generatePatientId());
  }, []);

  const handleFileProcessed = (parsedData) => {
    const fileFirstName = parsedData.firstName || parsedData.FirstName;
    const fileLastName = parsedData.lastName || parsedData.LastName;

    const restData = { ...parsedData };
    if (fileFirstName) delete restData.firstName;
    if (fileLastName) delete restData.lastName;

    if (fileFirstName) {
      setFirstName(fileFirstName);
      setMissingFields((prev) => prev.filter((f) => f !== "firstName"));
    }
    if (fileLastName) {
      setLastName(fileLastName);
      setMissingFields((prev) => prev.filter((f) => f !== "lastName"));
    }

    setManualData((prev) => ({ ...prev, ...restData }));
    console.log("Parsed data (camelCase) merged into state:", restData);

    Object.keys(restData).forEach((camelCaseKey) => {
      if (
        restData[camelCaseKey] !== null &&
        String(restData[camelCaseKey]).trim() !== ""
      ) {
        setMissingFields((prev) => prev.filter((f) => f !== camelCaseKey));
      }
    });
  };

  const handleManualChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    setManualData((prev) => ({ ...prev, [name]: newValue }));

    if (type === "checkbox" || String(value).trim() !== "") {
      setMissingFields((prev) => prev.filter((field) => field !== name));
    }
  };

  const handleNameChange = (e) => {
    const { name, value } = e.target;
    if (name === "firstName") {
      setFirstName(value);
    } else if (name === "lastName") {
      setLastName(value);
    }
    if (value.trim() !== "") {
      setMissingFields((prev) => prev.filter((field) => field !== name));
    }
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();

    const requiredManualKeys = requiredColumns
      .map((schemaKey) => fileToManualMapping[schemaKey])
      .filter(Boolean);

    const missingManual = requiredManualKeys.filter((camelCaseKey) => {
      const value = manualData[camelCaseKey];
      return (
        value === null || value === undefined || String(value).trim() === ""
      );
    });

    const missingPatientInfo = [];
    if (firstName.trim() === "") missingPatientInfo.push("firstName");
    if (lastName.trim() === "") missingPatientInfo.push("lastName");

    const allMissingCamelCase = [...missingManual, ...missingPatientInfo];

    if (allMissingCamelCase.length > 0) {
      setMissingFields(allMissingCamelCase);

      const formatFieldName = (field) => {
        if (field === "firstName") return "First Name";
        if (field === "lastName") return "Last Name";
        const schemaKey = manualToSchemaMapping[field];
        return schemaKey || field;
      };

      setModalMessage(
        `There are missing fields. Please complete the highlighted fields. Missing fields: ${allMissingCamelCase
          .map(formatFieldName)
          .join(", ")}`
      );
      setModalOpen(true);
      return;
    }

    setMissingFields([]);
    setIsLoading(true);

    let sendableFeaturesArray = [];
    const featuresArray = convertManualDataToFeatures(manualData);

    console.log("Manual Data:", manualData);
    const firstPrediction = featuresArray.slice(0, 21);

    try {
      const initialPredictionURL =
        "https://dummy-function-750908721088.us-central1.run.app";
      const predictionResponse = await fetch(initialPredictionURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ features: firstPrediction }),
      });
      if (!predictionResponse.ok)
        throw new Error(
          `Initial prediction failed: ${predictionResponse.statusText}`
        );
      const predictionResult = await predictionResponse.json();
      const predictedValue = "0" //String(predictionResult.prediction);
      console.log("Initial Prediction result:", predictionResult);

      let finalResult = predictionResult;
      let extraData = null;
      const additionalEndpoints = {
        0: "https://single-resistance-750908721088.us-central1.run.app", // single
        1: "https://multi-resistance-750908721088.us-central1.run.app", // multi
        2: "https://poly-resistance-750908721088.us-central1.run.app", // poly
      };

      if (additionalEndpoints[predictedValue]) {
        if (predictedValue === "0") {
          const singleResistanceFeatureArray = convertManualDataToFeatures(
            createSingleResistanceData(manualData)
          );
          sendableFeaturesArray = singleResistanceFeatureArray;
          console.log("Single Resistance Data:", createSingleResistanceData(manualData));
          console.log("Single Resistance Feature Array:", singleResistanceFeatureArray);

        } else {
          sendableFeaturesArray = featuresArray.slice(21); // Theoretically shouldnt have to slice but just in case
        }
        const additionalResponse = await fetch(
          additionalEndpoints[predictedValue],
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              features: sendableFeaturesArray,
            }),
          }
        );
        if (!additionalResponse.ok)
          throw new Error(
            `Additional prediction failed: ${additionalResponse.statusText}`
          );
        const additionalResult = await additionalResponse.json();
        console.log("Additional result:", additionalResult);
        extraData = additionalResult;
        finalResult = { ...finalResult, ...additionalResult };
      }

      //TODO: need to test this with the new models
      let calculatedTbType = "Unknown";
      let calculatedAdditionalInfo = "N/A";

      switch (String(predictedValue)) {
        case "0":
          calculatedTbType = "No Resistance Detected / Single Resistance";
          if (finalResult?.specific_drugs?.length > 0) {
            calculatedAdditionalInfo = `Resistant to: ${finalResult.specific_drugs.join(
              ", "
            )}`;
            if (finalResult.specific_drugs.length === 1)
              calculatedTbType = "Single Drug Resistance";
          } else {
            calculatedAdditionalInfo =
              finalResult?.message ||
              "No resistance detected or specific drug info unavailable.";
          }
          break;
        case "1":
          calculatedTbType = "Multi-Drug Resistance";
          calculatedAdditionalInfo = finalResult?.message || "";
          if (
            finalResult?.resistant_drugs &&
            Array.isArray(finalResult.resistant_drugs)
          ) {
            calculatedAdditionalInfo += ` Detected resistance: ${finalResult.resistant_drugs.join(
              ", "
            )}`;
          }
          break;
        case "2":
          calculatedTbType = "Poly-Drug Resistance";
          calculatedAdditionalInfo = finalResult?.message || "";
          if (
            finalResult?.resistant_drugs &&
            Array.isArray(finalResult.resistant_drugs)
          ) {
            calculatedAdditionalInfo += ` Detected resistance: ${finalResult.resistant_drugs.join(
              ", "
            )}`;
          }
          break;
      }

      const transformedData = {};
      for (const camelCaseKey in manualData) {
        const schemaKey = manualToSchemaMapping[camelCaseKey];
        if (schemaKey) {
          transformedData[schemaKey] = manualData[camelCaseKey];
        } else {
          console.warn(
            `No schema mapping found for state key: ${camelCaseKey}. Not included in save data.`
          );
        }
      }

      const recordToSave = {
        patientId,
        firstName,
        lastName,
        ...transformedData,
        predictionType: predictedValue,
        predictionDetails: finalResult,
        "TB Type": calculatedTbType,
      };

      console.log(
        "Attempting to save record (with Schema Keys):",
        recordToSave
      );

      let saveSuccess = false;
      try {
        const saveUrl = `${API_URL}/api/upload/single`;
        console.log("Saving to URL:", saveUrl);

        const saveResponse = await fetch(saveUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(recordToSave),
        });

        if (!saveResponse.ok) {
          let errorMsg = `Failed to save patient record. Status: ${saveResponse.status}`;
          let errorBody = null;
          try {
            errorBody = await saveResponse.json();
            errorMsg = errorBody.message || errorMsg;
          } catch (e) {
            console.warn("Could not parse error response body:", e);
            try {
              const textBody = await saveResponse.text();
              if (textBody && textBody.length < 500)
                errorMsg += `. Response: ${textBody}`;
            } catch (textErr) {
              // should be fine to fail silently
              console.warn("Could not read response body:", textErr);
            }
          }
          console.error("Save Error:", errorMsg, "Response Body:", errorBody);
          setModalMessage(
            `Prediction complete but failed to save record: ${errorMsg}`
          );
          setModalOpen(true);
        } else {
          const saveResult = await saveResponse.json();
          console.log("Patient record saved successfully:", saveResult.doc);
          saveSuccess = true;
        }
      } catch (saveError) {
        console.error("Error submitting patient record:", saveError);
        setModalMessage(
          `Prediction successful, but encountered an error saving the record: ${saveError.message}. Please check connection or contact support.`
        );
        setModalOpen(true);
      }

      if (saveSuccess) {
        let resultsQuery = `?prediction=${encodeURIComponent(predictedValue)}`;
        if (extraData) {
          resultsQuery += `&extra=${encodeURIComponent(
            JSON.stringify(extraData)
          )}`;
        }
        router.push(`/results${resultsQuery}`);
      }
    } catch (error) {
      console.error("Error during prediction or saving process:", error);
      setModalMessage(
        `An error occurred: ${error.message}. Please try again or check console.`
      );
      setModalOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = (field) =>
    `w-full p-2 border rounded-md ${
      missingFields.includes(field) ? "border-red-500" : "border-gray-300"
    } ${isLoading ? "bg-gray-100 cursor-not-allowed" : ""}`;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 relative">
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <svg
            className="animate-spin h-12 w-12 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V4a10 10 0 00-9.95 9.14L4 12z"
            />
          </svg>
        </div>
      )}

      <div className="col-span-1 md:col-span-2 space-y-6">
        <Card title="Patient Information">
          <div className="space-y-4">
            <div>
              <label
                htmlFor="patientId"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Patient ID (Auto-generated)
              </label>
              <input
                type="text"
                id="patientId"
                name="patientId"
                value={patientId}
                readOnly
                className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
              />
            </div>
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={firstName}
                onChange={handleNameChange}
                className={inputClass("firstName")}
                disabled={isLoading}
              />
            </div>
            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={lastName}
                onChange={handleNameChange}
                className={inputClass("lastName")}
                disabled={isLoading}
              />
            </div>
          </div>
        </Card>

        <FileUploadCard
          onFileProcessed={handleFileProcessed}
          disabled={isLoading}
        />

        <Card title="Medical Data Input">
          <DynamicForm
            manualData={manualData}
            handleManualChange={handleManualChange}
            handleManualSubmit={handleManualSubmit}
            inputClass={inputClass}
          />
        </Card>
      </div>
      <div className="col-span-1">
        <Card title="Instructions">
          <p className="text-gray-600">
            Please fill in the required fields and upload a CSV file with the
            patient's medical data. The system will process the data and provide
            a diagnosis.
          </p>
        </Card>
      </div>
      <SingleButtonModal
        open={modalOpen}
        setOpen={setModalOpen}
        title="Notification"
        message={modalMessage}
        buttonText="OK"
      />
    </div>
  );
}
