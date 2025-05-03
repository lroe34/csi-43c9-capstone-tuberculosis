"use client";

export default function SuccessToast({ message, show, onClose }) {
  if (!show) return null;

  return (
    <div className="fixed bottom-5 right-5 z-[100] p-4 rounded-md bg-green-100 border border-green-300 text-green-800 shadow-lg flex items-center justify-between">
      <span>{message}</span>
      <button
        onClick={onClose}
        className="ml-4 text-green-800 hover:text-green-900 text-xl leading-none"
        aria-label="Close notification"
      >
        &times;
      </button>
    </div>
  );
}
