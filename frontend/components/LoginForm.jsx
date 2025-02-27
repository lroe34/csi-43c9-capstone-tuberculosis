"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import API_URL from "../utils/api.js";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${API_URL}/api/users/login`, {
        email,
        password,
      });

      console.log("Login successful:", response.data);
      router.push("/home");
    } catch (error) {
      console.error("Error during login", error.response?.data || error);
      alert(error.response?.data?.message || "An error occurred");
    }
  };

  return (
    <div className="max-w-md w-full">
      <h1 className="text-4xl font-semibold text-gray-800 mb-6 text-center">
        Login
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Please enter your email address"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Please enter your password"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          className="w-full bg-yellow-600 text-white py-2 rounded-lg font-semibold hover:bg-yellow-700 transition-all"
        >
          Continue
        </button>
      </form>
      <div className="mt-4 text-center text-gray-600">
        <p>
          Don't have an account?{" "}
          <button
            onClick={() => router.push("/signup")}
            className="font-semibold"
          >
            Sign up
          </button>
        </p>
        <p className="mt-2">or</p>
        <button onClick={() => router.push("/home")} className="font-semibold">
          Continue as guest
        </button>
      </div>
    </div>
  );
}
