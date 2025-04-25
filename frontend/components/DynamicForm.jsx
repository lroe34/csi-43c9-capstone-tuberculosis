"use client";
import React from "react";
import { requiredColumns, fileToManualMapping } from "@/utils/columnMappings";

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
          return (
            <div key={column}>
              <label className="block text-sm font-medium text-gray-700">
                {column}
              </label>
              <input
                type={"number"}
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
