"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center bg-[#1a2a2a]">
      {/* Background Image */}
      <img
        src="/bg.png"
        alt="Office Background"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-8 flex items-center justify-between">
        {/* Left Side - Welcome Text */}
        <div className="text-white max-w-lg">
          <h1 className="text-4xl font-medium leading-tight">
            Welcome to the
            <br />
            Crowd Management System
          </h1>
        </div>

        {/* Right Side - Login Form */}
        <div className="bg-white rounded-lg shadow-2xl overflow-hidden w-[374px]">
          {/* Teal Header with Logo - height: 110px */}
          <div
            className="h-[110px] flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #1a4a4a 0%, #0d3535 50%, #0a2828 100%)",
            }}
          >
            <img
              src="/kloudspot.png"
              alt="Kloudspot"
              className="brightness-0 invert"
              style={{ width: "126px", height: "70px" }}
            />
          </div>

          {/* Form */}
          <div className="px-8 py-8">
            <form onSubmit={handleLogin}>
              {/* Login Field - Outlined style with floating label */}
              <div className="relative mb-5">
                <div className="relative border border-gray-300 rounded-md px-3 pt-5 pb-2">
                  <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs text-gray-700">
                    Log In <span>*</span>
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Parking_solutions"
                    className="w-full bg-transparent text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Password Field - Outlined style with floating label */}
              <div className="relative mb-8">
                <div className="relative border border-gray-300 rounded-md px-3 pt-5 pb-2">
                  <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs text-gray-700">
                    Password <span>*</span>
                  </label>
                  <div className="flex items-center">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="**********"
                      className="flex-1 bg-transparent text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-400 hover:text-gray-600 ml-2"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-teal-600 hover:bg-teal-600 text-white py-3.5 rounded-md text-base font-medium transition-colors"
              >
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
