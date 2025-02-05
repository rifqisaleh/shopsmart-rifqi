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
    <div className="space-y-4">
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
         prevProps.categories.length === nextProps.categories.length;
});

export default CategoryFilter;
