"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Card from "@/components/Card";

function ResultsContent() {
  const searchParams = useSearchParams();
  const predictionParam = searchParams.get("prediction");

  const predictionMapping = {
    0: "Single resistance",
    1: "Multi resistance",
    2: "Poly resistance",
    3: "NO resistance",
  };

  const predictionText =
    predictionParam && predictionMapping[predictionParam]
      ? predictionMapping[predictionParam]
      : "No prediction available.";

  return (
    <div className="space-y-4">
      <Card title="Outcome">
        <p>
          {predictionParam
            ? `Your prediction result is: ${predictionText}`
            : "No prediction available."}
        </p>
      </Card>
      <Card title="Recommendations for Further Actions">
        <p>
          {predictionParam
            ? "Based on your prediction, we recommend you consult with a specialist."
            : "No recommendations available."}
        </p>
      </Card>
      <Card title="Resources for Medical Help">
        <p>
          {predictionParam
            ? "Here are some resources: [Link to resource 1, Link to resource 2]"
            : "No resources available."}
        </p>
      </Card>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={<div>Loading results...</div>}>
      <ResultsContent />
    </Suspense>
  );
}
