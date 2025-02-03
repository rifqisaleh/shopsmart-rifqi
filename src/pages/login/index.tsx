import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";
import Head from "next/head";
import Link from "next/link";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message || "Invalid credentials.");
      }

      const data = await response.json();

      // Set token in cookies
      document.cookie = `token=${data.access_token}; path=/;`;
      console.log("Token set in cookie:", data.access_token);

      // Call login function
      login(data.access_token, data.refresh_token);
      console.log("Login function called with:", data.access_token, data.refresh_token);

      // Redirect to dashboard
      console.log("Redirecting to Dashboard...");
      await router.push("/dashboard");
      console.log("After redirect");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
        console.log("Error set to:", err.message); // Debugging line
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Debugging state changes
  useEffect(() => {
    console.log("Error state:", error);
    console.log("Loading state:", loading);
  }, [error, loading]);

  return (
    <>
      <Head>
        <title>Login | ShopSmart</title>
        <meta name="description" content="Login to your ShopSmart account." />
      </Head>
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-urbanChic-100 shadow-lg rounded-xl p-8 w-full max-w-md">
          <h2 className="mt-6 text-3xl text-center text-black">Welcome Back!</h2>
          <p className="text-sm text-gray-600 text-center mt-2">Login to your account</p>

          {error && <p role="alert" className="text-red-500 text-center mt-2">{error}</p>}

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full px-4 py-2 rounded-lg font-medium focus:outline-none ${
                loading
                  ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                  : "bg-urbanChic-500 text-white hover:bg-urbanChic-900"
              }`}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-4">
            Don't have an account?{" "}
            <Link href="/register" className="text-blue-500 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
