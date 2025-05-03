"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/utils/api";

const Signup = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    isDoctor: false,
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setError("");
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axiosInstance.post(`/api/users/signup`, formData);

      console.log("Signup successful:", response.data);

      alert("Signup successful! Please log in with your new account.");
      router.push("/login");
    } catch (err) {
      console.error(
        "Error during signup:",
        err.response?.data || err.message || err
      );
      setError(
        err.response?.data?.message ||
          "An error occurred during signup. Please try again."
      );
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="flex w-full max-w-5xl items-center">
        <div className="flex-1 flex justify-end pr-10">
          <img
            src="/signup-image.jpg"
            alt="Doctor and patient"
            className="w-[100%] rounded-lg"
          />
        </div>
        <div className="flex-1 p-6 md:p-10">
          <h2 className="text-3xl md:text-4xl font-semibold text-gray-800 mb-6 text-center">
            Create Account
          </h2>
          {error && (
            <div
              className="mb-4 p-3 text-sm text-red-700 bg-red-100 rounded-lg border border-red-300"
              role="alert"
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="fullName"
              >
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                name="fullName"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={handleChange}
                required
                disabled={isSubmitting}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent disabled:opacity-50"
              />
            </div>
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="email"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={isSubmitting}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent disabled:opacity-50"
              />
            </div>
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="password"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                name="password"
                placeholder="Create a password (min. 6 characters)"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
                disabled={isSubmitting}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent disabled:opacity-50"
              />
            </div>
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="confirmPassword"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                minLength={6}
                disabled={isSubmitting}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent disabled:opacity-50"
              />
            </div>

            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="isDoctor"
                  name="isDoctor"
                  type="checkbox"
                  checked={formData.isDoctor}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="focus:ring-yellow-500 h-4 w-4 text-yellow-600 border-gray-300 rounded disabled:opacity-50"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="isDoctor" className="font-medium text-gray-700">
                  I am a doctor
                </label>
                <p className="text-gray-500 text-xs">
                  Check this box if you are registering as a healthcare
                  professional.
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#B47C3B] text-white py-2 px-4 rounded-lg font-semibold hover:bg-[#9B652A] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#B47C3B] transition-all disabled:opacity-50"
            >
              {isSubmitting ? "Creating Account..." : "Sign Up"}
            </button>
          </form>
          <div className="mt-6 text-center text-sm text-gray-600">
            <p>
              Already have an account?{" "}
              <button
                onClick={() => router.push("/login")}
                className="font-semibold text-[#B47C3B] hover:text-[#9B652A]"
                disabled={isSubmitting}
              >
                Log in
              </button>
            </p>
            <p className="mt-2">or</p>
            <button
              onClick={() => router.push("/diagnose")}
              className="font-semibold"
            >
              Continue as guest
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
