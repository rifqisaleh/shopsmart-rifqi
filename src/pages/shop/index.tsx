import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
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

const ProductList: React.FC = () => {
  const router = useRouter();
  const { search } = router.query; // Get search query from URL

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [filters, setFilters] = useState<{
    categoryId: string | null;
    searchQuery: string;
    priceRange: [number, number];
  }>({
    categoryId: null,
    searchQuery: search ? String(search) : "",
    priceRange: [0, 500],
  });

  const [error, setError] = useState<string | null>(null);

  // Normalize product images
  const normalizeImages = (images: string[] | string | null | undefined): string[] => {
    if (!images) return [];
    if (Array.isArray(images)) {
      return images.filter((url) => typeof url === "string" && url.startsWith("http"));
    }
    return [];
  };

  // Fetch and standardize categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}categories`);
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();

        // Map category IDs to standardized names
        const standardizedCategories = data.map((category: { id: string; name: string }) => ({
          id: category.id,
          name: categoryMap[category.id] || "Misc",
        }));

        setCategories(standardizedCategories);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Failed to load categories. Please try again later.");
      }
    };

    fetchCategories();
  }, []);

  // Fetch products based on filters
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let url = `${process.env.NEXT_PUBLIC_API_URL}products`;
        if (filters.categoryId) {
          url += `/?categoryId=${filters.categoryId}`;
        }

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const data: Product[] = await response.json();
        const processedProducts = data.map((product) => ({
          ...product,
          category: {
            id: product.category?.id || "5",
            name: categoryMap[product.category?.id || "5"],
          },
          images: normalizeImages(product.images),
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

  // Update search query from URL dynamically
  useEffect(() => {
    if (!search) {
      setFilters((prev) => ({
        ...prev,
        searchQuery: "",
      }));
      return;
    }
  
    setFilters((prev) => ({
      ...prev,
      searchQuery: String(search),
    }));
  }, [search]);
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
          filters={filters}
          categories={categories}
          onFilterChange={(updatedFilters) =>
            setFilters((prev) => ({ ...prev, ...updatedFilters }))
          }
        />
      </div>

      {/* Products Section */}
      <div className="lg:w-3/4 w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {error && <p className="text-red-500">{error}</p>}
        {displayedProducts.length > 0 ? (
          displayedProducts.map((product) => <ProductCard key={product.id} product={product} />)
        ) : (
          <p className="text-gray-500">No products found.</p>
        )}
      </div>
    </div>
  );
};

export default ProductList;
