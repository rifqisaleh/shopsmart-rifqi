import React from 'react';
import ProductCard from "./ProductCard";
import CategoryFilter from "./CategoryFilter";
import { Product } from "@/pages/shop";

interface ProductLayoutProps {
  loading?: boolean;
  error?: string | null;
  products: Product[];
  categories: { id: string; name: string }[];
  filters: {
    categoryId: string | null;
    searchQuery: string;
    priceRange: [number, number];
    sortBy: "name" | "price" | "recent";
    sortOrder: "asc" | "desc";
  };
  onFilterChange: (filters: Partial<{
    categoryId: string | null;
    searchQuery: string;
    priceRange: [number, number];
    sortBy: "name" | "price" | "recent";
    sortOrder: "asc" | "desc";
  }>) => void;
  layoutStyle?: 'shop' | 'landing';
}

const ProductLayout: React.FC<ProductLayoutProps> = ({
  loading,
  error,
  products,
  categories,
  filters,
  onFilterChange,
  layoutStyle = 'shop'
}) => {
  if (loading) return <p className="text-center text-gray-500">Loading products...</p>;

  return (
    <div className="mx-auto max-w-7xl px-4 mb-16 mt-16">
      <div className={`flex ${layoutStyle === 'shop' ? 'flex-col lg:flex-row lg:space-x-8' : ''}`}>
        {layoutStyle === 'shop' && categories.length > 0 && (
          <div className="lg:w-1/5 w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3 mb-2 lg:mb-0 lg:self-start">
            <CategoryFilter
              filters={filters}
              categories={categories}
              onFilterChange={onFilterChange}
            />
          </div>
        )}

        <div className={layoutStyle === 'shop' 
          ? "lg:w-4/5 w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
          : "w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3"
        }>
          {error && <p className="text-red-500">{error}</p>}
          {products.length > 0 ? (
            products.map((product) => <ProductCard key={product.id} product={product} />)
          ) : (
            <p className="text-gray-500">No products found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductLayout;
