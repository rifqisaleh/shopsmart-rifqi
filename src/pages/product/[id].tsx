import React from "react";
import Image from "next/image";
import { GetStaticPaths, GetStaticProps } from "next";
import { useContext } from "react";
import { CartContext } from "@/context/CartContext";
import Link from "next/link";
import { useRouter } from "next/router";
import { getSafeImage, parseImageUrl } from "@/utility/imagehelper";

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  images: string[];
  category: {
    id: string;
    name: string;
  };
}

// Fake review data mapped to product IDs
const productReviews: Record<number, { rating: number }[]> = {
  1: [{ rating: 5 }, { rating: 4 }, { rating: 3 }],
  2: [{ rating: 2 }, { rating: 3 }, { rating: 2 }],
  3: [{ rating: 4 }, { rating: 5 }, { rating: 5 }],
};

interface ProductDetailProps {
  product?: Product;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product }) => {
  const cartContext = useContext(CartContext);
  const router = useRouter(); // Initialize router
  const [relatedProducts, setRelatedProducts] = React.useState<Product[]>([]);

  if (!product) return <p>Product not found!</p>;

  // Fake reviews for the product
  const fakeReviews = product?.id ? productReviews[product.id] || [{ rating: 4.5 }] : [];

  // Calculate average rating
  const averageRating =
    fakeReviews.length > 0
      ? fakeReviews.reduce((sum, review) => sum + review.rating, 0) / fakeReviews.length
      : 0;

  const roundedRating = Math.max(1, Math.round(averageRating));

  const handleAddToCart = () => {
    if (cartContext) {
      cartContext.addToCart({
        id: product.id,
        title: product.title,
        price: product.price,
        images: product.images,
      });
    }
  };

  const handleBuyNow = () => {
    if (cartContext && product) {
      cartContext.addToCart({
        id: product.id,
        title: product.title,
        price: product.price,
        images: product.images,
      });
      router.push("/cart"); // Redirect to cart page
    }
  };

  // Fetch related products
  React.useEffect(() => {
    if (!product) return;

    const fetchRelatedProducts = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}products/?categoryId=${product.category.id}`);
        if (!res.ok) throw new Error("Failed to fetch related products");

        const products: Product[] = await res.json();
        const filteredProducts = products.filter((p) => p.id !== product.id);
        setRelatedProducts(filteredProducts.slice(0, 4));
      } catch (error) {
        console.error("Error fetching related products:", error);
      }
    };

    fetchRelatedProducts();
  }, [product]);

  return (
    <div className="p-4 mt-32 mb-56">
      <div className="flex flex-col md:flex-row items-center md:items-start max-w-7xl mx-auto gap-60 justify-between">
        
        {/* Image */}
       
        <div className="w-full md:w-1/2">
          <Image
            src={(parseImageUrl(product.images)[0])}
            alt={product.title}
            width={500}
            height={500}
            className="rounded-lg mx-auto md:mx-0"
            onError={(e) => { e.currentTarget.src = "/placeholder.png"; }}
          />
        </div>

        <div className="w-full md:w-1/2">
          <h1 className="text-4xl text-urbanChic-600">{product.title}</h1>

          <div className="mt-2 mb-4 flex items-center space-x-2">
            {averageRating > 0 ? (
              <>
                <span className="text-yellow-500 text-xl inline-block mt-2 mb-2">
                  {"⭐".repeat(roundedRating)}
                </span>
                <span className="text-gray-700 text-sm">({fakeReviews.length} reviews)</span>
              </>
            ) : (
              <span className="text-gray-400 text-sm">No reviews yet</span>
            )}
          </div>

          {/* Product Category */}
          {product.category?.name && (
            <div className="mt-4 mb-6 flex justify-start">
              <span className="bg-gray-300 text-black text-sm font-medium px-3 py-1 rounded-full">
                {product.category.name}
              </span>
            </div>
          )}

          <h1 className="text-3xl text-urbanChic-600 mb-4">PRODUCT DETAILS</h1>
          <p className="text-gray-600 mb-8 text-2xl">{product.description}</p>

          <p className="text-2xl font-semibold mb-6">
            {product.price ? `$${product.price.toFixed(2)}` : "Price unavailable"}
          </p>

          {/* Buttons: Add to Cart & Buy Now */}
          <div className="flex space-x-4">
            <button
              className="flex-1 border border-black text-black px-6 py-3 rounded-md w-xl font-medium hover:bg-olive-50 transition focus:outline-none"
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>

            <button
              className="flex-1 bg-olive-700 text-white px-6 py-3 w-xl rounded-md font-medium hover:bg-olive-800 transition focus:outline-none"
              onClick={handleBuyNow}
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>

      {/* "You May Also Like" Section */}
      <div className="mt-32 mb-1">
        <h2 className="text-4xl text-center font-semibold mb-6">You May Also Like</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {relatedProducts.length > 0 ? (
            relatedProducts.map((related) => (
              <Link key={related.id} href={`/product/${related.id}`} className="block">
                <div className="rounded-lg p-4 hover:shadow-lg transition">
                  <Image
                    src={parseImageUrl(related.images)[0]}
                    alt={related.title}
                    width={400}
                    height={400}
                    className="rounded-md"
                    onError={(e) => { e.currentTarget.src = "/placeholder.png"; }}
                  />
                  <h3 className="text-lg font-medium mt-2 text-center">{related.title}</h3>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-gray-500">No related products found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;


export const getStaticPaths: GetStaticPaths = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}products`);
  const products: Product[] = await res.json();

  const paths = products.map((product) => ({
    params: { id: product.id.toString() },
  }));

  return { paths, fallback: false }; // Changed from `true` to `false` unless you handle loading states
};

export const getStaticProps: GetStaticProps = async (context) => {
  const { id } = context.params!;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}products/${id}`);
    if (!res.ok) {
      return { notFound: true };
    }

    const product: Product = await res.json();

    return {
      props: {
        product,
      },
    };
  } catch (error) {
    console.error("Error fetching product:", error);
    return { notFound: true };
  }
};
