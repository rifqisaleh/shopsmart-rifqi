import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import ProductCard from "@/component/ProductCard";
import CategoryFilter from "@/component/CategoryFilter";
import ProductLayout from "@/component/ProductLayout";

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
  createdAt: string; // Add this field for sorting by recent
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
  const { search, category, minPrice, maxPrice, sortBy, sortOrder} = router.query; // Get search query from URL

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [filters, setFilters] = useState<{
    categoryId: string | null;
    searchQuery: string;
    priceRange: [number, number];
    sortBy: "name" | "price" | "recent";
    sortOrder: "asc" | "desc";
  }>({
    categoryId: category ? String(category) : null,
    searchQuery: search ? String(search) : "",
    priceRange: [
      minPrice ? Number(minPrice) : 0,
      maxPrice ? Number(maxPrice) : 500
    ],
    sortBy: (sortBy as "name" | "price" | "recent") || "name",
    sortOrder: (sortOrder as "asc" | "desc") || "asc",
  });

  const [error, setError] = useState<string | null>(null);

   // Sync URL with filters
   useEffect(() => {
    const query = {
      ...(filters.searchQuery && { search: filters.searchQuery }),
      ...(filters.categoryId && { category: filters.categoryId }),
      ...(filters.priceRange[0] > 0 && { minPrice: filters.priceRange[0] }),
      ...(filters.priceRange[1] < 500 && { maxPrice: filters.priceRange[1] }),
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder,
    };

    router.push({
      pathname: '/shop',
      query,
    }, undefined, { shallow: true });
  }, [filters]);

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
  const displayedProducts = products
    .filter((product) => {
      const matchesSearchQuery = product.title
        .toLowerCase()
        .includes(filters.searchQuery.toLowerCase());
      const withinPriceRange =
        product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1];

      return matchesSearchQuery && withinPriceRange;
    })
    .sort((a, b) => {
      switch (filters.sortBy) {
        case "name":
          return filters.sortOrder === "asc" 
            ? a.title.localeCompare(b.title)
            : b.title.localeCompare(a.title);
        case "price":
          return filters.sortOrder === "asc" 
            ? a.price - b.price
            : b.price - a.price;
        case "recent":
          return filters.sortOrder === "asc"
            ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return 0;
      }
    });

  return (
    <ProductLayout
      products={displayedProducts}
      categories={categories}
      filters={filters}
      onFilterChange={(updatedFilters) =>
        setFilters((prev) => ({ ...prev, ...updatedFilters }))
      }
      error={error}
    />
  );
};

export default ProductList;