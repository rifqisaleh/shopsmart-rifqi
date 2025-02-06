import React, { useMemo, useCallback } from "react";

interface Category {
  id: string;
  name: string;
}

interface CategoryFilterProps {
  filters: {
    categoryId: string | null;
    searchQuery: string;
    priceRange: [number, number];
    sortBy: "name" | "price" | "recent";
    sortOrder: "asc" | "desc";
  };
  categories: Category[];
  onFilterChange: (updatedFilters: Partial<CategoryFilterProps["filters"]>) => void;
}

const getButtonStyleClass = (isSelected: boolean) => 
  `border border-black px-4 py-2 rounded-md font-medium transition-all duration-200 text-sm ${
    isSelected ? "bg-greenSage text-white shadow-md" : "bg-urbanChic-100 text-black hover:bg-olive-300"
  }`;

const CategoryFilter: React.FC<CategoryFilterProps> = React.memo(({ filters, categories, onFilterChange }) => {
  const handleClick = useCallback((categoryId: string | null) => {
    onFilterChange({ categoryId });
  }, [onFilterChange]);

  const handlePriceRangeChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const numValue = parseInt(value);
    
    if (name === 'min') {
      onFilterChange({ priceRange: [Math.min(numValue, filters.priceRange[1]), filters.priceRange[1]] });
    } else {
      onFilterChange({ priceRange: [filters.priceRange[0], Math.max(numValue, filters.priceRange[0])] });
    }
  }, [onFilterChange, filters.priceRange]);

  const handleSortChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ sortBy: event.target.value as "name" | "price" | "recent" });
  }, [onFilterChange]);

  const handleSortOrderChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ sortOrder: event.target.value as "asc" | "desc" });
  }, [onFilterChange]);

  const handleClearFilters = useCallback(() => {
    onFilterChange({
      categoryId: null,
      searchQuery: "",
      priceRange: [0, 500],
      sortBy: "name",
      sortOrder: "asc"
    });
  }, [onFilterChange]);

  const uniqueCategories = useMemo(() => {
    if (!categories?.length) return [];
    
    const seen = new Set();
    return categories.filter(category => {
      const standardizedCategory = category.name.toLowerCase().trim();
      if (seen.has(standardizedCategory)) return false;
      seen.add(standardizedCategory);
      return true;
    });
  }, [categories]);

  if (!uniqueCategories.length) return null;

  return (
    <div className="border border-black bg-white rounded-md shadow-md p-4 overflow-y-auto max-h-[calc(100vh-8rem)] w-full">
      {/* Category Filter */}
      <div>
        <h3 className=" text-lg font-semibold text-gray-800 mb-3">Categories</h3>
        <div className="flex flex-col gap-2">
          <button
            className={getButtonStyleClass(!filters.categoryId)}
            onClick={() => handleClick(null)}
          >
            All
          </button>
          {uniqueCategories.map((category) => (
            <button
              key={category.id}
              className={getButtonStyleClass(filters.categoryId === category.id)}
              onClick={() => handleClick(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range Filter */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mt-5 mb-3">Price Range</h3>
        <div className="flex flex-col sm:flex-row items-center gap-2">
          <div className="relative w-full sm:w-24">
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-600">$</span>
            <input
              type="number"
              name="min"
              min={0}
              max={1000}
              value={filters.priceRange[0]}
              onChange={handlePriceRangeChange}
              className="w-full sm:w-24 p-2 pl-6 border rounded-md text-center text-sm"
            />
          </div>
          <span className="text-gray-600">to</span>
          <div className="relative w-full sm:w-24">
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-600">$</span>
            <input
              type="number"
              name="max"
              min={0}
              max={1000}
              value={filters.priceRange[1]}
              onChange={handlePriceRangeChange}
              className="w-full sm:w-24 p-2 pl-6 border rounded-md text-center text-sm"
            />
          </div>
        </div>
      </div>

      {/* Sort Controls */}
      <div className="mt-5">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Sort By</h3>
        <div className="flex flex-col gap-2">
          <select
            value={filters.sortBy}
            onChange={handleSortChange}
            className="w-full p-2 border rounded-md text-sm bg-white cursor-pointer z-10 relative"
          >
            <option value="name">Name</option>
            <option value="price">Price</option>
            <option value="recent">Most Recent</option>
          </select>
          <select
            value={filters.sortOrder}
            onChange={handleSortOrderChange}
            className="w-full p-2 border rounded-md text-sm bg-white cursor-pointer z-10 relative"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </div>

      {/* Clear Filters Button */}
      <div className="mt-5">
        <button
          onClick={handleClearFilters}
          className="w-full bg-olive-50 text-black px-4 py-2 rounded-lg font-bold hover:bg-olive-200 focus:outline-none"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  return JSON.stringify(prevProps.filters) === JSON.stringify(nextProps.filters) &&
         prevProps.categories.length === nextProps.categories.length;
});

export default CategoryFilter;
