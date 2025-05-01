"use client";

import { useState } from "react";
import Card from "@/components/Card";
import PatientDetailsModal from "@/components/PatientDetailsModal";
import API_URL from "../../utils/api";

export default function Search() {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchPerformed, setSearchPerformed] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setError("Please enter a search term.");
      setResults([]);
      setSearchPerformed(true);
      return;
    }

    setIsLoading(true);
    setError(null);
    setResults([]);
    setSearchPerformed(true);

    try {
      const response = await fetch(
        `${API_URL}/api/metrics/search?name=${encodeURIComponent(searchQuery)}`
      );
      const contentType = response.headers.get("content-type");

      if (!response.ok) {
        let errorText = `Error: ${response.status} ${response.statusText}`;
        try {
          // Attempt to figure out why im getting funky errors that cant be displayed normally
          const bodyText = await response.text();
          if (bodyText && bodyText.length < 500) {
            if (bodyText.trim().startsWith("<")) {
              errorText += ". Server returned HTML error page.";
            } else {
              errorText += `. Body: ${bodyText}`;
            }
          }
        } catch (e) {
          // I dont care
        }
        throw new Error(errorText);
      }

      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Error: Response received was not valid JSON.");
      }

      const data = await response.json();
      console.log("Search results:", data);

      const resultsArray = Array.isArray(data) ? data : data ? [data] : [];

      setResults(resultsArray);

      if (resultsArray.length === 0) {
        setError("No results found matching your criteria.");
      }
    } catch (err) {
      console.error("Search failed:", err);
      setError(
        err.message ||
          "Failed to fetch search results. Check network or console logs."
      );
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const handleViewDetails = (patient) => {
    setSelectedPatient(patient);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPatient(null);
  };

  return (
    <div className="p-6 flex flex-col space-y-6">
      <Card title="Find Patient Data">
        <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-center md:space-x-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={"Enter Name"}
            className="border p-2 rounded w-full md:flex-grow shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            aria-label="Search Query"
          />
          <button
            onClick={handleSearch}
            disabled={isLoading || !searchQuery.trim()}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out"
          >
            {isLoading ? "Searching..." : "Search"}
          </button>
        </div>
      </Card>
      <div>
        {isLoading && (
          <p className="text-center text-gray-600 mt-4">Loading results...</p>
        )}

        {error && (
          <p className="text-center text-red-600 mt-4 bg-red-100 p-3 rounded border border-red-300">
            {error}
          </p>
        )}
        {!isLoading && searchPerformed && !error && results.length > 0 && (
          <Card title="Search Results">
            <div className="space-y-2">
              {" "}
              {results.map((metric) => (
                <div
                  key={metric._id || metric.patientId}
                  className="p-3 border rounded-lg shadow-sm bg-white hover:bg-indigo-50 transition duration-150 ease-in-out cursor-pointer flex justify-between items-center" // Added flex layout
                  onClick={() => handleViewDetails(metric)}
                >
                  <div>
                    <h3 className="text-md font-semibold text-gray-800">
                      {`${metric.firstName || ""} ${
                        metric.lastName || ""
                      }`.trim() || "N/A"}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Patient ID:{" "}
                      <span className="font-medium text-gray-900 text-xs font-mono">
                        {metric.patientId || "N/A"}
                      </span>
                    </p>
                  </div>
                  <span className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                    View Details &rarr;
                  </span>
                </div>
              ))}
            </div>
          </Card>
        )}
        {!isLoading && !error && !searchPerformed && (
          <p className="text-center text-gray-500 mt-4">
            Enter a search term and select search type to begin.
          </p>
        )}
      </div>

      <PatientDetailsModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        patientData={selectedPatient}
      />
    </div>
  );
}
