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
        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out"
      >
        Submit For Prediction
      </button>
    </form>
  );
};

export default DynamicForm;
