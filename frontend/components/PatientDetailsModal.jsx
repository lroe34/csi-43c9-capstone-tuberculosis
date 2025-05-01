"use client";

import React from "react";
import Card from "./Card";

const getResistanceType = (patientData) => {
  console.log("Patient Data:", patientData);
  if (!patientData) return "N/A";

  const type = patientData.predictionType;
  const details = patientData.predictionDetails;

  // TODO: add more details with the details thingy
  switch (String(type)) {
    case "0":
      return "Single Resistance";
    case "1":
      return "Multi-Drug Resistance";
    case "2":
      return "Poly-Drug Resistance";
    default:
      return "None";
  }
};

const formatAdditionalDetails = (patientData) => {
  if (!patientData) return null;
  return (
    <>
      {patientData.predictionDetails && (
        <div>
          <h4 className="font-semibold mt-3 mb-1 text-sm text-gray-600">
            Prediction Details:
          </h4>
          <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
            {JSON.stringify(patientData.predictionDetails, null, 2)}
          </pre>
        </div>
      )}
    </>
  );
};

export default function PatientDetailModal({ isOpen, onClose, patientData }) {
  if (!isOpen || !patientData) {
    return null;
  }

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const resistanceType = getResistanceType(patientData);
  const additionalDetails = formatAdditionalDetails(patientData);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 transition-opacity duration-300 ease-in-out"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="patient-modal-title"
    >
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full overflow-hidden">
        <Card title="">
          <div className="flex justify-between items-center pb-3 border-b mb-4">
            <h2
              id="patient-modal-title"
              className="text-lg font-semibold text-gray-800"
            >
              Patient Details
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-800 text-2xl leading-none"
              aria-label="Close modal"
            >
              &times;
            </button>
          </div>

          <div className="space-y-3 text-sm">
            <div>
              <span className="font-semibold text-gray-700">Name: </span>
              <span className="text-gray-900">
                {`${patientData.firstName || ""} ${
                  patientData.lastName || ""
                }`.trim() || "N/A"}
              </span>
            </div>
            <div>
              <span className="font-semibold text-gray-700">Patient ID: </span>
              <span className="text-gray-900 font-mono text-xs">
                {patientData.patientId || "N/A"}
              </span>
            </div>
            <div>
              <span className="font-semibold text-gray-700">
                TB Resistance Type:{" "}
              </span>
              <span
                className={`font-medium ${
                  resistanceType.includes("Resistance")
                    ? "text-orange-700"
                    : "text-green-700"
                }`}
              >
                {resistanceType}
              </span>
            </div>

            {additionalDetails && (
              <div className="pt-2 border-t mt-3">{additionalDetails}</div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t text-right">
            <button
              onClick={onClose}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded text-sm shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
            >
              Close
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
