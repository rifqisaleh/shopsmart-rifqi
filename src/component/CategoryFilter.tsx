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
  `px-3 py-2 rounded text-center ${
    isSelected ? "bg-urbanChic-500 text-white" : "bg-urbanChic-200"
  }`;

const CategoryFilter: React.FC<CategoryFilterProps> = React.memo(({
  filters,
  categories,
  onFilterChange,
}) => {
  // Single memoized handler for all button clicks
  const handleClick = useCallback((categoryId: string | null) => {
    onFilterChange({ categoryId });
  }, [onFilterChange]);

  const handlePriceRangeChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const numValue = parseInt(value);
    
    if (name === 'min') {
      // Ensure min doesn't exceed max
      const newMin = Math.min(numValue, filters.priceRange[1]);
      onFilterChange({ priceRange: [newMin, filters.priceRange[1]] });
    } else {
      // Ensure max doesn't go below min
      const newMax = Math.max(numValue, filters.priceRange[0]);
      onFilterChange({ priceRange: [filters.priceRange[0], newMax] });
    }
  }, [onFilterChange, filters.priceRange]);

  // Memoize unique categories only when categories array changes
  const uniqueCategories = useMemo(() => {
    if (!categories?.length) return [];
    
    const seen = new Set();
    return categories.filter(category => {
      if (category.name === "Misc") {
        if (seen.has("Misc")) return false;
        seen.add("Misc");
        return true;
      }
      return true;
    });
  }, [categories]);

  if (!uniqueCategories.length) return null;

  return (
    <div className="space-y-6">
      {/* Price Range Filter */}
      <div className="space-y-2">
        <h3 className="font-medium text-gray-700">Price Range</h3>
        <div className="relative pt-6 pb-2">
          <div className="h-2 bg-urbanChic-200 rounded">
            <div
              className="absolute h-2 bg-urbanChic-500 rounded"
              style={{
                left: `${(filters.priceRange[0] / 1000) * 100}%`,
                right: `${100 - (filters.priceRange[1] / 1000) * 100}%`
              }}
            ></div>
          </div>
          <input
            type="range"
            name="min"
            min={0}
            max={1000}
            value={filters.priceRange[0]}
            onChange={handlePriceRangeChange}
            className="absolute w-full top-4 h-2 appearance-none pointer-events-none bg-transparent [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-urbanChic-500"
          />
          <input
            type="range"
            name="max"
            min={0}
            max={1000}
            value={filters.priceRange[1]}
            onChange={handlePriceRangeChange}
            className="absolute w-full top-4 h-2 appearance-none pointer-events-none bg-transparent [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-urbanChic-500"
          />
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>${filters.priceRange[0]}</span>
          <span>${filters.priceRange[1]}</span>
        </div>
      </div>

      {/* Category Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
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
  );
}, (prevProps, nextProps) => {
  return prevProps.filters.categoryId === nextProps.filters.categoryId &&
         prevProps.categories.length === nextProps.categories.length &&
         prevProps.filters.priceRange[0] === nextProps.filters.priceRange[0] &&
         prevProps.filters.priceRange[1] === nextProps.filters.priceRange[1];
});

export default CategoryFilter;
