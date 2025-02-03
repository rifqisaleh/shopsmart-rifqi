import Link from "next/link";
import React from "react";

const Custom404: React.FC = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-6xl font-bold text-urbanChic-600 mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-8">Page Not Found</p>
      <Link href="/" className="text-urbanChic-500 underline hover:text-urbanChic-700">
          Go back to Homepage
        </Link>
    </div>
  );
};

export default Custom404;
