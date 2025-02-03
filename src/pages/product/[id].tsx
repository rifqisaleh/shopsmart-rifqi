import React from "react";
import Image from "next/image";
import { GetStaticPaths, GetStaticProps } from "next";
import { useContext } from "react";
import { CartContext } from "@/context/CartContext";
import Link from "next/link";
import { useRouter } from "next/router";

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

// Add this helper function at the top level
const parseImageUrl = (images: string[] | string | undefined): string[] => {
  if (!images) return ["/placeholder.png"];
  
  try {
    // Case 1: If it's a string, try to parse it if it looks like JSON
    if (typeof images === 'string') {
      if (images.startsWith('[')) {
        try {
          const parsed = JSON.parse(images);
          return Array.isArray(parsed) ? parsed.filter(url => url && typeof url === 'string') : ["/placeholder.png"];
        } catch {
          // If JSON parsing fails, try to extract URLs using regex
          const urls = images.match(/https?:\/\/[^"\s,\]]+/g);
          return urls || ["/placeholder.png"];
        }
      }
      return [images];
    }

    // Case 2: If it's an array, process each element
    if (Array.isArray(images)) {
      const processedUrls = images
        .map(img => {
          if (typeof img === 'string') {
            // Handle stringified JSON array
            if (img.startsWith('[')) {
              try {
                const parsed = JSON.parse(img);
                return Array.isArray(parsed) ? parsed[0] : img;
              } catch {
                // Extract URL using regex if JSON parsing fails
                const match = img.match(/https?:\/\/[^"\s,\]]+/);
                return match ? match[0] : null;
              }
            }
            // Clean up regular string URL
            return img.replace(/[\[\]"]/g, '').trim();
          }
          return null;
        })
        .filter((url): url is string => !!url && url.startsWith('http'));

      return processedUrls.length > 0 ? processedUrls : ["/placeholder.png"];
    }

    return ["/placeholder.png"];
  } catch (error) {
    console.error("Error parsing image URL:", error);
    return ["/placeholder.png"];
  }
};

const ProductDetail: React.FC<ProductDetailProps> = ({ product }) => {
  const cartContext = useContext(CartContext);
  const router = useRouter(); // Initialize router

  if (!product) return <p>Product not found!</p>;

  // Related products state
  const [relatedProducts, setRelatedProducts] = React.useState<Product[]>([]);

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
            src={parseImageUrl(product.images)[0]}
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
                <span className="bg-gray-100 p-2 rounded-lg shadow-sm text-yellow-500 text-xl inline-block">
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
              <span className="bg-gray-200 text-gray-700 text-sm font-medium px-3 py-1 rounded-full">
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
              className="flex-1 border border-black text-black px-6 py-3 rounded-md w-xl font-medium hover:bg-gray-100 transition focus:outline-none"
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>

            <button
              className="flex-1 bg-black text-white px-6 py-3 w-xl rounded-md font-medium hover:bg-gray-800 transition focus:outline-none"
              onClick={handleBuyNow}
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>

      {/* "You May Also Like" Section */}
      <div className="mt-96 mb-1">
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
