import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext"; // Adjust path as needed
import Head from "next/head";
import { GetServerSideProps } from "next";
import { parseCookies, destroyCookie } from "nookies";
import { useRouter } from "next/router";
import { WishlistItem, getWishlist, removeFromWishlist } from "@/utility/wishlistHelper";

interface UserProfile {
  id: number;
  name: string;
  email: string;
  avatar?: string; // Optional if not always returned
  role: string;
  dob?: string; // Add DOB property
}

interface DashboardProps {
  profile: UserProfile | null; // Updated to allow null for better error handling
}

const Dashboard: React.FC<DashboardProps> = ({ profile }) => {
  const { logout } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);

  useEffect(() => {
    if (profile === null) {
      router.replace("/login");
    }
  }, [profile, router]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setWishlist(getWishlist());
    }
  }, []);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      console.log("Logging out...");
      logout();
      document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
      window.location.href = "/login";
    }
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

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}auth/profile`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const contentType = response.headers.get("Content-Type");
        let errorMessage = "Failed to delete the account.";

        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        }

        console.error("Failed to delete account:", errorMessage);
        throw new Error(errorMessage);
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

  const handleRemoveFromWishlist = (id: number) => {
    const newWishlist = removeFromWishlist(id);
    setWishlist(newWishlist);
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
      <div className="flex items-center justify-center min-h-screen"
        style={{
          backgroundImage: "url('/background.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          minHeight: "100vh",
          width: "100vw",
          margin: "0",
          padding: "0",
          backgroundAttachment: "scroll",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div className="bg-urbanChic-50 shadow-lg rounded-lg p-8 w-full max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* User Info Section */}
            <div className="space-y-4">
              <h1 className="text-3xl text-center text-urbanChic-600">
                Welcome, {profile.name}!
              </h1>
              {profile.avatar && (
                <img
                  src={profile.avatar}
                  alt="User Avatar"
                  className="w-32 h-32 rounded-full mx-auto mt-6"
                />
              )}
              <div className="space-y-2 text-center">
                <p className="mt-4">Email: {profile.email}</p>
                <p>Role: {profile.role}</p>
                <p>Date of Birth: {profile.dob || 'Not provided'}</p>
              </div>
              
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

            {/* Wishlist Section */}
            <div className="border-t md:border-t-0 md:border-l pt-6 md:pl-8">
              <h2 className="text-2xl text-center text-urbanChic-600 mb-4">My Wishlist</h2>
              {wishlist.length === 0 ? (
                <p className="text-center text-gray-500">Your wishlist is empty</p>
              ) : (
                <div className="space-y-3 max-h-[500px] overflow-y-auto">
                  {wishlist.map((item) => (
                    <div key={item.id} className="flex justify-between items-center p-3 bg-white rounded-lg shadow">
                      <div className="flex items-center">
                        <img src={item.image} alt={item.title} className="w-12 h-12 object-cover rounded mr-3" />
                        <div>
                          <p className="font-medium">{item.title}</p>
                          <p className="text-sm text-gray-600">${item.price}</p>
                        </div>
                      </div>
                      <button
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleRemoveFromWishlist(item.id)}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
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
    destroyCookie(ctx, "token");
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
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }

    const profile = await response.json();
    return { props: { profile } };
  } catch (error) {
    return { redirect: { destination: "/login", permanent: false } };
  }
};

export default Dashboard;
