import React from 'react';
import { SlidersHorizontal, ArrowDownUp } from 'lucide-react';

interface FilterSortControlsProps {
  onFilter: () => void;
  onSort: () => void;
}

const FilterSortControls: React.FC<FilterSortControlsProps> = ({
  onFilter,
  onSort
}) => {
  return (
    <div className="flex space-x-2">
      <button
        onClick={onFilter}
        className="btn btn-primary flex items-center space-x-1"
      >
        <SlidersHorizontal size={18} />
        <span>Filter</span>
      </button>
      <button
        onClick={onSort}
        className="btn btn-primary flex items-center space-x-1"
      >
        <ArrowDownUp size={18} />
        <span>Sort</span>
      </button>
    </div>
  );
};

export default FilterSortControls;