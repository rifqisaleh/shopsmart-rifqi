import React from "react";
import Link from "next/link";

const AboutUs = () => {
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
      {/* Content Container */}
      <div className="container mx-auto p-6 bg-urbanChic-100 bg-opacity-90 rounded-lg shadow-lg max-w-4xl">
        <h1 className="text-3xl font-bold mb-4 text-center">About Us</h1>
        <p className="mb-4">
          Welcome to <strong>ShopSmart</strong>, your go-to online store for a seamless shopping experience. We believe in making online shopping smarter, easier, and more enjoyable for everyone. Whether you're looking for the latest products, exclusive deals, or a hassle-free checkout process, ShopSmart is here to provide it all.
        </p>

        <h2 className="text-2xl font-semibold mt-6">Our Mission</h2>
        <p className="mb-4">
          At ShopSmart, our mission is to revolutionize online shopping by offering a user-friendly platform that helps customers discover, compare, and purchase products effortlessly. We aim to bridge the gap between quality and affordability, ensuring that everyone can shop with confidence.
        </p>

        <h2 className="text-2xl font-semibold mt-6">Why Choose ShopSmart?</h2>
        <ul className="list-disc ml-6 mb-4">
          <li>Wide Range of Products: Explore an extensive collection of products across various categories to find exactly what you need.</li>
          <li>Smart Filtering & Search: Our intuitive filtering system helps you find the perfect item quickly and efficiently.</li>
          <li>Seamless Shopping Cart: Add items to your cart effortlessly and enjoy a smooth checkout process.</li>
          <li>User-Friendly Experience: Designed with simplicity in mind, our platform ensures that both tech-savvy and first-time users can shop with ease.</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-6">Our Commitment to Customers</h2>
        <p className="mb-4">
          We prioritize customer satisfaction by ensuring a secure, reliable, and enjoyable shopping experience. Our team continuously works to improve ShopSmart, keeping up with the latest trends and technologies to serve you better.
        </p>

        <h2 className="text-2xl font-semibold mt-6">Get in Touch</h2>
        <p className="mb-4">
          We love hearing from our customers! If you have any questions, feedback, or suggestions, feel free to reach out to us. Your input helps us grow and improve ShopSmart to serve you better.
        </p>

        <h2 className="text-2xl font-semibold mt-6">Contact Us</h2>
        <p>Email: <a href="mailto:support@shopsmart.com" className="text-blue-600">support@shopsmart.com</a></p>
        <p>Phone: +62 380 7654 321</p>
        <p>Website: <a href="http://www.shopsmart.com" className="text-blue-600">www.shopsmart.com</a></p>
        <p>Address: Jl. El Tari No.10, Kupang, Nusa Tenggara Timur, Indonesia</p>
      </div>
    </div>
  );
};

export default AboutUs;
