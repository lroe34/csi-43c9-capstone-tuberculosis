"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const Signup = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: handle signup logic
    console.log("Form submitted:", formData);
    router.push("/home");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F6F2]">
      <div className="bg-white shadow-lg rounded-lg flex max-w-4xl w-full p-6">
        <div className="hidden md:flex flex-1 justify-center items-center">
          <img
            src="/signup-image.jpg"
            alt="Doctor and patient"
            className="w-[80%] rounded-lg"
          />
        </div>
        <div className="flex-1 px-8">
          <h2 className="text-3xl font-semibold text-gray-800 mb-6">Sign Up</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-600">Full Name</label>
              <input
                type="text"
                name="fullName"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>
            <div>
              <label className="block text-gray-600">Email</label>
              <input
                type="email"
                name="email"
                placeholder="Please enter your email address"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>
            <div>
              <label className="block text-gray-600">Password</label>
              <input
                type="password"
                name="password"
                placeholder="Please enter your password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>
            <div>
              <label className="block text-gray-600">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Passwords Must Match"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#B47C3B] text-white py-2 rounded-lg font-semibold hover:bg-[#9B652A] transition-all"
            >
              Continue
            </button>
          </form>
          <div className="mt-4 text-center text-gray-600">
            <p>
              Already a user?{" "}
              <button
                onClick={() => router.push("/login")}
                className="text-black font-semibold"
              >
                Log in
              </button>
            </p>
            <p className="mt-2">or</p>
            <button
              onClick={() => router.push("/home")}
              // TODO: do something here for different guest home
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
