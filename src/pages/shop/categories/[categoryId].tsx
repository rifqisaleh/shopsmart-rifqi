import { useRouter } from "next/router";
import { useEffect, useState, useCallback, useMemo } from "react";
import { Product, categoryMap } from "..";
import ProductLayout from "@/component/ProductLayout";

const initialFilters = {
  searchQuery: "",
  priceRange: [0, 500] as [number, number],
  sortBy: "name" as "name" | "price" | "recent",
  sortOrder: "asc" as "asc" | "desc"
};

const CategoryPage: React.FC = () => {
  const router = useRouter();
  const { categoryId, search } = router.query;

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [filters, setFilters] = useState(() => ({
    ...initialFilters,
    searchQuery: search ? String(search) : "",
    categoryId: categoryId ? String(categoryId) : null,
  }));

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!router.isReady) return;

    const fetchCategoryData = async () => {
      setLoading(true);
      try {
        const resProducts = await fetch(`${process.env.NEXT_PUBLIC_API_URL}products`);
        if (!resProducts.ok) throw new Error("Failed to fetch products");

        const resCategories = await fetch(`${process.env.NEXT_PUBLIC_API_URL}categories`);
        if (!resCategories.ok) throw new Error("Failed to fetch categories");

        const productData = await resProducts.json();
        const categoryData: { id: string; name: string }[] = await resCategories.json();

        const standardizedProducts: Product[] = productData.map((product: any) => ({
          ...product,
          id: Number(product.id), // Convert id to number
          category: {
            id: product.category?.id || "5",
            name: categoryMap[product.category?.id || "5"],
          },
          images: Array.isArray(product.images) ? product.images : [],
          createdAt: product.createdAt || new Date().toISOString()
        }));

        setProducts(standardizedProducts);
        setCategories(categoryData);
        setError(null);
      } catch (err) {
        console.error("Error Fetching Data:", err);
        setError("Failed to load products or categories.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryData();
  }, [router.isReady]);

  const processedCategories = useMemo(() => {
    if (!categories?.length) return [];
    
    return categories.reduce((acc, category) => {
      const categoryName = categoryMap[category.id] || "Misc";
      if (categoryName === "Misc" && acc.some(cat => cat.name === "Misc")) {
        return acc;
      }
      return [...acc, { id: category.id, name: categoryName }];
    }, [] as { id: string; name: string }[]);
  }, [categories]);

  const handleFilterChange = useCallback(
    (updatedFilters: Partial<typeof filters>) => {
      console.log('Updating filters:', updatedFilters); // Add this for debugging
      setFilters((prev) => ({ ...prev, ...updatedFilters }));
    },
    []
  );

  const displayedProducts = useMemo(() => {
    let filtered = products.filter((product) => {
      const productCategoryId = String(product.category?.id);
      const currentCategoryId = String(categoryId);
      
      const matchesCategory = !categoryId || productCategoryId === currentCategoryId;
      const matchesSearchQuery =
        !filters.searchQuery || product.title.toLowerCase().includes(filters.searchQuery.toLowerCase());
      const withinPriceRange =
        product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1];

      return matchesCategory && withinPriceRange && matchesSearchQuery;
    });

    // Sort products
    filtered.sort((a, b) => {
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

    return filtered;
  }, [products, filters, categoryId]);

  const categoryFilterProps = useMemo(() => ({
    filters: filters,  // Pass the entire filters object
    categories: processedCategories,
    onFilterChange: handleFilterChange,
  }), [filters, processedCategories, handleFilterChange]);

  return (
    <ProductLayout
      loading={loading}
      products={displayedProducts}
      categories={processedCategories}
      filters={categoryFilterProps.filters}
      onFilterChange={handleFilterChange}
      error={error}
    />
  );
};

export default CategoryPage;
