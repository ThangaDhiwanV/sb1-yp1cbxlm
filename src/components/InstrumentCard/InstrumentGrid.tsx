import React from 'react';
import InstrumentCard from './InstrumentCard';
import { Instrument } from '../../types';
import { Filter, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import Button from '../common/Button';

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

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center gap-4 bg-white p-3 rounded-lg shadow-sm">
          {/* Search */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-4 w-4 text-gray-500" />
            </div>
            <input
              type="text"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2.5"
              placeholder="Search instruments..."
              value={searchQuery}
              onChange={(e) => onSearch(e.target.value)}
            />
          </div>

          {/* Filter */}
          <div className="relative w-[150px]">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Filter className="h-4 w-4 text-gray-500" />
            </div>
            <select
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2.5"
              onChange={(e) => onFilterChange(e.target.value)}
              defaultValue=""
            >
              <option value="">All types</option>
              <option value="SMU">SMU</option>
              <option value="DMM">DMM</option>
            </select>
          </div>

          {/* Sort */}
          <select
            className="w-[150px] bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block p-2.5"
            onChange={(e) => handleSort(e.target.value)}
            value={sortBy || ''}
          >
            <option value="">Sort by</option>
            <option value="name">Name</option>
            <option value="type">Type</option>
          </select>

          {/* Pagination */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage <= 1 || loading}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <form onSubmit={handleCustomPageSubmit} className="flex items-center gap-2">
              <input
                type="text"
                value={customPage}
                onChange={handleCustomPageChange}
                className="w-14 p-1.5 text-sm border border-gray-300 rounded-md text-center"
                aria-label="Page number"
              />
              <span className="text-sm text-gray-600">/ {totalPages}</span>
            </form>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages || loading}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {instruments.map((instrument) => (
          <InstrumentCard key={instrument.id} instrument={instrument} />
        ))}
      </div>

      {instruments.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500">No instruments found</p>
        </div>
      )}
    </div>
  );
};

export default InstrumentGrid;