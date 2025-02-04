import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import { useRouter } from "next/router";
import { categoryMap } from "./shop";
import Head from "next/head";

interface Product {
  id: number;
  title: string;
  price: number;
  images: string[] | string | null;
  description?: string;
  category: {
    id: string;
    name: string;
  };
}

interface Category {
  id: number;
  name: string;
  image: string;
}

const LandingPage: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [productsResponse, categoriesResponse] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}products`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}categories`),
        ]);

        if (!productsResponse.ok || !categoriesResponse.ok) {
          throw new Error(
            `API error: ${productsResponse.statusText} / ${categoriesResponse.statusText}`
          );
        }

        const [productsData, categoriesData] = await Promise.all([
          productsResponse.json(),
          categoriesResponse.json(),
        ]);

        const products = Array.isArray(productsData) ? productsData : [];
        const uniqueFeaturedProducts = new Map();

        products.forEach((product) => {
          if (!uniqueFeaturedProducts.has(product.category?.id)) {
            uniqueFeaturedProducts.set(product.category?.id, product);
          }
        });

        setFeaturedProducts(Array.from(uniqueFeaturedProducts.values()));

        const categories = Array.isArray(categoriesData) ? categoriesData : [];
        const allowedCategoryIds = Object.keys(categoryMap);
        const filteredCategories = categories.filter((category) =>
          allowedCategoryIds.includes(category.id.toString())
        );

        setCategories(filteredCategories);
      } catch (err: any) {
        setError("Failed to load data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const getFirstImage = (images: string[] | string | null): string => {
    if (Array.isArray(images) && images.length > 0) return images[0];
    if (typeof images === "string" && images.startsWith("http")) return images;
    return "/fallback-image.jpg";
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3, // Show more images
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 640, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <>
      <Head>
        <title>ShopSmart - Discover Amazing Products</title>
        <meta
          name="description"
          content="Find amazing products across various categories on ShopSmart."
        />
      </Head>

      <div className="flex flex-col items-center">
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <>
            {/* Hero Section with Large Background */}
            <div
              className="w-full min-h-screen flex items-center px-6 py-16 mt-0"
              style={{
                backgroundImage: `url('/background.jpg')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                height: "100vh", // Ensures full viewport height
                width: "100vw", // Ensures full viewport width
                margin: "0",
                padding: "0",
              }}
            >
              <div className="w-full max-w-7xl flex flex-col items-start justify-center text-white text-left p-10 bg-black/40 rounded-lg">
                <h1 className="text-6xl md:text-7xl font-bold drop-shadow-lg">
                  Welcome to ShopSmart!
                </h1>
                <p className="text-xl mt-4 max-w-2xl drop-shadow-md">
                  Discover an incredible selection of amazing products spanning a wide variety of
                  categories, carefully curated to meet your every need and desire.
                </p>
                <button
                  onClick={() => router.push("/shop")}
                  className="mt-6 bg-white text-gray-900 font-semibold text-lg px-6 py-3 rounded shadow-lg hover:bg-gray-200 transition"
                >
                  Shop Now
                </button>
              </div>
            </div>

            {/* Featured Products Section */}
            <div className="w-full max-w-7xl mt-16 mb-16">
              <h2 className="text-5xl text-urbanChic-600 mb-16 text-center">
                Featured Products
              </h2>
              <Slider {...settings}>
                {featuredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="p-4 cursor-pointer"
                    onClick={() => router.push(`/product/${product.id}`)}
                  >
                    <img
                      src={getFirstImage(product.images)}
                      alt={product.title}
                      className="w-full h-auto max-h-80 object-cover rounded mb-2 hover:opacity-90 transition-opacity"
                    />
                    <h2 className="text-xl font-semibold text-center">{product.title}</h2>
                  </div>
                ))}
              </Slider>
            </div>

            {/* Shop by Category Section */}
            <div className="w-full max-w-7xl mt-16 mb-16">
              <h2 className="text-5xl text-urbanChic-600 mb-16 text-center">
                Shop by Category
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className="flex flex-col items-center cursor-pointer"
                    onClick={() => router.push(`/shop?category=${category.id}`)}
                  >
                    <img
                      src={category.image || "/placeholder.png"}
                      alt={category.name}
                      className="w-48 h-48 sm:w-64 sm:h-64 object-cover hover:scale-105 transition-transform"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.png";
                      }}
                    />
                    <span className="mt-2 text-sm text-gray-600 font-medium">
                      {category.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default LandingPage;
