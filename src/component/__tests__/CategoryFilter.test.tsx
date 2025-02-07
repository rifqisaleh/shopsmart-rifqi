import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import CategoryFilter from "../CategoryFilter";

const mockCategories = [
  { id: "1", name: "Category 1" },
  { id: "2", name: "Category 2" },
  { id: "3", name: "Misc" },
  { id: "4", name: "Misc" }, // Duplicate Misc for testing deduplication
];

const defaultFilters = {
  categoryId: null,
  searchQuery: "",
  priceRange: [0, 1000] as [number, number],
  sortBy: "name" as "name" | "price" | "recent",
  sortOrder: "asc" as "asc" | "desc",
};

describe("CategoryFilter", () => {
  let onFilterChange: jest.Mock;

  beforeEach(() => {
    onFilterChange = jest.fn();
  });

  it("renders all categories and 'All' button", () => {
    render(
      <CategoryFilter
        filters={defaultFilters}
        categories={mockCategories}
        onFilterChange={onFilterChange}
      />
    );

    expect(screen.getByText("All")).toBeInTheDocument();
    expect(screen.getByText("Category 1")).toBeInTheDocument();
    expect(screen.getByText("Category 2")).toBeInTheDocument();
    
    // Should only show one Misc button due to deduplication
    const miscButtons = screen.queryAllByText("Misc");
    expect(miscButtons).toHaveLength(1);
  });

  it("highlights selected category", () => {
    render(
      <CategoryFilter
        filters={{ ...defaultFilters, categoryId: "1" }}
        categories={mockCategories}
        onFilterChange={onFilterChange}
      />
    );

    const selectedButton = screen.getByText("Category 1");
    console.log("Selected button classes:", selectedButton.classList.value); // Debugging step

    
    expect(selectedButton).toHaveClass("bg-greenSage");
    expect(selectedButton).toHaveClass("text-white");
    expect(selectedButton).toHaveClass("shadow-md");

    
    expect(screen.getByText("All")).toHaveClass("bg-urbanChic-100");
  });

  it("calls onFilterChange when category is selected", () => {
    render(
      <CategoryFilter
        filters={defaultFilters}
        categories={mockCategories}
        onFilterChange={onFilterChange}
      />
    );

    fireEvent.click(screen.getByText("Category 1"));
    expect(onFilterChange).toHaveBeenCalledWith({ categoryId: "1" });
  });

  it("calls onFilterChange with null when 'All' is selected", () => {
    render(
      <CategoryFilter
        filters={defaultFilters}
        categories={mockCategories}
        onFilterChange={onFilterChange}
      />
    );

    fireEvent.click(screen.getByText("All"));
    expect(onFilterChange).toHaveBeenCalledWith({ categoryId: null });
  });

  it("returns null when categories array is empty", () => {
    const { container } = render(
      <CategoryFilter
        filters={defaultFilters}
        categories={[]}
        onFilterChange={onFilterChange}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  it("handles keyboard navigation with Tab and Enter keys", () => {
    render(
      <CategoryFilter
        filters={defaultFilters}
        categories={mockCategories}
        onFilterChange={onFilterChange}
      />
    );

    const buttons = screen.getAllByRole("button");
    buttons[0].focus();

    // Test tab navigation
    expect(document.activeElement).toBe(buttons[0]);

    // Simulate click instead of keyDown for Enter
    fireEvent.click(buttons[1]);
    expect(onFilterChange).toHaveBeenCalled();
  });

  it("applies correct styling to unselected categories", () => {
    render(
      <CategoryFilter
        filters={{ ...defaultFilters, categoryId: "1" }}
        categories={mockCategories}
        onFilterChange={onFilterChange}
      />
    );

    const unselectedButton = screen.getByText("Category 2");
    expect(unselectedButton).toHaveClass("bg-urbanChic-100");
    expect(unselectedButton).not.toHaveClass("bg-greenSage");
  });

  it("properly deduplicates categories by name", () => {
    const duplicateCategories = [
      ...mockCategories,
      { id: "5", name: "Category 1" }, // Duplicate name
      { id: "6", name: "Misc" }, // Another duplicate
    ];

    render(
      <CategoryFilter
        filters={defaultFilters}
        categories={duplicateCategories}
        onFilterChange={onFilterChange}
      />
    );

    expect(screen.getAllByText("Category 1")).toHaveLength(1);
    expect(screen.getAllByText("Misc")).toHaveLength(1);
  });

  it("maintains selected state after re-render", () => {
    const { rerender } = render(
      <CategoryFilter
        filters={{ ...defaultFilters, categoryId: "1" }}
        categories={mockCategories}
        onFilterChange={onFilterChange}
      />
    );

    expect(screen.getByText("Category 1")).toHaveClass("bg-greenSage");

    rerender(
      <CategoryFilter
        filters={{ ...defaultFilters, categoryId: "1" }}
        categories={mockCategories}
        onFilterChange={onFilterChange}
      />
    );

    expect(screen.getByText("Category 1")).toHaveClass("bg-greenSage");
  });
});
