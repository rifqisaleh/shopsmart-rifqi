import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext"; // Adjust path as needed
import Head from "next/head";
import { GetServerSideProps } from "next";
import { parseCookies } from 'nookies';
import { useRouter } from "next/router";

interface UserProfile {
  id: number;
  name: string;
  email: string;
  avatar?: string; // Optional if not always returned
  role: string;
}

interface DashboardProps {
  profile: UserProfile | null; // Updated to allow null for better error handling
}

const Dashboard: React.FC<DashboardProps> = ({ profile }) => {
  const { logout } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false); // Loading state

  useEffect(() => {
    if (!profile) {
      console.log("No profile received in props. Redirecting to login...");
      router.push("/login");
    } else {
      console.log("Profile loaded:", profile);
    }
  }, [profile, router]);

  const handleLogout = () => {
    console.log("Logging out...");
    logout();
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    window.location.href = "/login";
  };

  const handleDeleteAccount = async () => {
    setIsLoading(true);
    try {
      console.debug("Initiating account deletion process...");

      const confirmDelete = window.confirm("Are you sure you want to delete your account?");
      if (!confirmDelete) {
        console.debug("Account deletion cancelled by the user.");
        return;
      }

      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];

      if (!token) {
        console.error("Token not found in cookies.");
        throw new Error("Authorization token is missing. Please log in again.");
      }
      console.debug("Authorization token retrieved:", token);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}auth/profile`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.debug("DELETE request sent to:", `${process.env.NEXT_PUBLIC_API_URL}auth/profile`);
      console.debug("Response status:", response.status);
      console.debug("Response headers:", response.headers);

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Failed to delete account. Response data:", errorData);
        throw new Error(errorData.message || "Failed to delete the account.");
      }

      console.log("Account deleted successfully.");
      alert("Your account has been deleted. You will be logged out.");
      handleLogout();
    } catch (err) {
      console.error("Error during account deletion:", err);
      alert(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading or redirecting...</p>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Dashboard | ShopSmart</title>
        <meta name="description" content="Welcome to your dashboard at ShopSmart." />
      </Head>
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-urbanChic-50 shadow-lg rounded-lg p-8 w-full max-w-md">
          <h1 className="text-3xl text-center text-urbanChic-600">
            Welcome, {profile.name}!
          </h1>
          {profile.avatar && (
            <img
              src={profile.avatar}
              alt="User Avatar"
              className="w-24 h-24 rounded-full mx-auto mt-6"
            />
          )}
          <p className="text-center mt-4">Email: {profile.email}</p>
          <p className="text-center">Role: {profile.role}</p>
          <div className="mt-6 space-y-4">
            {isLoading ? (
              <button className="w-full bg-gray-500 text-white px-4 py-2 rounded-lg font-medium" disabled>
                Loading...
              </button>
            ) : (
              <>
                <button
                  onClick={handleLogout}
                  className="w-full bg-urbanChic-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-urbanChic-900"
                >
                  Log Out
                </button>
                <button
                  onClick={handleDeleteAccount}
                  className="w-full bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600"
                >
                  Delete Account
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const cookies = parseCookies(ctx);
  const token = cookies.token;

  if (!token) {
    console.log("No token found. Redirecting to login...");
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}auth/profile`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("API Error:", errorData);
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }

    const profile = await response.json();
    console.log("Fetched profile data:", profile);

    return {
      props: { profile }, // Pass the profile to the Dashboard page as props
    };
  } catch (error) {
    console.error("Error fetching profile:", error);
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
};

export default Dashboard;
