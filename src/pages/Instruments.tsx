import React, { useState, useEffect, useCallback } from 'react';
import InstrumentGrid from '../components/InstrumentCard/InstrumentGrid';
import { getInstruments } from '../api/instrumentService';
import { Instrument } from '../types';
import { debounce } from '../utils/debounce';
import { Wrench } from 'lucide-react';
import Button from '../components/common/Button';
import { useCreationContext } from '../App';
import { toast } from 'sonner';
import Breadcrumbs from '../components/common/Breadcrumbs';

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
    const { setIsCreationSliderOpen } = useCreationContext();

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
            toast.error('Failed to fetch instruments');
        } finally {
            setLoading(false);
        }
    }, [currentPage, filterType, searchQuery, sortBy, sortOrder]);

    useEffect(() => {
        fetchInstruments();
    }, [fetchInstruments]);

    const debouncedSearch = debounce((query: string) => {
        setSearchQuery(query);
        setCurrentPage(1);
    }, 300);

    const handleFilterChange = (type: string) => {
        setFilterType(type);
        setCurrentPage(1);
    };

    const handleSort = (newSortBy: string, newSortOrder: 'asc' | 'desc') => {
        setSortBy(newSortBy);
        setSortOrder(newSortOrder);
    };

    const breadcrumbItems = [
        { label: 'Project', href: '/project' },
        { label: 'All Instruments' }
    ];

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <div className="flex justify-between items-center">
                    <Breadcrumbs items={breadcrumbItems} />
                    <Button
                        onClick={() => setIsCreationSliderOpen(true)}
                        className="flex items-center gap-2"
                    >
                        <Wrench className="h-4 w-4" />
                        Create HAL/Driver
                    </Button>
                </div>
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