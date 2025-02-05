import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CategoryFilter from '../CategoryFilter';

const mockCategories = [
  { id: '1', name: 'Category 1' },
  { id: '2', name: 'Category 2' },
  { id: '3', name: 'Misc' },
  { id: '4', name: 'Misc' }, // Duplicate Misc for testing deduplication
];

const defaultFilters: { categoryId: string | null; searchQuery: string; priceRange: [number, number] } = {
  categoryId: null,
  searchQuery: '',
  priceRange: [0, 1000],
};

describe('CategoryFilter', () => {
  let onFilterChange: jest.Mock;

  beforeEach(() => {
    onFilterChange = jest.fn();
  });

  it('renders all categories and "All" button', () => {
    render(
      <CategoryFilter
        filters={defaultFilters}
        categories={mockCategories}
        onFilterChange={onFilterChange}
      />
    );

    expect(screen.getByText('All')).toBeInTheDocument();
    expect(screen.getByText('Category 1')).toBeInTheDocument();
    expect(screen.getByText('Category 2')).toBeInTheDocument();
    // Should only show one Misc button due to deduplication
    const miscButtons = screen.queryAllByText('Misc');
    expect(miscButtons).toHaveLength(1);
  });

  it('highlights selected category', () => {
    render(
      <CategoryFilter
        filters={{ ...defaultFilters, categoryId: '1' }}
        categories={mockCategories}
        onFilterChange={onFilterChange}
      />
    );

    const selectedButton = screen.getByText('Category 1');
    expect(selectedButton).toHaveClass('bg-urbanChic-500');
    expect(screen.getByText('All')).toHaveClass('bg-urbanChic-200');
  });

  it('calls onFilterChange when category is selected', () => {
    render(
      <CategoryFilter
        filters={defaultFilters}
        categories={mockCategories}
        onFilterChange={onFilterChange}
      />
    );

    fireEvent.click(screen.getByText('Category 1'));
    expect(onFilterChange).toHaveBeenCalledWith({ categoryId: '1' });
  });

  it('calls onFilterChange with null when "All" is selected', () => {
    render(
      <CategoryFilter
        filters={defaultFilters}
        categories={mockCategories}
        onFilterChange={onFilterChange}
      />
    );

    fireEvent.click(screen.getByText('All'));
    expect(onFilterChange).toHaveBeenCalledWith({ categoryId: null });
  });

  it('returns null when categories array is empty', () => {
    const { container } = render(
      <CategoryFilter
        filters={defaultFilters}
        categories={[]}
        onFilterChange={onFilterChange}
      />
    );

    expect(container.firstChild).toBeNull();
  });
});
