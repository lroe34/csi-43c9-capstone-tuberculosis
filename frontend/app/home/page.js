"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Card from "@/components/Card";
import axiosInstance from "@/utils/api";
import { predictionMapping } from "@/utils/predictionMapping";
import PatientDetailsModal from "@/components/PatientDetailsModal";
import { useAuth } from "@/context/authContext";
import { useRouter } from "next/navigation";
import AccessDeniedMessage from "@/components/AccessDenied";
import LoadingState from "@/components/LoadingState";
import { TrashIcon } from "@heroicons/react/24/outline";
import ConfirmModal from "@/components/ConfirmModal";

export default function Home() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  const [scans, setScans] = useState([]);
  const [isLoadingScans, setIsLoadingScans] = useState(true);
  const [errorScans, setErrorScans] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [scanIdToDelete, setScanIdToDelete] = useState(null);

  useEffect(() => {
    const fetchRecentScans = async () => {
      if (!user) {
        setErrorScans(
          "Access denied. You must be logged-in to view this page."
        );
        setIsLoadingScans(false);

        return;
      }
      setIsLoadingScans(true);
      setErrorScans(null);
      try {
        const response = await axiosInstance.get(
          "/api/metrics/recent?limit=10"
        );
        setScans(response.data);
      } catch (error) {
        console.error(
          "Failed to fetch recent scans:",
          error.response?.status,
          error.response?.data || error.message
        );
        if (error.response?.status === 401) {
          setErrorScans(
            "Authentication failed or session expired. Please log in again."
          );
          // idk if this needs to be here
          // logout();
          // router.push('/login');
        } else {
          setErrorScans(
            error.response?.data?.message || "Failed to load scan data."
          );
        }
      } finally {
        setIsLoadingScans(false);
      }
    };

    if (!isLoading) {
      fetchRecentScans();
    } else {
      console.log("Home: Waiting for initial authentication check...");
    }
  }, [isLoading, user, router]);

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

  const handleDelete = (scanId, event) => {
    event.stopPropagation();
    setScanIdToDelete(scanId);
    setIsConfirmModalOpen(true);
  };

  const proceedWithDelete = async () => {
    if (!scanIdToDelete) return;

    try {
      const response = await axiosInstance.delete(
        `/api/metrics/delete/${scanIdToDelete}`
      );
      console.log("Delete response:", response.data);
      setScans((prevScans) =>
        prevScans.filter((scan) => scan._id !== scanIdToDelete)
      );
      setIsConfirmModalOpen(false);
    } catch (error) {
      console.error("Failed to delete scan:", error);
    } finally {
      setScanIdToDelete(null);
    }
  };

  const renderSkeletons = () => {
    return Array.from({ length: 6 }).map((_, idx) => (
      <div
        key={idx}
        className="p-4 border rounded-lg shadow animate-pulse space-y-2 bg-white"
      >
        <div className="h-4 w-1/3 bg-gray-200 rounded" />
        <div className="h-3 w-1/2 bg-gray-200 rounded" />
        <div className="h-3 w-2/5 bg-gray-200 rounded" />
      </div>
    ));
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (!user) {
    return <AccessDeniedMessage featureName="home functionality" />;
  }
  return (
    <section className="container mx-auto p-6 flex flex-col gap-8">
      <Card title="Recent Scans" className="space-y-6">
        {isLoadingScans ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {renderSkeletons()}
          </div>
        ) : errorScans ? (
          <p className="text-red-600 text-center p-4">{errorScans}</p>
        ) : scans.length === 0 ? (
          <p className="text-gray-600 text-center p-4">
            No recent scans found.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {scans.map((scan) => (
              <div key={scan._id || scan.id} className="relative group">
                <motion.div
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleViewDetails(scan)}
                  className="p-4 border rounded-lg shadow cursor-pointer transition-shadow hover:shadow-lg space-y-1.5 bg-white h-full"
                >
                  <h3 className="text-lg font-medium text-gray-800 truncate pr-8">
                    {scan.firstName || "N/A"} {scan.lastName || ""}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Scan Result:{" "}
                    <span className="font-semibold">
                      {predictionMapping[scan.predictionType] ?? "N/A"}
                    </span>
                  </p>
                  <p className="text-sm text-gray-600">
                    Date: {formatDate(scan.createdAt)}
                  </p>
                </motion.div>
                <button
                  onClick={(e) => handleDelete(scan._id, e)}
                  title="Delete Scan Record"
                  aria-label="Delete Scan Record"
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-red-100 text-red-600 opacity-0 group-hover:opacity-100 
                    hover:bg-red-200 hover:text-red-800 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 
                    focus-visible:ring-red-500 focus-visible:ring-offset-1 transition-opacity duration-200 ease-in-out"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </Card>
      <PatientDetailsModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        patientData={selectedPatient}
      />
      <ConfirmModal
        open={isConfirmModalOpen}
        setOpen={setIsConfirmModalOpen}
        title="Confirm Deletion"
        message={`Are you sure you want to permanently delete the scan record? This action cannot be undone.`}
        onConfirm={proceedWithDelete}
        confirmButtonText="Delete"
        cancelButtonText="Cancel"
        variant="info"
      />{" "}
    </section>
  );
}
