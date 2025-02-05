import React, { useContext, useState } from "react";
import { CartContext } from "@/context/CartContext";
import { useRouter } from "next/router";
import PriceConverter from "@/component/PriceConverter"; // Add this import

const Checkout: React.FC = () => {
  const cartContext = useContext(CartContext);
  const router = useRouter();

  if (!cartContext) {
    return <div className="text-red-500">Error: Cart context is not available</div>;
  }

  const { cart } = cartContext;

  // Calculate total price
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    transferMethod: "ATM Transaction",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePayment = () => {
    if (!formData.name || !formData.email || !formData.address) {
      alert("Please fill in all required fields.");
      return;
    }

    alert("Proceeding to Payment... (Mock Function)");
    console.log("Order Details:", { ...formData, cart, total });
    
    router.push("/order-confirmation"); // Redirect after payment (you can create this page later)
  };

  return (
    <div className="max-w-4xl mx-auto p-6 mb-24 mt-24 rounded-lg shadow-lg bg-white">
      <h1 className="text-3xl font-bold mb-8 text-center">Checkout</h1>

      {/* Cart Summary */}
      {cart.length === 0 ? (
        <p className="text-center text-gray-600">Your cart is empty.</p>
      ) : (
        <div>
          {cart.map((item) => (
            <div key={item.id} className="flex justify-between p-4 border-b">
              <span>{item.title} (x{item.quantity})</span>
              <div className="flex items-center gap-4">
                <span>${(item.price * item.quantity).toFixed(2)}</span>
                <PriceConverter usdAmount={item.price * item.quantity} />
              </div>
            </div>
          ))}
          <div className="text-right text-xl font-bold mt-4 flex justify-end items-center gap-4">
            Total: ${total.toFixed(2)}
            <PriceConverter usdAmount={total} />
          </div>
        </div>
      )}

      {/* Checkout Form */}
      <div className="mt-6">
        <h2 className="text-2xl font-semibold mb-4">Customer Information</h2>

        {/* Name */}
        <label className="block text-gray-700 mb-2">Full Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-2 border rounded mb-4"
          placeholder="Enter your full name"
          required
        />

        {/* Email */}
        <label className="block text-gray-700 mb-2">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-2 border rounded mb-4"
          placeholder="Enter your email"
          required
        />

        {/* Address */}
        <label className="block text-gray-700 mb-2">Shipping Address</label>
        <textarea
          name="address"
          value={formData.address}
          onChange={handleChange}
          className="w-full p-2 border rounded mb-4"
          placeholder="Enter your full address"
          required
        ></textarea>

        {/* Transfer Method (Fixed as ATM Transaction) */}
        <label className="block text-gray-700 mb-2">Payment Method</label>
        <input
          type="text"
          name="transferMethod"
          value="ATM Transaction"
          disabled
          className="w-full p-2 border rounded mb-4 bg-gray-200"
        />

        {/* Checkout Button */}
        <button
          onClick={handlePayment}
          className="border border-black font-bond w-full mt-6 mb-12 bg-olive-50 text-black py-3 rounded hover:bg-olive-500"
        >
          Proceed to Payment
        </button>
      </div>
    </div>
  );
};

export default Checkout;
