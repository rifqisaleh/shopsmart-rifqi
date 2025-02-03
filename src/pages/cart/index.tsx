import React, { useContext, useEffect } from "react";
import { useRouter } from "next/router";
import { CartContext } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext"; // Adjust path as needed

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
    <div className="max-w-4xl mx-auto p-6 mb-24 mt-24 rounded-lg shadow-lg bg-urbanChic-100">
      <h1 className="text-4xl text-urbanChic-600 mb-16 text-center">Shopping Cart</h1>
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
                <p className="text-gray-600">${item.price.toFixed(2)}</p>
              </div>

              {/* Quantity Input */}
              <input
                type="number"
                className="w-9 border rounded-md mr-16 text-center"
                min="1"
                value={item.quantity}
                onChange={(e) =>
                  handleQuantityChange(item.id, parseInt(e.target.value, 10))
                }
              />

              {/* Remove Button */}
              <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                onClick={() => handleRemoveItem(item.id)}
              >
                Remove
              </button>
            </div>
          ))}
          {/* Display the total */}
          <div className="text-right text-xl font-bold">
            Total: ${total.toFixed(2)}
          </div>
        </div>
      )}
    </div>
  );
};

export default ShoppingCart;

