"use client";

import Card from "@/components/Card";

const mockPatients = [
  {
    id: 1,
    name: "John Doe",
    status: "Discharged",
  },
];

const mockScans = [
  {
    id: 1,
    patientName: "John Doe",
    result: "Negative",
    date: "August 10, 400",
  },
];

export default function Home() {
  return (
    <div className="p-6 flex flex-col space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Patient Status">
          <div className="space-y-4">
            {mockPatients.map((patient) => (
              <div key={patient.id} className="p-4 border rounded-lg shadow-sm">
                <h3 className="text-md font-medium text-gray-800">
                  {patient.name}
                </h3>
                <p className="text-sm text-gray-600">
                  Status:{" "}
                  <span className="font-semibold">{patient.status}</span>
                </p>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Recent Scans">
          <div className="space-y-4">
            {mockScans.map((scan) => (
              <div key={scan.id} className="p-4 border rounded-lg shadow-sm">
                <h3 className="text-md font-medium text-gray-800">
                  {scan.patientName}
                </h3>
                <p className="text-sm text-gray-600">
                  Scan Result:{" "}
                  <span className="font-semibold">{scan.result}</span>
                </p>
                <p className="text-sm text-gray-600">Date: {scan.date}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
