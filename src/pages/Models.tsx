import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import ModelsGrid from '../components/ModelsGrid/ModelsGrid';
import { getModelsByInstrumentId, getInstrumentById } from '../api/instrumentService';
import { Model } from '../types';
import Breadcrumbs from '../components/common/Breadcrumbs';
import { debounce } from '../utils/debounce';

const Models: React.FC = () => {
    const { instrumentId } = useParams<{ instrumentId: string }>();
    const [models, setModels] = useState<Model[]>([]);
    const [instrumentName, setInstrumentName] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchData = useCallback(async () => {
        if (!instrumentId) return;

        try {
            setLoading(true);
            const [instrument, modelData] = await Promise.all([
                getInstrumentById(instrumentId),
                getModelsByInstrumentId(instrumentId)
            ]);

            if (instrument) {
                setInstrumentName(instrument.name);
            }

            // Apply search filter
            let filteredModels = [...modelData];

            if (searchQuery) {
                const searchLower = searchQuery.toLowerCase();
                filteredModels = filteredModels.filter(model =>
                    model.name.toLowerCase().includes(searchLower)
                );
            }

            // Pagination
            const pageSize = 9;
            const total = filteredModels.length;
            const totalPages = Math.ceil(total / pageSize);
            const start = (currentPage - 1) * pageSize;
            const end = start + pageSize;

            setModels(filteredModels.slice(start, end));
            setTotalPages(totalPages);
            setError(null);
        } catch (err) {
            setError('Failed to fetch models. Please try again later.');
            console.error('Error fetching models:', err);
        } finally {
            setLoading(false);
        }
    }, [instrumentId, currentPage, searchQuery]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const debouncedSearch = debounce((query: string) => {
        setSearchQuery(query);
        setCurrentPage(1);
    }, 300);

    const breadcrumbItems = [
        { label: 'Instruments', href: '/' },
        { label: instrumentName || 'Instrument' },
        { label: 'Models' }
    ];

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <Breadcrumbs items={breadcrumbItems} />
                <h1 className="text-2xl font-bold text-gray-800 mt-4">Models</h1>
            </div>

            {error ? (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">Error! </strong>
                    <span className="block sm:inline">{error}</span>
                </div>
            ) : (
                <ModelsGrid
                    models={models}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    onSearch={debouncedSearch}
                    loading={loading}
                    searchQuery={searchQuery}
                />
            )}
        </div>
    );
};

export default Models;