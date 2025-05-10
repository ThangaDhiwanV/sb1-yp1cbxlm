import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import ModelsGrid from '../components/ModelsGrid/ModelsGrid';
import { getInstrumentById } from '../api/instrumentService';
import { getModelsByInstrumentId } from '../api/modelService';
import { Model, Instrument } from '../types';
import Breadcrumbs from '../components/common/Breadcrumbs';
import { debounce } from '../utils/debounce';
import Button from '../components/common/Button';
import { Wrench } from 'lucide-react';
import { useCreationContext } from '../App';
import { toast } from 'sonner';
import { config } from '../api/config';

const Models: React.FC = () => {
    const { instrumentId } = useParams<{ instrumentId: string }>();
    const [models, setModels] = useState<Model[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const { setIsCreationSliderOpen } = useCreationContext();
    const [selectedInstrument, setSelectedInstrument] = useState<Instrument | null>(null);

    const fetchData = useCallback(async () => {
        if (!instrumentId) {
            setError('No instrument ID provided');
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            // Fetch instrument and models data in parallel
            const [instrument, modelData] = await Promise.all([
                getInstrumentById(instrumentId),
                getModelsByInstrumentId(instrumentId)
            ]);

            if (!instrument) {
                throw new Error('Instrument not found');
            }

            setSelectedInstrument(instrument);
            setModels(modelData.data);
            setTotalPages(modelData.totalPages);
            setCurrentPage(modelData.page);

        } catch (err: any) {
            const errorMessage = err?.message || 'Failed to load data. Please try again.';
            setError(errorMessage);
            console.error('Error:', err);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [instrumentId]);

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
            <div className="mb-8">
                <div className="flex justify-between items-center">
                    <Breadcrumbs items={breadcrumbItems} />
                    {!error && (
                        <Button
                            onClick={() => setIsCreationSliderOpen(true)}
                            className="flex items-center gap-2"
                            isCreationButton
                        >
                            <Wrench className="h-4 w-4" />
                            Create HAL/Driver
                        </Button>
                    )}
                </div>
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