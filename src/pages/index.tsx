import React, { useState } from "react";
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

const mockFeaturedProducts = [
  {
    id: 1,
    title: "Grey Hoodies Limited Edition",
    description: "Handcrafted from genuine leather, this classic hoodie features a timeless design perfect for any occasion.",
    price: 109.99,
    images: ["https://i.imgur.com/R2PN9Wq.jpeg"], // Replace with actual image URL or local path
    category: { id: "1", name: "Clothes" }
  },
  {
    id: 2,
    title: "2 Stainless Toaster",
    description: "Enjoy perfect toast every time with adjustable browning, wide slots, and a high-lift lever. Easy to clean with a removable crumb tray and compact design.",
    price: 199.99,
    images: ["https://i.imgur.com/4CqHqnd.png"], // Replace with actual image URL or local path
    category: { id: "2", name: "Electronics" }
  },
  {
  id: 3,
  title: "Sophisticated Chair",
  description: "Designed for all-day comfort with lumbar support, breathable fabric, and adjustable height. Perfect for home or office use.",
  price: 549.99,
  images: ["https://i.imgur.com/g0K8Fge.jpeg"], // Replace with actual image URL or local path
  category: { id: "4", name: "Shoes" }
},
  {
    id: 4,
    title: "Black Shoes",
    description: "Elegant black shoes with simple velcro.",
    price: 349.99,
    images: ["https://i.imgur.com/EVqcx8p.png"], // Replace with actual image URL or local path
    category: { id: "4", name: "Shoes" }
  }
];

const LandingPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const staticCategories = [
    {
      id: "1",
      name: "Clothes",
      image: "/categories/clothes.jpg"
    },
    {
      id: "2",
      name: "Electronics",
      image: "/categories/electronics.jpg"
    },
    {
      id: "3",
      name: "Furnitures",
      image: "/categories/furnitures.jpg"
    },
    {
      id: "4",
      name: "Shoes",
      image: "/categories/shoes.jpg"
    },
    {
      id: "5",
      name: "Misc",
      image: "/categories/misc.jpg"
    }
  ];

  const getFirstImage = (images: string[] | string | null): string => {
    try {
      const parsedImages = parseImageUrl(images ?? undefined);
      return parsedImages[0] || '/placeholder.png'; // Add fallback image
    } catch (error) {
      console.error('Error parsing image:', error);
      return '/placeholder.png';
    }
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      }
    ]
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
                  <h1 className="text-5xl text-urbanChic-700 md:text-9xl drop-shadow-lg mb-4 md:mb-8">
                  Welcome to ShopSmart!
                </h1>
                <p className="text-xl md:text-3xl text-gray-600 mt-4 md:mt-8 max-w-full md:max-w-2xl drop-shadow-md">
                  Discover an incredible selection of amazing products spanning a wide variety of categories, carefully curated to meet your every need and desire.
                </p>
                <button
                  onClick={() => router.push("/shop")}
                  className="border-2 border-black mt-8 md:mt-12 bg-white text-black font-semibold text-xl md:text-2xl px-8 md:px-12 py-4 md:py-6 rounded-lg shadow-lg hover:bg-olive-300 transition-all transform hover:scale-105"
                >
                  Shop Now
                </button>
              </div>
            </div>

           
    {/* Featured Products Section */}
      <div className="w-full max-w-7xl mt-1 md:mt-12 mb-10">
        <h2 className="text-4xl text-urbanChic-700 mb-4 mt-4 text-center md:text-6xl">
          FEATURED PRODUCTS
        </h2>
        <p className="text-xl text-gray-600 text-center mb-10">
          Check out our featured product – handpicked just for you!
        </p>

        <Slider {...settings}>
        {mockFeaturedProducts.map((product) => (
          <div key={product.id} className="p-4 flex justify-center">
            <div
              className="flex flex-col bg-white opacity-95 md:flex-row items-center shadow-lg rounded-3xl overflow-hidden cursor-pointer hover:shadow-xl transition md:gap-12 md:max-w-[1200px] w-full md:p-12"
              onClick={() => router.push(`/product/${product.id}`)}
            >
              {/* Product Image (Always on the Left) */}
              <div className="w-full md:w-[350px] flex justify-center">
                <img
                  src={getFirstImage(product.images)}
                  alt={product.title}
                  className="w-[350px] h-[350px] md:w-[400px] md:h-[400px] object-cover rounded-lg"
                />
              </div>

              {/* Product Info (Always on the Right) */}
              <div className="w-full md:w-1/2 flex-grow p-8 mt-6 mb-6 md:p-12 text-center md:text-left">
                <h2 className="text-3xl font-semibold text-gray-900">{product.title}</h2>
                <p className="text-lg text-gray-600 mt-4 leading-relaxed">
                  {product.description || "Explore our latest high-quality products tailored just for you."}
                </p>
                <p className="text-xl font-bold text-urbanChic-600 mt-6">${product.price.toFixed(2)}</p>
              </div>
            </div>
          </div>
        ))}
      </Slider>


      </div>


            {/* Shop by Category Section */}
            <div className="w-full max-w-7xl mt-16 mb-32">
              <h2 className="text-4xl text-urbanChic-700 mb-4 mt-10 text-center md:text-6xl">
                SHOP BY CATEGORY
              </h2>
              <p className="text-xl text-gray-600 text-center mb-10">
          Check out our featured product – handpicked just for you!
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {staticCategories.map((category) => (
                  <div
                    key={category.id}
                    className="flex flex-col items-center cursor-pointer"
                    onClick={() => {
                      console.log('Navigating to category:', category.id);
                      router.push(`/shop/categories/${category.id}`);
                    }}
                  >
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-48 h-48 sm:w-64 sm:h-64 object-cover hover:scale-105 transition-transform"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.png";
                      }}
                    />
                    <span className="mt-2 text-sm text-black font-md text-xl">
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