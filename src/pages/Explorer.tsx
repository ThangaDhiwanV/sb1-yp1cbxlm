import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import InstrumentDetailView from '../components/InstrumentDetail/InstrumentDetailView';
import { getInstrumentById } from '../api/instrumentService';
import { Instrument } from '../types';
import Breadcrumbs from '../components/common/Breadcrumbs';

const Explorer: React.FC = () => {
    const { id, fileType, fileId } = useParams<{ id: string; fileType?: string; fileId?: string }>();
    const [instrument, setInstrument] = useState<Instrument | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchInstrument = async () => {
            if (!id) return;

            try {
                setLoading(true);
                const data = await getInstrumentById(id);

                if (!data) {
                    setError('Instrument not found');
                    return;
                }

                setInstrument(data);
                setError(null);
            } catch (err) {
                setError('Failed to fetch instrument details. Please try again later.');
                console.error('Error fetching instrument:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchInstrument();
    }, [id]);

    const breadcrumbItems = [
        { label: 'Instruments', href: '/' },
        { label: instrument?.name || 'Instrument', href: `/models/${id}` },
        { label: 'Explorer' }
    ];

    return (
        <div className="container mx-auto px-4 py-8 h-screen flex flex-col">
            <div className="mb-6">
                <Breadcrumbs items={breadcrumbItems} />
            </div>

            <div className="flex-1 overflow-hidden">
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
                    </div>
                ) : error ? (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                        <strong className="font-bold">Error! </strong>
                        <span className="block sm:inline">{error}</span>
                    </div>
                ) : instrument ? (
                    <InstrumentDetailView
                        instrument={instrument}
                        initialFileId={fileId}
                        initialFileType={fileType}
                    />
                ) : (
                    <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
                        <span className="block sm:inline">Instrument not found</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Explorer;