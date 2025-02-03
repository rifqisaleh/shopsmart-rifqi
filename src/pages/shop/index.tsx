import React, { useState, useEffect } from "react";
import ProductCard from "@/component/ProductCard";
import CategoryFilter from "@/component/CategoryFilter";

export interface Product {
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

// Static category map
export const categoryMap: Record<string, string> = {
  "1": "Clothes",
  "2": "Electronics",
  "3": "Furniture",
  "4": "Shoes",
  "5": "Misc",
};
//Product List, Category, filter and search bar state
const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [filters, setFilters] = useState<{
    categoryId: string | null;
    searchQuery: string;
    priceRange: [number, number];
  }>({
    categoryId: null,
    searchQuery: "",
    priceRange: [0, 500],
  });

  //Fetching error handler
  const [error, setError] = useState<string | null>(null);

  // Normalize product images
  const normalizeImages = (images: string[] | string | null | undefined): string[] => {
    if (!images) return [];
    if (Array.isArray(images)) {
      return images.filter((url) => typeof url === "string" && url.startsWith("http"));
    }
    return [];
  };

  //Fetch and category standardization
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}categories`);
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();

        // Map category IDs to standardized names and combine Misc categories
        const standardizedCategories = data
          .map((category: { id: string; name: string }) => ({
            id: category.id,
            name: categoryMap[category.id] || "Misc",
          }))
          .reduce(
            (
              uniqueCategories: { id: string; name: string }[],
              category: { id: string; name: string }
            ) => {
              
              // Ensure only one "Misc" category exists
              if (category.name === "Misc") {
                if (!uniqueCategories.some((cat) => cat.name === "Misc")) {
                  uniqueCategories.push({ id: "5", name: "Misc" }); // Use "5" for the Misc category
                }
              } else {
                uniqueCategories.push(category);
              }
              return uniqueCategories;
            },
            [] as { id: string; name: string }[]
          );

            //Update state with standardized category
        setCategories(standardizedCategories);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Failed to load categories. Please try again later.");
      }
    };

    fetchCategories();
  }, []);


  //Fetch and process products based on active filters
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const baseUrl = `${process.env.NEXT_PUBLIC_API_URL}products`;
        const url = filters.categoryId
          ? `${baseUrl}/?categoryId=${filters.categoryId}`
          : baseUrl;

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

         // Normalize and process product data
        const data: Product[] = await response.json();
        const processedProducts = data.map((product) => ({
          ...product,
          category: {
            ...product.category,
            id: product.category?.id || "5",
            name: categoryMap[product.category?.id || "5"], // Standardize category names
          },
          images: normalizeImages(product.images), // Normalize images
        }));

        setProducts(processedProducts);
        setError(null);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products. Please try again later.");
      }
    };

    fetchProducts();
  }, [filters]);


// Filter products based on search query and price range
  const displayedProducts = products.filter((product) => {
    const matchesSearchQuery = product.title
      .toLowerCase()
      .includes(filters.searchQuery.toLowerCase());
    const withinPriceRange =
      product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1];

    return matchesSearchQuery && withinPriceRange;
  });

  return (
    <div className="flex flex-col lg:flex-row lg:space-x-4 p-4 mb-16 mt-16">
      {/* Filters Section */}
      <div className="lg:w-1/4 w-full space-y-6 mb-4 lg:mb-0">
        <CategoryFilter
          filters={filters} // Pass active filters
          categories={categories} // Pass category data
          onFilterChange={(updatedFilters) =>
            setFilters((prev) => ({ ...prev, ...updatedFilters })) // Update filters when changed
          }
        />
      </div>

      {/* Products Section */}
      <div className="lg:w-3/4 w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {error && <p className="text-red-500">{error}</p>} {/* Display error if present */}
        {displayedProducts.map((product) => (
          <ProductCard key={product.id} product={product} /> // Render each product card
        ))}
      </div>
    </div>
  );
};

export default ProductList;