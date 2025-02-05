import React, { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";
import { CartContext } from "@/context/CartContext";
import { FiShoppingCart, FiUser, FiSearch } from "react-icons/fi"; // Import icons

const Header: React.FC = () => {
  const { isAuthenticated, isLoading, fetchWithAuth } = useAuth();
  const router = useRouter();
  const cartContext = useContext(CartContext);
  const [userProfile, setUserProfile] = useState<{ name: string; email: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery)}`);
    }
    setIsSearchOpen(false); // Close the search bar after searching
  };

  return (
    <header className="w-full">
      {/* Top Bar - Shorter Height & Hidden on Mobile */}
      <div className="hidden sm:flex bg-olive-100 text-black p-1.5 text-sm justify-end items-center">
        <div className="space-x-6">
          <Link href="/aboutus" className="hover:underline">
            About Us
          </Link>
          <Link href="/shipping-policy" className="hover:underline">
            Shipping Policy
          </Link>
        </div>
      </div>

      {/* Bottom Navigation Bar */}
      <nav className="bg-olive-100 shadow-md p-4 flex justify-between items-center relative">
        {/* Left: Shop Name */}
        <div
          className="text-3xl font-bold text-urbanChic-700 cursor-pointer"
          onClick={() => router.push("/")}
        >
          ShopSmart
        </div>

      {/* Middle: Search Bar - Visible on Desktop, Icon on Mobile */}
        <div className="hidden sm:flex w-1/2">
          <form onSubmit={handleSearch} className="flex border border-black rounded-xl overflow-hidden w-full bg-white">
            <input
              type="text"
              className="w-full p-2 outline-none bg-transparent"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="px-4 bg-transparent border-none outline-none flex items-center justify-center">
              🔍
            </button>
          </form>
        </div>


        {/* Right: Cart, User & Search Icons */}
        <div className="flex items-center space-x-6">
          {/* Search Icon (Mobile Only) */}
          <button
            className="sm:hidden text-2xl"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
          >
            <FiSearch />
          </button>

          {/* Cart Icon */}
          <button onClick={() => (isAuthenticated ? router.push("/cart") : router.push("/login"))} className="relative">
            <FiShoppingCart className="text-2xl" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2 py-1">
                {cartCount}
              </span>
            )}
          </button>

          {/* User Icon */}
          <button onClick={() => (isAuthenticated ? router.push("/dashboard") : router.push("/login"))}>
            <FiUser className="text-2xl" />
          </button>
        </div>
      </nav>

      {isSearchOpen && (
        <div className="sm:hidden fixed left-0 right-0 bg-white shadow-md p-2 z-50" style={{ top: '64px' }}>
          <form onSubmit={handleSearch} className="flex border border-gray-400 rounded-md overflow-hidden w-full">
            <input
              type="text"
              className="w-full p-2 outline-none"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
            <button type="submit" className="bg-gray-700 text-white px-4">
              🔍
            </button>
          </form>
        </div>
      )}
    </header>
  );
};

export default Header;
