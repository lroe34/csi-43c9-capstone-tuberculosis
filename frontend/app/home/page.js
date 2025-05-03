"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Card from "@/components/Card";
import API_URL from "@/utils/api";
import { predictionMapping } from "@/utils/predictionMapping";
import PatientDetailsModal from "@/components/PatientDetailsModal";

export default function Home() {
  const [scans, setScans] = useState([]);
  const [isLoadingScans, setIsLoadingScans] = useState(true);
  const [errorScans, setErrorScans] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

  useEffect(() => {
    const fetchRecentScans = async () => {
      setIsLoadingScans(true);
      setErrorScans(null);
      try {
        const response = await fetch(`${API_URL}/api/metrics/recent?limit=10`);
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
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

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPatient(null);
  };

  const handleViewDetails = (patient) => {
    setSelectedPatient(patient);
    setIsModalOpen(true);
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    try {
      return new Date(timestamp).toLocaleString(undefined, {
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

  const renderSkeletons = () =>
    Array.from({ length: 6 }).map((_, idx) => (
      <div
        key={idx}
        className="p-4 border rounded-lg shadow animate-pulse space-y-2"
      >
        <div className="h-4 w-1/3 bg-gray-200 rounded" />
        <div className="h-3 w-1/2 bg-gray-200 rounded" />
        <div className="h-3 w-2/5 bg-gray-200 rounded" />
      </div>
    ));

  return (
    <section className="container mx-auto p-6 flex flex-col gap-8">
      <Card title="Recent Scans" className="space-y-6">
        {isLoadingScans ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {renderSkeletons()}
          </div>
        ) : errorScans ? (
          <p className="text-red-600">{errorScans}</p>
        ) : scans.length === 0 ? (
          <p className="text-gray-600">No recent scans found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {scans.map((scan) => (
              <motion.div
                key={scan._id || scan.id}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleViewDetails(scan)}
                className="p-4 border rounded-lg shadow cursor-pointer transition-shadow hover:shadow-lg space-y-1.5"
              >
                <h3 className="text-lg font-medium text-black-200 truncate">
                  {scan.firstName} {scan.lastName || "Unknown"}
                </h3>
                <p className="text-sm text-gray-600 text-gray-400">
                  Scan Result:{" "}
                  <span className="font-semibold">
                    {predictionMapping[scan.predictionType] || "N/A"}
                  </span>
                </p>
                <p className="text-sm text-gray-600 text-gray-400">
                  Date: {formatDate(scan.createdAt)}
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </Card>

      <PatientDetailsModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        patientData={selectedPatient}
      />
    </section>
  );
}
