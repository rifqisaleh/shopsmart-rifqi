import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import { useRouter } from "next/router";
import { categoryMap } from "./shop";
import Head from "next/head";
import { parseImageUrl } from "@/utility/imagehelper";

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
  
        // Extract category ID from query params
        const { category } = router.query;
  
        // If a category is selected, filter products by that category
        let filteredProducts = products;
        if (category) {
          filteredProducts = products.filter(
            (product) => product.category?.id.toString() === String(category)
          );
        }
        
  
        const uniqueFeaturedProducts = new Map();
        filteredProducts.forEach((product) => {
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
  }, [router.query.category]); // Depend on the category query param
  

  const getFirstImage = (images: string[] | string | null): string => {
    const parsedImages = parseImageUrl(images ?? undefined);
    return parsedImages[0];
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1, // Show more images
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
                className="w-full min-h-screen flex items-start px-6 py-16 mt-0 bg-no-repeat bg-center md:bg-cover bg-contain"
                style={{
                  backgroundImage: "url('/background.jpg')",
                  minHeight: "100vh", // Keeps background stable
                  width: "100vw",
                  margin: "0",
                  padding: "0",
                  backgroundAttachment: "scroll", 
                }}
              >
                <div className="w-full max-w-7xl flex flex-col items-center md:items-start justify-center text-urbanChic-600 text-center md:text-left p-6 md:p-10 pt-24 md:pt-32">
                  <h1 className="text-4xl text-urbanChic-700 md:text-9xl drop-shadow-lg mb-4 md:mb-8">
                  Welcome to ShopSmart!
                </h1>
                <p className="text-lg md:text-3xl text-gray-600 mt-4 md:mt-8 max-w-full md:max-w-2xl drop-shadow-md">
                  Discover an incredible selection of amazing products spanning a wide variety of categories, carefully curated to meet your every need and desire.
                </p>
                <button
                  onClick={() => router.push("/shop")}
                  className="border border-black mt-8 md:mt-12 bg-white text-gray-900 font-semibold text-lg px-4 md:px-6 py-2 md:py-3 rounded shadow-lg hover:bg-gray-200 transition"
                >
                  Shop Now
                </button>
              </div>
            </div>

           
              {/* Featured Products Section */}
      <div className="w-full max-w-7xl mt-2 md:mt-24 mb-10">
        <h2 className="text-4xl text-urbanChic-700 mb-4 mt-12 text-center md:text-6xl">
          FEATURED PRODUCTS
        </h2>
        <p className="text-lg text-gray-600 text-center mb-10">
          Check out our featured product – handpicked just for you!
        </p>

        <Slider {...settings} slidesToShow={1}>
        {featuredProducts.map((product) => (
          <div key={product.id} className="p-4 flex justify-center">
            <div
              className="flex flex-col bg-olive-50 md:flex-row items-center bg-white shadow-lg rounded-3xl overflow-hidden cursor-pointer hover:shadow-xl transition md:gap-12 md:max-w-[1500px] w-full md:p-16"
              onClick={() => router.push(`/product/${product.id}`)}
            >
              {/* Product Image (Always on the Left) */}
              <div className="w-full md:w-[450px] flex justify-center">
                <img
                  src={getFirstImage(product.images)}
                  alt={product.title}
                  className="w-[450px] h-[450px] md:w-[500px] h-[500px] object-cover rounded-lg"
                />
              </div>

              {/* Product Info (Always on the Right) */}
              <div className="w-full md:w-1/2 flex-grow p-8 mt-6 mb-6 md:p-12 text-center md:text-left">
                <h2 className="text-3xl font-semibold text-gray-900">{product.title}</h2>
                <p className="text-lg text-gray-600 mt-4 leading-relaxed">
                  {product.description
                    ? product.description.substring(0, 150) + "..."
                    : "Explore our latest high-quality products tailored just for you."}
                </p>
                <p className="text-xl font-bold text-urbanChic-600 mt-6">${product.price.toFixed(2)}</p>
              </div>
            </div>
          </div>
        ))}
      </Slider>


      </div>


            {/* Shop by Category Section */}
            <div className="w-full max-w-7xl mt-16 mb-16">
              <h2 className="text-4xl text-urbanChic-700 mt-24 mb-24 text-center md:text-6xl">
                SHOP BY CATEGORY
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className="flex flex-col items-center cursor-pointer"
                    onClick={() => {
                      console.log('Navigating to category:', category.id);
                      router.push(`/shop/categories/${category.id}`);
                    }}
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