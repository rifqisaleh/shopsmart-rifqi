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
  };
  categories: Category[];
  onFilterChange: (updatedFilters: Partial<CategoryFilterProps["filters"]>) => void;
}

const getButtonStyleClass = (isSelected: boolean) => 
  `px-4 py-2 rounded-md font-medium transition-all duration-200 text-sm ${
    isSelected ? "bg-urbanChic-500 text-white shadow-md" : "bg-urbanChic-100 text-gray-700 hover:bg-urbanChic-300"
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
    <div className="border border-black bg-white rounded-md shadow-md p-4 w-64 overflow-y-auto max-h-[calc(100vh-8rem)] mx-auto sm:mx-0 mb-2">
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
          <input
            type="number"
            name="min"
            min={0}
            max={1000}
            value={filters.priceRange[0]}
            onChange={handlePriceRangeChange}
            className="w-full sm:w-24 p-2 border rounded-md text-center text-sm"
          />
          <span className="text-gray-600">to</span>
          <input
            type="number"
            name="max"
            min={0}
            max={1000}
            value={filters.priceRange[1]}
            onChange={handlePriceRangeChange}
            className="w-full sm:w-24 p-2 border rounded-md text-center text-sm"
          />
        </div>
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  return prevProps.filters.categoryId === nextProps.filters.categoryId &&
         prevProps.categories.length === nextProps.categories.length &&
         prevProps.filters.priceRange[0] === nextProps.filters.priceRange[0] &&
         prevProps.filters.priceRange[1] === nextProps.filters.priceRange[1];
});

export default CategoryFilter;
