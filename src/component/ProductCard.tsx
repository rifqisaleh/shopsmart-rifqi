import React, { useContext } from "react";
import { Product } from "@/pages/shop";
import Link from "next/link";
import { CartContext } from "@/context/CartContext";
import Image from "next/image";

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const imageUrl =
    product.images && product.images.length > 0
      ? product.images[0]
      : "/placeholder.png";

  // Access the CartContext and handle the case where it might be undefined
  const context = useContext(CartContext);

  if (!context) {
    console.warn("CartContext is not available.");
    return null; // Optionally return a fallback UI if the context is missing
  }

  const { addToCart } = context;

  const handleAddToCart = () => {
    addToCart(product);
  };

  return (
    <div className="border rounded-3xl p-4 shadow-lg bg-white flex flex-col items-center justify-center">
      {/* Link to Product Details */}
      <Link href={`/product/${product.id}`} className="block">
        <Image
          src={imageUrl}
          alt={product.title}
          width={200}
          height={200}
          className="object-cover mb-2 rounded"
          priority={true} // Improve performance for critical images
        />
      </Link>
  
      {/* Product Title */}
      <Link href={`/product/${product.id}`} className="block text-center">
        <h2 className="text-lg font-semibold text-gray-800 mb-2 hover:text-blue-500 transition">
          {product.title}
        </h2>
      </Link>
  
      {/* Product Price */}
      <p className="text-gray-600">${product.price.toFixed(2)}</p>
  
      {/* Add to Cart Button */}
      <button
        onClick={handleAddToCart}
        className="bg-urbanChic-500 text-white px-4 py-2 rounded mt-2 font-medium hover:bg-urbanChic-900 focus:outline-none"
      >
        Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;
