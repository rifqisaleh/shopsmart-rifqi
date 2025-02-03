import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import ProductCard from "@/component/ProductCard";
import CategoryFilter from "@/component/CategoryFilter";
import { Product, categoryMap } from ".."; 

const CategoryPage: React.FC = () => {
  const router = useRouter();
  const { categoryId } = router.query; 

  //storing products
  const [products, setProducts] = useState<Product[]>([]);
  
  //storing available categories
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  
  //filters
  const [filters, setFilters] = useState({
    searchQuery: "",
    priceRange: [0, 500] as [number, number], 
  });

  // State for handling errors
  const [error, setError] = useState<string | null>(null);

  //fetch products when categories change
  useEffect(() => {
    if (!categoryId) return; 

    const fetchCategoryData = async () => {
      try {
        // Fetch products(category ID)
        const resProducts = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}products/?categoryId=${String(categoryId)}`
        );
        if (!resProducts.ok) throw new Error("Failed to fetch products");

        // Fetch all categories
        const resCategories = await fetch(`${process.env.NEXT_PUBLIC_API_URL}categories`);
        if (!resCategories.ok) throw new Error("Failed to fetch categories");

        // Parse responses as JSON
        const productData: Product[] = await resProducts.json();
        const categoryData: { id: string; name: string }[] = await resCategories.json();

        // Standardize products to ensure valid category and images
        const standardizedProducts = productData.map((product) => ({
          ...product,
          category: {
            id: product.category?.id || "5", // category id (if missing)
            name: categoryMap[product.category?.id || "5"], 
          },
          images: Array.isArray(product.images) ? product.images : [], // Ensure images is always an array
        }));

        // Standardize categories to ensure valid names
        const standardizedCategories = categoryData.map((category) => ({
          id: category.id,
          name: categoryMap[category.id] || "Misc", // Assign default category name if missing
        }));

        // Update state with fetched and standardized data
        setProducts(standardizedProducts);
        setCategories(standardizedCategories);
        setError(null); 
      } catch (err) {
        console.error(err);
        setError("Failed to load products or categories."); 
      }
    };

    fetchCategoryData(); // Execute the fetch function
  }, [categoryId]); // Dependency array ensures this runs when categoryId changes

  // Filter products based on search query and price range
  const displayedProducts = products.filter((product) => {
    const matchesSearchQuery = product.title
      .toLowerCase()
      .includes(filters.searchQuery.toLowerCase()); // Match product title with search input

    const withinPriceRange =
      product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1]; // Check if price is within range

    return matchesSearchQuery && withinPriceRange; // Only include products that match both conditions
  });

  return (
    <div className="flex flex-col lg:flex-row lg:space-x-4 p-4 mb-16 mt-16">
     <div className="lg:w-1/4 w-full space-y-6 mb-4 lg:mb-0">
        <CategoryFilter
          filters={{
            categoryId: categoryId ? String(categoryId) : null, 
            ...filters,
          }}
          categories={categories} 
          onFilterChange={(updatedFilters) =>
            setFilters((prev) => ({ ...prev, ...updatedFilters })) 
          }
        />
      </div>

      {/* Products grid */}
      <div className="lg:w-3/4 w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {error && <p className="text-red-500">{error}</p>} 
        
        {/* Render filtered products */}
        {displayedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default CategoryPage;
