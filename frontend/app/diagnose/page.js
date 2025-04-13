"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Card from "@/components/Card";
import FileUploadCard from "@/components/FileUploadCard";
import SingleButtonModal from "@/components/SingleButtonModal";
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
      const predictionResponse = await fetch(
        "https://dummy-function-750908721088.us-central1.run.app",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ features: featuresArray }),
        }
      );
      const predictionResult = await predictionResponse.json();

      //TODO: something here based on response, sending it somewhere else
      console.log("Prediction result:", predictionResult);

      router.push(
        `/results?prediction=${encodeURIComponent(predictionResult.prediction)}`
      );
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
          <form onSubmit={handleManualSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Gender
                </label>
                <input
                  type="text"
                  name="gender"
                  value={manualData.gender}
                  onChange={handleManualChange}
                  className={inputClass("gender")}
                  placeholder="Gender"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Age
                </label>
                <input
                  type="number"
                  name="age"
                  value={manualData.age}
                  onChange={handleManualChange}
                  className={inputClass("age")}
                  placeholder="Age"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Residence Time
                </label>
                <input
                  type="text"
                  name="residenceTime"
                  value={manualData.residenceTime}
                  onChange={handleManualChange}
                  className={inputClass("residenceTime")}
                  placeholder="Residence Time"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  No. Families
                </label>
                <input
                  type="number"
                  name="noFamilies"
                  value={manualData.noFamilies}
                  onChange={handleManualChange}
                  className={inputClass("noFamilies")}
                  placeholder="No. Families"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Tb in Family
                </label>
                <input
                  type="number"
                  name="tbInFamily"
                  value={manualData.tbInFamily}
                  onChange={handleManualChange}
                  className={inputClass("tbInFamily")}
                  placeholder="Tb in Family"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Tb in Neighbor
                </label>
                <input
                  type="number"
                  name="tbInNeighbor"
                  value={manualData.tbInNeighbor}
                  onChange={handleManualChange}
                  className={inputClass("tbInNeighbor")}
                  placeholder="Tb in Neighbor"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Tb Contact
                </label>
                <input
                  type="text"
                  name="tbContact"
                  value={manualData.tbContact}
                  onChange={handleManualChange}
                  className={inputClass("tbContact")}
                  placeholder="Tb Contact"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Cough ≥ 2 Weeks
                </label>
                <input
                  type="text"
                  name="coughTwoWeeks"
                  value={manualData.coughTwoWeeks}
                  onChange={handleManualChange}
                  className={inputClass("coughTwoWeeks")}
                  placeholder="Cough ≥ 2 Weeks"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Cough &lt; 2 Weeks
                </label>
                <input
                  type="text"
                  name="coughLessThan2Weeks"
                  value={manualData.coughLessThan2Weeks}
                  onChange={handleManualChange}
                  className={inputClass("coughLessThan2Weeks")}
                  placeholder="Cough < 2 Weeks"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Emptysis
                </label>
                <input
                  type="text"
                  name="emptysis"
                  value={manualData.emptysis}
                  onChange={handleManualChange}
                  className={inputClass("emptysis")}
                  placeholder="Emptysis"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Fever
                </label>
                <input
                  type="text"
                  name="fever"
                  value={manualData.fever}
                  onChange={handleManualChange}
                  className={inputClass("fever")}
                  placeholder="Fever"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Thoracalgia
                </label>
                <input
                  type="text"
                  name="thoracalgia"
                  value={manualData.thoracalgia}
                  onChange={handleManualChange}
                  className={inputClass("thoracalgia")}
                  placeholder="Thoracalgia"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Others
                </label>
                <input
                  type="text"
                  name="others"
                  value={manualData.others}
                  onChange={handleManualChange}
                  className={inputClass("others")}
                  placeholder="Others"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Symptomless
                </label>
                <input
                  type="text"
                  name="symptomless"
                  value={manualData.symptomless}
                  onChange={handleManualChange}
                  className={inputClass("symptomless")}
                  placeholder="Symptomless"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Have Similar Sym Before
                </label>
                <input
                  type="text"
                  name="similarSymBefore"
                  value={manualData.similarSymBefore}
                  onChange={handleManualChange}
                  className={inputClass("similarSymBefore")}
                  placeholder="Have Similar Sym Before"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  X-ray Checking
                </label>
                <input
                  type="text"
                  name="xrayChecking"
                  value={manualData.xrayChecking}
                  onChange={handleManualChange}
                  className={inputClass("xrayChecking")}
                  placeholder="X-ray Checking"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Sputum Specimen
                </label>
                <input
                  type="text"
                  name="sputumSpecimen"
                  value={manualData.sputumSpecimen}
                  onChange={handleManualChange}
                  className={inputClass("sputumSpecimen")}
                  placeholder="Sputum Specimen"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Tb Diagnosed
                </label>
                <input
                  type="text"
                  name="tbDiagnosed"
                  value={manualData.tbDiagnosed}
                  onChange={handleManualChange}
                  className={inputClass("tbDiagnosed")}
                  placeholder="Tb Diagnosed"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Clinical Record Checked
                </label>
                <input
                  type="text"
                  name="clinicalRecordChecked"
                  value={manualData.clinicalRecordChecked}
                  onChange={handleManualChange}
                  className={inputClass("clinicalRecordChecked")}
                  placeholder="Clinical Record Checked"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Anti-tb Drug Time
                </label>
                <input
                  type="text"
                  name="antiTbDrugTime"
                  value={manualData.antiTbDrugTime}
                  onChange={handleManualChange}
                  className={inputClass("antiTbDrugTime")}
                  placeholder="Anti-tb Drug Time"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Patient Final Type Decided
                </label>
                <input
                  type="text"
                  name="patientFinalTypeDecided"
                  value={manualData.patientFinalTypeDecided}
                  onChange={handleManualChange}
                  className={inputClass("patientFinalTypeDecided")}
                  placeholder="Patient Final Type Decided"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Subserotype Type
                </label>
                <input
                  type="text"
                  name="subserotypeType"
                  value={manualData.subserotypeType}
                  onChange={handleManualChange}
                  className={inputClass("subserotypeType")}
                  placeholder="Subserotype Type"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  TB Type
                </label>
                <input
                  type="text"
                  name="tbType"
                  value={manualData.tbType}
                  onChange={handleManualChange}
                  className={inputClass("tbType")}
                  placeholder="TB Type"
                />
              </div>
            </div>
            <button
              type="submit"
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
            >
              Submit For Prediction
            </button>
          </form>
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
