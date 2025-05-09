import React from 'react';
import InstrumentCard from './InstrumentCard';
import { Instrument } from '../../types';
import { Filter, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import Button from '../common/Button';
import { cn } from '../../utils/cn';

interface InstrumentGridProps {
  instruments: Instrument[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onFilterChange: (type: string) => void;
  onSearch: (query: string) => void;
  onSort: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
  loading?: boolean;
  searchQuery?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

const InstrumentGrid: React.FC<InstrumentGridProps> = ({
  instruments,
  currentPage,
  totalPages,
  onPageChange,
  onFilterChange,
  onSearch,
  onSort,
  loading = false,
  searchQuery = '',
  sortBy,
  sortOrder = 'asc'
}) => {
  const [customPage, setCustomPage] = React.useState(currentPage.toString());

  const handleCustomPageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomPage(value);
  };

  const handleCustomPageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const pageNum = parseInt(customPage);
    if (!isNaN(pageNum) && pageNum > 0 && pageNum <= totalPages) {
      onPageChange(pageNum);
    } else {
      setCustomPage(currentPage.toString());
    }
  };

  const handleSort = (field: string) => {
    const newOrder = sortBy === field && sortOrder === 'asc' ? 'desc' : 'asc';
    onSort(field, newOrder);
  };

  const uniqueTypes = Array.from(new Set(instruments.map(inst => inst.type))).sort();

  return (
    <div className="space-y-4">
      <div className={cn(
        'flex items-center justify-between gap-4',
        'bg-white',
        'p-4 rounded-xl',
        'border border-gray-200',
        'shadow-sm'
      )}>
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-4 w-4 text-primary-500" />
          </div>
          <input
            type="text"
            className={cn(
              "block w-full pl-10 pr-3 py-2 text-sm",
              "rounded-lg",
              "bg-gray-50/50 border border-gray-200",
              "text-gray-900 placeholder:text-gray-500",
              "focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500",
              "transition-all duration-200"
            )}
            placeholder="Search instruments..."
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>

        {/* Filter */}
        <div className="relative w-[200px]">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Filter className="h-4 w-4 text-primary-500" />
          </div>
          <select
            className={cn(
              "block w-full pl-10 pr-3 py-2 text-sm",
              "rounded-lg",
              "bg-gray-50/50 border border-gray-200",
              "text-gray-900",
              "focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500",
              "transition-all duration-200"
            )}
            onChange={(e) => onFilterChange(e.target.value)}
            defaultValue=""
          >
            <option value="">All types</option>
            {uniqueTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {/* Sort */}
        <select
          className={cn(
            "w-[200px]",
            "px-3 py-2 text-sm rounded-lg",
            "bg-gray-50/50 border border-gray-200",
            "text-gray-900",
            "focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500",
            "transition-all duration-200"
          )}
          onChange={(e) => handleSort(e.target.value)}
          value={sortBy || ''}
        >
          <option value="">Sort by</option>
          <option value="name">Name</option>
          <option value="driverCount">Number of Drivers</option>
        </select>

        {/* Pagination */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1 || loading}
            className={cn(
              "min-w-[32px] h-8",
              "border-gray-200 hover:border-primary-300",
              "hover:bg-primary-50"
            )}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <form onSubmit={handleCustomPageSubmit} className="flex items-center gap-2">
            <input
              type="text"
              value={customPage}
              onChange={handleCustomPageChange}
              className={cn(
                "w-14 py-1.5 px-2 text-sm text-center",
                "rounded-lg",
                "bg-gray-50/50 border border-gray-200",
                "focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500",
                "transition-all duration-200"
              )}
              aria-label="Page number"
            />
            <span className="text-sm text-gray-600">/ {totalPages}</span>
          </form>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages || loading}
            className={cn(
              "min-w-[32px] h-8",
              "border-gray-200 hover:border-primary-300",
              "hover:bg-primary-50"
            )}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {instruments.map((instrument) => (
          <InstrumentCard key={instrument.id} instrument={instrument} />
        ))}
      </div>

      {instruments.length === 0 && !loading && (
        <div className={cn(
          "flex flex-col items-center justify-center py-8 rounded-xl",
          "bg-white",
          "border border-gray-200",
          "shadow-sm"
        )}>
          <p className="text-gray-600 text-sm mb-1">No instruments found</p>
          <p className="text-gray-500 text-xs">Try adjusting your search criteria</p>
        </div>
      )}

      {loading && (
        <div className={cn(
          "flex items-center justify-center py-8 rounded-xl",
          "bg-white",
          "border border-gray-200",
          "shadow-sm"
        )}>
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary-500 border-t-transparent" />
        </div>
      )}
    </div>
  );
};

export default InstrumentGrid;