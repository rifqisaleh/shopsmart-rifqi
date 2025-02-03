import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

// API URL from environment variables
const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/";

// Define interface for form data
interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
  dob: string;
}

// Define interface for form errors
interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  role?: string;
  dob?: string;
  general?: string;
}

export interface Role {
  role: string;
}

const Register: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    dob: "",
  });

  const [roles, setRoles] = useState<string[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [rolesLoading, setRolesLoading] = useState<boolean>(true);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [rolesError, setRolesError] = useState<string | null>(null);
  const router = useRouter();

  // Fetch roles dynamically
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await fetch(`${apiUrl}users`);
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Unexpected response format for roles.");
        }
        const rolesData: Role[] = await response.json();
        setRoles(rolesData.map((role: Role) => role.role));
      } catch (error) {
        console.error("Error fetching roles:", error);
        setRolesError("Failed to load roles. Default roles applied.");
        setRoles(["Customer", "Admin"]); // Default roles
      } finally {
        setRolesLoading(false);
      }
    };

    fetchRoles();
  }, []);

  // Handle input changes
  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Validate form inputs
  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Email must be a valid email address";
    }
    if (!formData.password) newErrors.password = "Password is required";
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (!formData.role) newErrors.role = "Role is required";
    if (!formData.dob) {
      newErrors.dob = "Date of Birth is required";
    } else {
      const age = Math.floor(
        (Date.now() - new Date(formData.dob).getTime()) / (365.25 * 24 * 60 * 60 * 1000)
      );
      if (age < 18) {
        newErrors.dob = "You must be at least 18 years old.";
      }
    }

    return newErrors;
  };

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrors({});
    setSuccessMessage(null);

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      if (!apiUrl) throw new Error("API URL is not defined");

      const response = await fetch(`${apiUrl}users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          avatar: "https://via.placeholder.com/150",
        }),
      });

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Unexpected response format. Please try again.");
      }

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to register. Please try again.");
      }

      setSuccessMessage("Registration successful!");
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "",
        dob: "",
      });

      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err) {
      console.error("Registration error:", err);
      setErrors({ general: err instanceof Error ? err.message : "An unexpected error occurred." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Register | ShopSmart</title>
        <meta name="description" content="Create a new account on ShopSmart." />
      </Head>
      <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-urbanChic-100 py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <h1 className="mt-6 text-3xl text-center text-black mb-16">Welcome To ShopSmart!</h1>
            <h2 className="mt-4 text-2xl text-center text-black mb-16">Create your account</h2>
            {errors.general && <p className="text-center text-red-600">{errors.general}</p>}
            {successMessage && <p className="text-center text-green-600">{successMessage}</p>}

            <form className="space-y-6" onSubmit={handleSubmit} noValidate>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}
              </div>
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-red-600">{errors.confirmPassword}</p>
                )}
              </div>
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                  Role
                </label>
                {rolesLoading ? (
                  <p className="text-sm text-gray-500">Loading roles...</p>
                ) : (
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="" disabled>
                      Select a role
                    </option>
                    {roles.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                )}
                {errors.role && <p className="text-sm text-red-600">{errors.role}</p>}
                {rolesError && <p className="text-sm text-red-600">{rolesError}</p>}
              </div>
              <div>
                <label htmlFor="dob" className="block text-sm font-medium text-gray-700">
                  Date of Birth
                </label>
                <input
                  id="dob"
                  name="dob"
                  type="date"
                  value={formData.dob}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                {errors.dob && <p className="text-sm text-red-600">{errors.dob}</p>}
              </div>
              <button
                type="submit"
                disabled={loading || rolesLoading}
                className={`w-full bg-urbanChic-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-urbanChic-900 focus:outline-none ${
                  loading || rolesLoading ? "bg-gray-400" : ""
                }`}
              >
                {loading ? "Submitting..." : rolesLoading ? "Loading Roles..." : "Register"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
