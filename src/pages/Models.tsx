import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import ModelsGrid from '../components/ModelsGrid/ModelsGrid';
import { getInstrumentById } from '../api/instrumentService';
import { getModelsByInstrumentId } from '../api/modelService';
import { Model, Instrument, PaginatedResponse } from '../types';
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

        // If we're already loading, don't start another fetch
        if (loading) {
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Log API URLs and configuration for debugging
            console.log('API Configuration:', {
                mockApi: config.mockApi,
                baseUrl: config.apiBaseUrl
            });
            console.log('Fetching instrument:', `${config.apiBaseUrl}/instruments/${instrumentId}`);
            console.log('Fetching models:', `${config.apiBaseUrl}/instruments/${instrumentId}/models`);

            // Fetch instrument and models data in parallel with proper error handling
            const [instrument, modelData] = await Promise.all([
                getInstrumentById(instrumentId).catch(error => {
                    console.error('Error fetching instrument:', error);
                    toast.error('Failed to fetch instrument details');
                    throw error;
                }),
                getModelsByInstrumentId(instrumentId).catch(error => {
                    console.error('Error fetching models:', error);
                    toast.error('Failed to fetch models');
                    throw error;
                })
            ]);

            if (!instrument) {
                throw new Error('Instrument not found');
            }

            console.log('Instrument data:', instrument);
            console.log('Model data:', modelData);

            setSelectedInstrument(instrument);
            setModels(modelData.data || []);
            setTotalPages(modelData.totalPages);
            setCurrentPage(modelData.page);

        } catch (err: any) {
            const errorMessage = err?.message || 'Failed to load data. Please try again.';
            setError(errorMessage);
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    }, [instrumentId, loading]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const debouncedSearch = debounce((query: string) => {
        setSearchQuery(query);
    }, 300);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <div className="flex justify-between items-center">
                    <Breadcrumbs
                        items={[
                            { label: 'Project', href: '/project' },
                            { label: 'All Instruments', href: '/instruments' },
                            {
                                label: loading
                                    ? 'Loading...'
                                    : selectedInstrument
                                        ? `${selectedInstrument.name} Models`
                                        : 'Models',
                                href: loading || !selectedInstrument
                                    ? undefined
                                    : `/instruments/${selectedInstrument.id}/models`
                            }
                        ]}
                    />
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