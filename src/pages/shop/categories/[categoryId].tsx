import { useRouter } from "next/router";
import { useEffect, useState, useCallback, useMemo } from "react";
import ProductCard from "@/component/ProductCard";
import CategoryFilter from "@/component/CategoryFilter";
import { Product, categoryMap } from "..";

const initialFilters = {
  searchQuery: "",
  priceRange: [0, 500] as [number, number],
};

const CategoryPage: React.FC = () => {
  const router = useRouter();
  const { categoryId, search } = router.query;

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [filters, setFilters] = useState(() => ({
    ...initialFilters,
    searchQuery: search ? String(search) : "",
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

        const productData: Product[] = await resProducts.json();
        const categoryData: { id: string; name: string }[] = await resCategories.json();

        const standardizedProducts = productData.map((product) => ({
          ...product,
          category: {
            id: product.category?.id || "5",
            name: categoryMap[product.category?.id || "5"],
          },
          images: Array.isArray(product.images) ? product.images : [],
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
      setFilters((prev) => ({ ...prev, ...updatedFilters }));
    },
    []
  );

  const displayedProducts = useMemo(() => {
    return products.filter((product) => {
      // Convert both IDs to strings and compare
      const productCategoryId = String(product.category?.id);
      const currentCategoryId = String(categoryId);
      
      const matchesCategory = !categoryId || productCategoryId === currentCategoryId;
      const matchesSearchQuery =
        !filters.searchQuery || product.title.toLowerCase().includes(filters.searchQuery.toLowerCase());
      const withinPriceRange =
        product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1];

      console.log('Product Category:', productCategoryId, 'Current Category:', currentCategoryId, 'Matches:', matchesCategory);

      return matchesCategory && matchesSearchQuery && withinPriceRange;
    });
  }, [products, filters, categoryId]);

  const categoryFilterProps = useMemo(() => ({
    filters: {
      categoryId: categoryId ? String(categoryId) : null,
      ...filters,
    },
    categories: processedCategories,
    onFilterChange: handleFilterChange,
  }), [categoryId, filters, processedCategories, handleFilterChange]);

  if (loading) return <p className="text-center text-gray-500">Loading products...</p>;

  return (
    <div className="flex flex-col lg:flex-row lg:space-x-4 p-4 mb-16 mt-16">
      {processedCategories.length > 0 && (
        <div className="lg:w-1/4 w-full space-y-6 mb-4 lg:mb-0">
          <CategoryFilter {...categoryFilterProps} />
        </div>
      )}

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

export default CategoryPage;
