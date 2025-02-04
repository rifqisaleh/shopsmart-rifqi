import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import ProductCard from "@/component/ProductCard";
import CategoryFilter from "@/component/CategoryFilter";
import { Product, categoryMap } from "..";

const CategoryPage: React.FC = () => {
  const router = useRouter();
  const { categoryId, search } = router.query; // Get search from URL

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [filters, setFilters] = useState({
    searchQuery: search ? String(search) : "", // Initialize with search from URL
    priceRange: [0, 500] as [number, number],
  });

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!categoryId) return;

    const fetchCategoryData = async () => {
      try {
        const resProducts = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}products/?categoryId=${String(categoryId)}`
        );
        if (!resProducts.ok) throw new Error("Failed to fetch products");

        const resCategories = await fetch(`${process.env.NEXT_PUBLIC_API_URL}categories`);
        if (!resCategories.ok) throw new Error("Failed to fetch categories");

        const productData: Product[] = await resProducts.json();
        const categoryData: { id: string; name: string }[] = await resCategories.json();

        // Standardize products to ensure valid category and images
        const standardizedProducts = productData.map((product) => ({
          ...product,
          category: {
            id: product.category?.id || "5",
            name: categoryMap[product.category?.id || "5"],
          },
          images: Array.isArray(product.images) ? product.images : [],
        }));

        // Standardize categories & prevent duplicate Misc category
        const standardizedCategories = categoryData
          .map((category) => ({
            id: category.id,
            name: categoryMap[category.id] || "Misc",
          }))
          .reduce((uniqueCategories, category) => {
            if (category.name === "Misc") {
              if (!uniqueCategories.some((cat) => cat.name === "Misc")) {
                uniqueCategories.push({ id: "5", name: "Misc" });
              }
            } else {
              uniqueCategories.push(category);
            }
            return uniqueCategories;
          }, [] as { id: string; name: string }[]);

        setProducts(standardizedProducts);
        setCategories(standardizedCategories);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Failed to load products or categories.");
      }
    };

    fetchCategoryData();
  }, [categoryId]);

  // Update filters when URL search parameter changes
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
  

  // Apply filtering
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

export default CategoryPage;
