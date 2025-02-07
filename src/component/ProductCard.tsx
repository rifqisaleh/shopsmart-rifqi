import React, { useContext } from "react";
import { Product } from "@/pages/shop";
import Link from "next/link";
import { CartContext } from "@/context/CartContext";
import Image from "next/image";
import { parseImageUrl } from "@/utility/imagehelper";
import PriceConverter from './PriceConverter';

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const getFirstImage = (images: string[] | string | null): string => {
    const parsedImages = parseImageUrl(images ?? undefined);
    return parsedImages[0];
  };

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
    <div className="border border-black text-black rounded-xl p-3 shadow-lg bg-white flex flex-col items-center justify-center h-[350px]">
      {/* Link to Product Details */}
      <Link href={`/product/${product.id}`} className="block w-full h-48">
        <Image
          src={getFirstImage(product.images)}
          alt={product.title}
          width={200}
          height={200}
          className="w-full h-full object-contain rounded"
          priority={true} // Improve performance for critical images
        />
      </Link>
  
      {/* Product Title */}
      <Link href={`/product/${product.id}`} className="block text-center mt-2">
        <h2 className="text-sm font-semibold text-gray-800 hover:text-blue-500 transition line-clamp-2">
          {product.title}
        </h2>
      </Link>
  
      {/* Product Price */}
      <div className="flex flex-col items-center gap-1 mt-1">
        <p className="text-gray-600 text-sm">${product.price.toFixed(2)}</p>
        <PriceConverter usdAmount={product.price} />
      </div>
  
      {/* Buttons Container */}
      <div className="flex gap-2 mt-2">
        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          className="bg-greenSage text-white px-3 py-1.5 rounded text-sm font-medium hover:bg-olive-600 focus:outline-none"
        >
          Add to Cart
        </button>

        {/* View Details Button */}
        <Link href={`/product/${product.id}`}>
          <button className="bg-gray-600 text-white px-3 py-1.5 rounded text-sm font-medium hover:bg-gray-700 focus:outline-none">
            View Details
          </button>
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
