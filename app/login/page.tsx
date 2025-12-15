"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading: authLoading } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, authLoading, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!email.trim()) {
      setError("Please enter your email");
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError("Please enter a valid email address");
      return;
    }

    if (!password) {
      setError("Please enter your password");
      return;
    }

    setIsLoading(true);

    try {
      const result = await login(email.trim(), password);

      if (result.success) {
        router.push("/dashboard");
      } else {
        setError(result.error || "Login failed. Please check your credentials.");
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading while checking auth status
  if (authLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#1a2a2a]">
        <Loader2 className="w-8 h-8 text-teal-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center bg-[#1a2a2a]">
      {/* Background Image */}
      <Image
        src="/bg.png"
        alt="Office Background"
        fill
        className="object-cover"
        priority
      />

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-8 flex flex-col lg:flex-row items-center justify-center lg:justify-between gap-8 lg:gap-4 py-8">
        {/* Left Side - Welcome Text */}
        <div className="text-white max-w-lg text-center lg:text-left">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-medium leading-tight">
            Welcome to the
            <br />
            Crowd Management System
          </h1>
        </div>

        {/* Right Side - Login Form */}
        <div className="bg-white rounded-lg shadow-2xl overflow-hidden w-full max-w-[374px]">
          {/* Teal Header with Logo - height: 110px */}
          <div
            className="h-[110px] flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #1a4a4a 0%, #0d3535 50%, #0a2828 100%)",
            }}
          >
            <Image
              src="/kloudspot.png"
              alt="Kloudspot"
              width={126}
              height={70}
              className="brightness-0 invert"
            />
          </div>

          {/* Form */}
          <div className="px-5 sm:px-8 py-6 sm:py-8">
            <form onSubmit={handleLogin}>
              {/* Error Message */}
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {/* Email Field - Outlined style with floating label */}
              <div className="relative mb-5">
                <div className={`relative border rounded-md px-3 pt-5 pb-2 transition-colors ${
                  error && !email ? "border-red-300" : "border-gray-300"
                }`}>
                  <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs text-gray-700">
                    Log In <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError("");
                    }}
                    placeholder="test@test.com"
                    className="w-full bg-transparent text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none"
                    disabled={isLoading}
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Password Field - Outlined style with floating label */}
              <div className="relative mb-6">
                <div className={`relative border rounded-md px-3 pt-5 pb-2 transition-colors ${
                  error && !password ? "border-red-300" : "border-gray-300"
                }`}>
                  <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs text-gray-700">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setError("");
                      }}
                      placeholder="**********"
                      className="flex-1 bg-transparent text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none"
                      disabled={isLoading}
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-400 hover:text-gray-600 ml-2"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 disabled:cursor-not-allowed text-white py-3.5 rounded-md text-base font-medium transition-colors flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
