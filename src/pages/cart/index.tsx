import React, { useContext, useEffect } from "react";
import { useRouter } from "next/router";
import { CartContext } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext"; // Adjust path as needed
import PriceConverter from "@/component/PriceConverter"; // Add this import
import { FaTrash } from 'react-icons/fa'; // Add this import

const ShoppingCart: React.FC = () => {
  const { isAuthenticated } = useAuth(); // Access authentication state
  const cartContext = useContext(CartContext);
  const router = useRouter(); // Use Next.js's router for navigation

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login"); // Redirect to login if the user is not authenticated
    }
  }, [isAuthenticated, router]);

  if (!cartContext) {
    return <div className="text-red-500">Error: Cart context is not available</div>;
  }

  const { cart, updateCart } = cartContext;

  const handleQuantityChange = (id: number, quantity: number) => {
    updateCart(id, quantity);
  };

  const handleRemoveItem = (id: number) => {
    updateCart(id, 0); // Setting quantity to 0 will remove the item
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div
      style={{
        backgroundImage: "url('/background.jpg')", // Ensure your image is in the public folder
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
        width: "100vw",
        margin: "0",
        padding: "0",
        backgroundAttachment: "scroll", // Keeps background static when scrolling
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div className="max-w-4xl mx-auto p-6 mb-24 mt-32 rounded-lg shadow-lg bg-white bg-opacity-90">
        <h1 className="text-4xl text-urbanChic-600 mt-12 mb-12 text-center">Shopping Cart</h1>
        {cart.length === 0 ? (
          <p className="text-center text-gray-600 mb-16 mt-16">Your cart is empty.</p>
        ) : (
          <div className="space-y-4">
            {cart.map((item, index) => (
              <div
                key={item.id}
                className="flex items-center justify-between bg-white p-4 rounded-lg shadow"
              >
                {/* Item Number */}
                <span className="text-lg font-bold">{index + 1}.</span>
  
                {/* Product Image */}
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-16 h-16 rounded object-cover ml-10 mr-10"
                  onError={(e) => {
                    e.currentTarget.src = "https://via.placeholder.com/150"; // Fallback image
                  }}
                />
  
                {/* Product Details */}
                <div className="flex-1">
                  <p className="text-lg font-semibold">{item.title}</p>
                  <div className="flex items-center gap-2">
                    <p className="text-gray-600">${item.price.toFixed(2)}</p>
                    <PriceConverter usdAmount={item.price} />
                  </div>
                </div>
  
                {/* Quantity Input */}
                <input
                  type="number"
                  className="w-9 border rounded-md ml-16 mr-16 text-center"
                  min="1"
                  value={item.quantity}
                  onChange={(e) =>
                    handleQuantityChange(item.id, parseInt(e.target.value, 10))
                  }
                />
  
                {/* Remove Button - Replace the existing button with this */}
                <button
                  className="p-2 text-red-500 hover:text-red-700 transition-colors"
                  onClick={() => handleRemoveItem(item.id)}
                  title="Remove item"
                >
                  <FaTrash size={20} />
                </button>
              </div>
            ))}
            {/* Display the total */}
            <div className="text-right text-xl font-bold flex justify-end items-center gap-4">
              Total: ${total.toFixed(2)}
              <PriceConverter usdAmount={total} />
            </div>
  
            {/* Checkout Button */}
            {cart.length > 0 && (
              <div className="text-center mt-6">
                <button
                  onClick={() => router.push("/checkout")}
                  className="bg-olive-300 text-black px-6 py-3 rounded-md mb-12 hover:bg-olive-500"
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
  
};

export default ShoppingCart;

