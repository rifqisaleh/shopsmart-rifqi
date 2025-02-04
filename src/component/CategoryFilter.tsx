import React from "react";

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

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  filters,
  categories,
  onFilterChange,
}) => {
  const { categoryId, priceRange } = filters; // Removed searchQuery

  // Ensure only one "Misc" category appears
  const uniqueCategories = categories.reduce((acc: Category[], category) => {
    if (category.name === "Misc") {
      if (!acc.some((c) => c.name === "Misc")) {
        acc.push({ id: "5", name: "Misc" });
      }
    } else {
      acc.push(category);
    }
    return acc;
  }, []);

  return (
    <div className="space-y-4">
      {/* Category Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <button
          className={`px-3 py-2 rounded text-center ${
            !categoryId ? "bg-urbanChic-500 text-white" : "bg-urbanChic-200"
          }`}
          onClick={() => onFilterChange({ categoryId: null })}
        >
          All
        </button>
        {uniqueCategories.map((category) => (
          <button
            key={category.id}
            className={`px-3 py-2 rounded text-center ${
              categoryId === category.id
                ? "bg-urbanChic-500 text-white"
                : "bg-urbanChic-200"
            }`}
            onClick={() => onFilterChange({ categoryId: category.id })}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Price Range Filter */}
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Price Range: ${priceRange[0]} - ${priceRange[1]}
        </label>
        <input
          type="range"
          min="0"
          max="500"
          step="10"
          value={priceRange[1]}
          onChange={(e) =>
            onFilterChange({
              priceRange: [priceRange[0], Number(e.target.value)] as [number, number],
            })
          }
          className="w-full appearance-none h-2 bg-urbanChic-500 rounded-md"
        />
      </div>
    </div>
  );
};

export default CategoryFilter;
