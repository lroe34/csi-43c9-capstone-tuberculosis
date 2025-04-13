"use client";
import React from "react";
import { requiredColumns, fileToManualMapping } from "@/utils/columnMappings";


// TODO: update maping for rest of them 
const inputTypeMapping = {
  Age: "number",
  "No. families": "number",
  "Tb in family": "number",
  "Tb in neighbor": "number",
};

const DynamicForm = ({
  manualData,
  handleManualChange,
  handleManualSubmit,
  inputClass,
}) => {
  return (
    <form onSubmit={handleManualSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {requiredColumns.map((column) => {
          const stateKey = fileToManualMapping[column];
          const type = inputTypeMapping[column] || "text";
          return (
            <div key={stateKey}>
              <label className="block text-sm font-medium text-gray-700">
                {column}
              </label>
              <input
                type={type}
                name={stateKey}
                value={manualData[stateKey] || ""}
                onChange={handleManualChange}
                className={inputClass(stateKey)}
                placeholder={column}
              />
            </div>
          );
        })}
      </div>
      <button
        type="submit"
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        Submit For Prediction
      </button>
    </form>
  );
};

export default DynamicForm;
