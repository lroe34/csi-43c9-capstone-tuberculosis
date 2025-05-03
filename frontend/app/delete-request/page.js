"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/authContext";
import axiosInstance from "@/utils/api";
import Card from "@/components/Card";
import SingleButtonModal from "@/components/SingleButtonModal";
import { useRouter } from "next/navigation";
import LoadingState from "@/components/LoadingState";
import AccessDeniedMessage from "@/components/AccessDenied";

export default function DeleteRequestPage() {
  const router = useRouter();
  const { user, isLoading: isAuthLoading, logout } = useAuth();

  const [password, setPassword] = useState("");
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [modalVariant, setModalVariant] = useState("error");

  useEffect(() => {
    if (isModalOpen) return;
    setModalTitle("");
    setModalMessage("");
  }, [password, isConfirmed, isModalOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setModalMessage("");

    if (!password) {
      setModalTitle("Validation Error");
      setModalMessage("Password confirmation is required.");
      setModalVariant("error");
      setIsModalOpen(true);
      return;
    }
    if (!isConfirmed) {
      setModalTitle("Validation Error");
      setModalMessage("You must confirm you understand the consequences.");
      setModalVariant("error");
      setIsModalOpen(true);
      return;
    }
    if (!user) {
      setModalTitle("Authentication Error");
      setModalMessage("You must be logged in to request data deletion.");
      setModalVariant("error");
      setIsModalOpen(true);
      return;
    }

    setIsSubmitting(true);

    try {
      await axiosInstance.post("/api/users/request-deletion", { password });

      setModalTitle("Request Submitted");
      setModalMessage(
        "Your data deletion request has been successfully submitted. Your account and data will be deleted shortly, and you will be logged out."
      );
      setModalVariant("success");
      setIsModalOpen(true);

      setPassword("");
      setIsConfirmed(false);
    } catch (err) {
      console.error(
        "Deletion request failed:",
        err.response?.data || err.message
      );
      setModalTitle("Request Failed");
      setModalMessage(
        err.response?.data?.message ||
          "Failed to submit deletion request. Please check your password or try again later."
      );
      setModalVariant("error");
      setIsModalOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    if (modalVariant === "success") {
      console.log(
        "Logging out after successful deletion request confirmation."
      );
      logout();
      router.push("/login");
    }
  };

  if (isAuthLoading) {
    return <LoadingState />;
  }

  if (!user) {
    return <AccessDeniedMessage />;
  }

  return (
    <div className="p-6 max-w-lg mx-auto">
      <Card title="Request Data Deletion">
        <div className="p-4 md:p-6 space-y-6">
          <p className="text-sm text-gray-700">
            You are about to request the permanent deletion of all data
            associated with your account ({user.email}). This includes patient
            records, scan results, and any other information linked to your user
            profile.
          </p>
          <p className="text-sm font-semibold text-red-600">
            This action is irreversible. Once deleted, your data cannot be
            recovered.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email_display"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Account Email
              </label>
              <input
                type="email"
                id="email_display"
                value={user.email}
                disabled
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 cursor-not-allowed focus:outline-none"
                aria-label="Account Email"
              />
            </div>

            <div>
              <label
                htmlFor="password_confirm"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="password_confirm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isSubmitting}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 disabled:opacity-50"
                placeholder="Enter your password to confirm"
                aria-label="Confirm Password"
              />
            </div>

            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="confirmation"
                  name="confirmation"
                  type="checkbox"
                  checked={isConfirmed}
                  onChange={(e) => setIsConfirmed(e.target.checked)}
                  disabled={isSubmitting}
                  className="focus:ring-red-500 h-4 w-4 text-red-600 border-gray-300 rounded disabled:opacity-50"
                  aria-describedby="confirmation-description"
                />
              </div>
              <div className="ml-3 text-sm">
                <label
                  htmlFor="confirmation"
                  className="font-medium text-gray-700"
                >
                  I understand this is permanent
                </label>
                <p id="confirmation-description" className="text-gray-500">
                  I acknowledge that requesting data deletion is irreversible
                  and all my associated data will be permanently removed.
                </p>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting || !isConfirmed || !password}
                className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out"
              >
                {isSubmitting
                  ? "Submitting Request..."
                  : "Request Data Deletion"}
              </button>
            </div>
          </form>
        </div>
      </Card>

      <SingleButtonModal
        open={isModalOpen}
        setOpen={handleModalClose}
        title={modalTitle}
        message={modalMessage}
        variant={modalVariant}
        buttonText="OK"
      />
    </div>
  );
}
