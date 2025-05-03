"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Card from "@/components/Card";
import {
  predictionMapping,
  singleResistanceMapping,
} from "@/utils/predictionMapping";
import generateResistanceInfoFromRawPrediction from "@/utils/generateResistanceInfoFromRawPrediction";

function ResultsContent() {
  const searchParams = useSearchParams();
  const predictionParam = searchParams.get("prediction");
  const extraParam = searchParams.get("extra");

  let additionalInfoValue = null;
  let rawPredictionArray = null;

  if (extraParam) {
    console.log("Extra parameter:", extraParam);
    try {
      const extraData = JSON.parse(extraParam);
      const raw = extraData.raw_prediction;

      console.log("Row:", raw);
      if (Array.isArray(raw) && raw.length > 0) {
        if (Array.isArray(raw[0]) && typeof raw[0][0] === "number") {
          rawPredictionArray = raw[0];
        } else if (typeof raw[0] === "number") {
          rawPredictionArray = raw;
        } else {
          console.warn("Raw prediction data is not in expected array format.");
          rawPredictionArray = null;
        }

        if (rawPredictionArray) {
          console.log("Parsed Raw prediction array:", rawPredictionArray);
          additionalInfoValue = String(rawPredictionArray);
          console.log(
            "Additional info value (stringified array):",
            additionalInfoValue
          );
        }
      } else {
        console.warn(
          "Received 'extra' param, but raw_prediction was not a valid array or was empty."
        );
      }
    } catch (error) {
      console.error("Failed to parse 'extra' parameter JSON:", error);
    }
  }

  const predictionText =
    predictionParam && predictionMapping[predictionParam] !== undefined
      ? predictionMapping[predictionParam]
      : "No prediction available.";

  let additionalPredictionText = "No additional information available.";

  if (predictionParam === "0") {
    if (additionalInfoValue !== null) {
      additionalPredictionText =
        singleResistanceMapping[additionalInfoValue] !== undefined
          ? singleResistanceMapping[additionalInfoValue]
          : "Specific resistance type mapping not found for key: " +
            additionalInfoValue;
    } else {
      additionalPredictionText =
        "Could not determine specific resistance type (missing data).";
    }
  } else if (predictionParam === "1") {
    if (rawPredictionArray !== null) {
      additionalPredictionText = generateResistanceInfoFromRawPrediction(
        rawPredictionArray,
        "multi"
      );
    } else {
      additionalPredictionText =
        "Could not determine specific resistance types: Expected array data missing or invalid for Multi Resistance.";
    }
  } else if (predictionParam === "2") {
    console.log("Raw prediction array (for Poly):", rawPredictionArray);
    if (rawPredictionArray !== null) {
      additionalPredictionText = generateResistanceInfoFromRawPrediction(
        rawPredictionArray,
        "poly"
      );
    } else {
      additionalPredictionText =
        "Could not determine specific resistance types: Expected array data missing or invalid for Poly Resistance.";
    }
  } else if (predictionParam === "3") {
    additionalPredictionText = "No Resistance detected.";
  }

  return (
    <div className="max-w-3xl mx-auto p-6 md:p-8 space-y-6 bg-white rounded-lg shadow-lg my-8">
      <Card title="Prediction Outcome">
        <div className="p-4">
          {" "}
          <p
            className={`
             text-xl md:text-2xl font-semibold leading-tight
             ${predictionParam === "3" ? "text-green-700" : ""}
             ${
               predictionParam === "1" || predictionParam === "2"
                 ? "text-red-700"
                 : ""
             }
             ${predictionParam === "0" ? "text-orange-700" : ""}
             ${!predictionParam ? "text-gray-500" : ""}
           `}
          >
            {predictionText}
          </p>
          {predictionParam === "1" && (
            <p className="text-sm text-gray-600 mt-1">
              Resistance to at least Retozide and Rifampicin.
            </p>
          )}
          {predictionParam === "3" && (
            <p className="text-sm text-gray-600 mt-1">
              Not susceptible to tested drugs.
            </p>
          )}
        </div>
      </Card>

      <Card title="Resistance Details">
        <div className="p-4">
          {" "}
          <p
            className={`
             text-base md:text-lg text-gray-800 leading-relaxed
             ${
               additionalPredictionText.startsWith(
                 "Drugs you are resistant to:"
               )
                 ? "font-medium"
                 : ""
             }
             ${
               additionalPredictionText === "No Resistance detected."
                 ? "text-green-600 font-semibold"
                 : ""
             }
             ${
               additionalPredictionText.includes("not found") ||
               additionalPredictionText.includes("Could not determine") ||
               additionalPredictionText.includes("missing or invalid")
                 ? "text-gray-500 italic"
                 : ""
             }
            `}
          >
            {additionalPredictionText}
          </p>
        </div>
      </Card>

      <div className="text-center text-xs text-gray-400 pt-4 border-t border-gray-200">
        Report generated: {new Date().toLocaleString()}
      </div>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-lg text-gray-500">Loading results...</div>
        </div>
      }
    >
      <ResultsContent />
    </Suspense>
  );
}
