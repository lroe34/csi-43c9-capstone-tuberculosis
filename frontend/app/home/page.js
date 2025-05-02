"use client";

import { useState, useEffect } from "react";
import Card from "@/components/Card";
import API_URL from "@/utils/api";
import { predictionMapping } from "@/utils/predictionMapping";
export default function Home() {
  const [scans, setScans] = useState([]);
  const [isLoadingScans, setIsLoadingScans] = useState(true);
  const [errorScans, setErrorScans] = useState(null);

  useEffect(() => {
    const fetchRecentScans = async () => {
      setIsLoadingScans(true);
      setErrorScans(null);

      try {
        const response = await fetch(`${API_URL}/api/metrics/recent?limit=10`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Recent scans data:", data);
        setScans(data);
      } catch (error) {
        console.error("Failed to fetch recent scans:", error);
        setErrorScans(error.message || "Failed to load scan data.");
      } finally {
        setIsLoadingScans(false);
      }
    };

    fetchRecentScans();
  }, []);

  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    try {
      return new Date(timestamp).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) {
      return "Invalid Date";
    }
  };

  return (
    <div className="p-6 flex flex-col space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Recent Scans">
          <div className="space-y-4">
            {isLoadingScans ? (
              <p>Loading recent scans...</p>
            ) : errorScans ? (
              <p className="text-red-600">Error: {errorScans}</p>
            ) : scans.length === 0 ? (
              <p>No recent scans found.</p>
            ) : (
              scans.map((scan) => (
                <div
                  key={scan._id || scan.id}
                  className="p-4 border rounded-lg shadow-sm"
                >
                  <h3 className="text-md font-medium text-gray-800">
                    {scan.firstName} {scan.lastName || "Unknown"}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Scan Result:{" "}
                    <span className="font-semibold">
                      {predictionMapping[scan.predictionType] || "N/A"}
                    </span>
                  </p>
                  <p className="text-sm text-gray-600">
                    Date: {formatDate(scan.createdAt)}
                  </p>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
