import React from 'react';
import { SortByDate, SortByPrice } from '../../types/wish.types';

interface FilterBarProps {
  sortByDate: SortByDate;
  sortByPrice: SortByPrice;
  onSortByDateChange: (sort: SortByDate) => void;
  onSortByPriceChange: (sort: SortByPrice) => void;
  onAddClick: () => void;
}

export function FilterBar({
  sortByDate,
  sortByPrice,
  onSortByDateChange,
  onSortByPriceChange,
  onAddClick,
}: FilterBarProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <select
          value={sortByDate}
          onChange={(e) => onSortByDateChange(e.target.value as SortByDate)}
          className="select-field text-sm"
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
        </select>

        <select
          value={sortByPrice}
          onChange={(e) => onSortByPriceChange(e.target.value as SortByPrice)}
          className="select-field text-sm"
        >
          <option value="high-to-low">Price: High to Low</option>
          <option value="low-to-high">Price: Low to High</option>
        </select>
      </div>

      {/* Add Button */}
      <button
        onClick={onAddClick}
        className="btn-primary w-full sm:w-auto"
      >
        Add Wish
      </button>
    </div>
  );
}