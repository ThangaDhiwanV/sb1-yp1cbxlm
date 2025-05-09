import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import ModelsGrid from '../components/ModelsGrid/ModelsGrid';
import { getInstrumentById } from '../api/instrumentService';
import { getModelsByInstrumentId } from '../api/modelService';
import { Model, Instrument } from '../types';
import { debounce } from '../utils/debounce';
import PageHeader from '../components/common/PageHeader';

const Models: React.FC = () => {
    const { instrumentId } = useParams<{ instrumentId: string }>();
    const [models, setModels] = useState<Model[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedInstrument, setSelectedInstrument] = useState<Instrument | null>(null);

    const fetchData = useCallback(async () => {
        if (!instrumentId) return;

        try {
            setLoading(true);
            const [instrument, modelData] = await Promise.all([
                getInstrumentById(instrumentId),
                getModelsByInstrumentId(instrumentId)
            ]);

            if (instrument) {
                setSelectedInstrument(instrument);
            }

            let filteredModels = [...modelData];

            if (searchQuery) {
                const searchLower = searchQuery.toLowerCase();
                filteredModels = filteredModels.filter(model =>
                    model.name.toLowerCase().includes(searchLower)
                );
            }

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
        { label: 'Project', href: '/project' },
        { label: 'All Instruments', href: '/instruments' },
        {
            label: selectedInstrument
                ? `${selectedInstrument.name} Models`
                : 'Models'
        }
    ];

    return (
        <div className="container mx-auto px-4 py-8">
            <PageHeader
                title={selectedInstrument ? `${selectedInstrument.name} Models` : 'Models'}
                description="Browse and manage instrument models"
                breadcrumbs={breadcrumbItems}
            />

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