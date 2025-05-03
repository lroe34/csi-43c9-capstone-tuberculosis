"use client";

export default function AccessDeniedMessage({ featureName }) {
  return (
    <div className="p-6 flex justify-center items-center">
      <div className="text-center p-8 bg-red-50 shadow-md rounded-lg border border-red-200">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
        <p className="text-gray-700">
          You do not have permission to use the {featureName}.
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Please contact an administrator if you believe this is an error.
        </p>
      </div>
    </div>
  );
}
