"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/authContext.js";
import axiosInstance from "../utils/api.js";

export default function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await axiosInstance.post(`/api/users/login`, {
        email,
        password,
      });

      console.log("Login successful:", response.data);

      const { user } = response.data;

      if (user) {
        login(user);

        if (user.isDoctor) {
          router.push("/home");
        } else {
          router.push("/diagnose");
        }
      } else {
        throw new Error("Login response missing token or user data.");
      }
    } catch (err) {
      console.error("Error during login", err.response?.data || err.message);
      setError(
        err.response?.data?.message ||
          "Login failed. Please check your credentials."
      );
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md w-full">
      <h1 className="text-4xl font-semibold text-gray-800 mb-6 text-center">
        Login
      </h1>
      {error && (
        <p className="w-full px-4 py-2 mb-2 border rounded-lg text-red-600 text-sm bg-red-100 border-red-300">
          {error}
        </p>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Please enter your email address"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isSubmitting}
        />
        <input
          type="password"
          placeholder="Please enter your password"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={isSubmitting}
        />
        <button
          type="submit"
          className={`w-full bg-yellow-600 text-white py-2 rounded-lg font-semibold hover:bg-yellow-700 transition-all ${
            isSubmitting ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Logging in..." : "Continue"}
        </button>
      </form>
      <div className="mt-4 text-center text-gray-600">
        <p>
          Don't have an account?{" "}
          <button
            onClick={() => !isSubmitting && router.push("/signup")}
            className="font-semibold disabled:opacity-50"
            disabled={isSubmitting}
          >
            Sign up
          </button>
        </p>
        <p className="mt-2">or</p>
        <button
          onClick={() => !isSubmitting && router.push("/diagnose")}
          className="font-semibold"
          disabled={isSubmitting}
        >
          Continue as guest
        </button>
      </div>
    </div>
  );
}
