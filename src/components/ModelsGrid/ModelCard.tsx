import React from 'react';
import { Clock, Book, HardDrive, MonitorSmartphone } from 'lucide-react';
import { toast } from 'sonner';
import { Model } from '../../types';
import Card, { CardContent } from '../common/Card';
import { useNavigate } from 'react-router-dom';
import { getFileContent } from '../../api/instrumentService';

interface ModelCardProps {
    model: Model;
}

const ModelCard: React.FC<ModelCardProps> = ({ model }) => {
    const navigate = useNavigate();

    const handleCardClick = () => {
        navigate(`/explorer/${model.instrumentId}`);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const checkAndNavigate = async (viewType: string) => {
        const file = model.files.find(f => f.type.toLowerCase() === viewType.toLowerCase());
        if (file) {
            try {
                // Pre-fetch the file content to ensure it exists
                const fileContent = await getFileContent(file.id);
                if (fileContent) {
                    navigate(`/explorer/${model.instrumentId}/${viewType}/${file.id}`);
                } else {
                    toast.error(`Unable to load ${viewType} content`);
                }
            } catch (error) {
                toast.error(`Error loading ${viewType} content`);
            }
        } else {
            const contentTypes: Record<string, string> = {
                manual: 'Manual',
                driver: 'Driver',
                panel: 'Soft Panel'
            };
            toast.error(`${contentTypes[viewType]} is not available for this model`);
        }
    };

    const IconButton = ({ icon: Icon, label, viewType }: { icon: React.ElementType; label: string; viewType: string }) => (
        <div className="group relative" onClick={(e) => {
            e.stopPropagation();
            checkAndNavigate(viewType);
        }}>
            <div className="p-3 rounded-lg transition-colors bg-white/90 hover:bg-gray-50 border border-gray-200 shadow-sm cursor-pointer">
                <Icon className="h-6 w-6 text-gray-600" />
            </div>
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 -translate-y-full z-10
                    opacity-0 group-hover:opacity-100 transition-opacity
                    bg-gray-800 text-white text-xs px-2 py-1 rounded-md whitespace-nowrap">
                {label}
            </div>
        </div>
    );

    return (
        <Card className="!bg-white shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.02] hover:border-primary-300 border border-gray-200"
            onClick={handleCardClick}>
            <CardContent className="p-6 bg-white">
                <div className="mb-6">
                    <h3 className="text-xl font-semibold text-gray-900 group-hover:text-primary-600">{model.name}</h3>
                </div>

                <div className="flex justify-between items-center px-4 mb-6">
                    <IconButton icon={Book} label="Manual" viewType="manual" />
                    <IconButton icon={HardDrive} label="Driver" viewType="driver" />
                    <IconButton icon={MonitorSmartphone} label="Soft Panel" viewType="panel" />
                </div>

                <div className="flex items-center text-sm text-primary-600">
                    <Clock className="h-4 w-4 mr-2" />
                    Created: {formatDate(model.createdDate)}
                </div>
            </CardContent>
        </Card>
    );
};

export default ModelCard;