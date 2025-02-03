import React, { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";
import { CartContext } from "@/context/CartContext";

const Header: React.FC = () => {
  console.log("Rendering Header...");
  const { isAuthenticated, isLoading, fetchWithAuth } = useAuth();
  const router = useRouter();
  const cartContext = useContext(CartContext);
  const [userProfile, setUserProfile] = useState<{ name: string; email: string } | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuToggle = () => setIsMenuOpen(!isMenuOpen);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!isAuthenticated) return;

      try {
        const response = await fetchWithAuth("auth/profile");
        const data = await response.json();
        setUserProfile(data);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, [isAuthenticated, fetchWithAuth]);

  if (isLoading) return null;
  if (!cartContext) return null;

  const { cartCount } = cartContext;

  const handleCartClick = () => {
    if (isAuthenticated) {
      router.push("/cart");
    } else {
      router.push("/login");
    }
  };

  const handleDashboardClick = () => {
    router.push("/dashboard");
  };

  const handleLoginClick = () => {
    router.push("/login");
  };

  return (
    <header className="bg-urbanChic-100 p-4 flex items-center justify-between">
      {/* Left Section: Hamburger Menu */}
      <div className="flex items-center">
        <button className="sm:hidden block text-black" onClick={handleMenuToggle}>
          <span className="hamburger-icon text-2xl">☰</span>
        </button>

        <nav
          className={`${
            isMenuOpen ? "block" : "hidden"
          } absolute top-16 left-0 w-full bg-urbanChic-100 p-4 sm:static sm:flex sm:items-center sm:space-x-4 sm:w-auto`}
        >
          <ul className="space-y-4 sm:space-y-0 sm:flex sm:space-x-4">
            <li>
              <Link href="/" className="text-gray-700 hover:text-gray-900 transition duration-200">
              HOME
              </Link>
            </li>
            <li>
              <Link href="/shop" className="text-gray-700 hover:text-gray-900 transition duration-200">
               SHOP
              </Link>
            </li>
            <li>
              <button
                onClick={handleCartClick}
                className="text-gray-700 hover:text-gray-900 transition duration-200"
              >
                CART
                {cartCount > 0 && (
                  <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-1">
                    {cartCount}
                  </span>
                )}
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Center Section: Logo */}
      <div className="text-3xl">
        <Link href="/" className="mb-4 text-black">
          ShopSmart
        </Link>
      </div>

      {/* Right Section: Authentication and Greeting */}
      <div className="flex items-center space-x-4">
        {isAuthenticated ? (
          <>
            <span className="hidden sm:block text-black">
              Welcome, <strong>{userProfile?.name || "User"}</strong>
            </span>
            <button
              onClick={handleDashboardClick}
              className="text-gray-700 hover:text-gray-900 transition duration-200"
            >
              DASHBOARD
            </button>
          </>
        ) : (
          <button
            onClick={handleLoginClick}
            className="text-gray-700 hover:text-gray-900 transition duration-200"
          >
            LOGIN
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
