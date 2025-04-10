"use client";

import { useSearchParams } from "next/navigation";
import Card from "@/components/Card";

export default function ResultsPage() {
  const searchParams = useSearchParams();
  const prediction = searchParams.get("prediction");

  return (
    <div className="space-y-4">
      <Card title="Outcome">
        <p>
          {prediction
            ? `Your prediction result is: ${prediction}`
            : "No prediction available."}
        </p>
      </Card>
      <Card title="Recommendations for Further Actions">
        <p>
          {prediction
            ? "Based on your prediction, we recommend you consult with a specialist."
            : "No recommendations available."}
        </p>
      </Card>
      <Card title="Resources for Medical Help">
        <p>
          {prediction
            ? "Here are some resources: [Link to resource 1, Link to resource 2]"
            : "No resources available."}
        </p>
      </Card>
    </div>
  );
}
