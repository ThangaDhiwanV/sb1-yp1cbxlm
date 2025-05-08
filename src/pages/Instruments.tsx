import React, { useState, useEffect, useCallback } from 'react';
import InstrumentGrid from '../components/InstrumentCard/InstrumentGrid';
import { getInstruments } from '../api/instrumentService';
import { Instrument } from '../types';
import { debounce } from '../utils/debounce';

const Instruments: React.FC = () => {
    const [instruments, setInstruments] = useState<Instrument[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [filterType, setFilterType] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState<string | undefined>();
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

    const fetchInstruments = useCallback(async () => {
        try {
            setLoading(true);
            const response = await getInstruments({
                page: currentPage,
                pageSize: 8,
                type: filterType || undefined,
                search: searchQuery || undefined,
                sortBy: sortBy as any,
                sortOrder
            });
            setInstruments(response.data);
            setTotalPages(response.totalPages);
            setError(null);
        } catch (err) {
            setError('Failed to fetch instruments. Please try again later.');
            console.error('Error fetching instruments:', err);
        } finally {
            setLoading(false);
        }
    }, [currentPage, filterType, searchQuery, sortBy, sortOrder]);

    useEffect(() => {
        fetchInstruments();
    }, [fetchInstruments]);

    const debouncedSearch = debounce((query: string) => {
        setSearchQuery(query);
        setCurrentPage(1); // Reset to first page on search
    }, 300);

    const handleFilterChange = (type: string) => {
        setFilterType(type);
        setCurrentPage(1); // Reset to first page on filter change
    };

    const handleSort = (newSortBy: string, newSortOrder: 'asc' | 'desc') => {
        setSortBy(newSortBy);
        setSortOrder(newSortOrder);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-gray-800">Instruments</h1>
            </div>

            {error ? (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">Error! </strong>
                    <span className="block sm:inline">{error}</span>
                </div>
            ) : (
                <InstrumentGrid
                    instruments={instruments}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    onFilterChange={handleFilterChange}
                    onSearch={debouncedSearch}
                    onSort={handleSort}
                    loading={loading}
                    searchQuery={searchQuery}
                    sortBy={sortBy}
                    sortOrder={sortOrder}
                />
            )}
        </div>
    );
};

export default Instruments;