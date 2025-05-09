import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Book, Layout, Clock } from 'lucide-react';
import { Model } from '../../types';
import { cn } from '../../utils/cn';
import { openModelPanel } from '../../api/instrumentService';
import { toast } from 'sonner';
import Card, { CardContent } from '../common/Card';

interface ModelCardProps {
    model: Model;
}

const ModelCard: React.FC<ModelCardProps> = ({ model }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        const driverFile = model.files.find(f => f.type === 'driver');
        if (driverFile) {
            navigate(`/explorer/${model.instrumentId}/driver/${driverFile.id}`);
        } else {
            navigate(`/explorer/${model.instrumentId}/driver/${model.id}`);
            toast.warning('No driver file found for this model');
        }
    };

    const handleViewInExplorer = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigate(`/explorer/${model.instrumentId}/driver/${model.id}`);
    };

    const handleManualClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigate(`/explorer/${model.instrumentId}/manual/${model.id}`);
    };

    const handleOpenPanel = async (e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            const success = await openModelPanel(model.instrumentId, model.id);
            toast[success ? 'success' : 'error'](
                success ? 'Panel opened successfully' : 'Failed to open panel'
            );
        } catch (error) {
            console.error('Error opening panel:', error);
            toast.error('Failed to open panel');
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const formatModelName = (name: string) => {
        const spacedName = name.replace(/[_-]/g, ' ');
        return spacedName
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    };

    const ActionButton = ({ icon: Icon, label, onClick }: { icon: React.ElementType, label: string, onClick: (e: React.MouseEvent) => void }) => (
        <button
            onClick={onClick}
            className="group relative"
        >
            <div className={cn(
                "p-2.5 rounded-lg transition-all duration-200",
                "bg-white hover:bg-gradient-to-br hover:from-primary-50 hover:to-secondary-50",
                "border-2 border-primary-100/60 hover:border-primary-300/70",
                "text-primary-600 hover:text-primary-700",
                "shadow-sm shadow-primary-100/20 hover:shadow-md hover:shadow-primary-200/30"
            )}>
                <Icon className="h-4 w-4" />
            </div>
            <div className={cn(
                "absolute -top-9 left-1/2 transform -translate-x-1/2",
                "px-2 py-1 rounded-md text-xs font-medium",
                "bg-gray-800 text-white whitespace-nowrap",
                "opacity-0 group-hover:opacity-100 transition-opacity duration-200",
                "pointer-events-none z-10",
                "shadow-lg shadow-gray-800/20"
            )}>
                {label}
            </div>
        </button>
    );

    return (
        <Card
            onClick={handleClick}
            className={cn(
                'transform transition-all duration-200 hover:scale-[1.02]',
                'bg-gradient-to-br from-white via-primary-50/30 to-secondary-100/50',
                'hover:from-white hover:via-primary-100/40 hover:to-secondary-200/60',
                'border-2 border-primary-200/30 hover:border-primary-300/50',
                'shadow-lg shadow-primary-100/20 hover:shadow-xl hover:shadow-primary-200/30',
                'cursor-pointer'
            )}
        >
            <CardContent className="p-4">
                <div className="flex flex-col gap-3">
                    <div>
                        <h3 className="text-base font-semibold leading-tight bg-gradient-to-r from-primary-700 to-secondary-700 bg-clip-text text-transparent">
                            {formatModelName(model.name)}
                        </h3>
                        <p className="text-xs text-primary-600/70 flex items-center mt-1.5">
                            <Clock className="h-3.5 w-3.5 mr-1 text-primary-500/70" />
                            Last updated: {formatDate(model.lastUpdated)}
                        </p>
                    </div>

                    <div className="flex items-center justify-between border-t border-primary-200/40 pt-3 mt-1 gap-2">
                        <ActionButton
                            icon={FileText}
                            label="View Driver"
                            onClick={handleViewInExplorer}
                        />
                        <ActionButton
                            icon={Book}
                            label="Manual"
                            onClick={handleManualClick}
                        />
                        <ActionButton
                            icon={Layout}
                            label="Open Panel"
                            onClick={handleOpenPanel}
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default ModelCard;