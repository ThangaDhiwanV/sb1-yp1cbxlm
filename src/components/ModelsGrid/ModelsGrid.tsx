import React from 'react';
import { Model } from '../../types';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import Button from '../common/Button';
import ModelCard from './ModelCard';
import { cn } from '../../utils/cn';

interface ModelsGridProps {
    models: Model[];
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    onSearch: (query: string) => void;
    loading?: boolean;
    searchQuery?: string;
}

const ModelsGrid: React.FC<ModelsGridProps> = ({
    models,
    currentPage,
    totalPages,
    onPageChange,
    onSearch,
    loading = false,
    searchQuery = '',
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

    return (
        <div className="space-y-8">
            <div className={cn(
                'flex items-center justify-between gap-6',
                'bg-white/80 backdrop-blur-sm p-4 rounded-xl',
                'border border-gray-200/60 shadow-sm'
            )}>
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Search className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        className={cn(
                            "block w-full pl-10 pr-3 py-2.5 text-sm",
                            "border border-gray-200 rounded-lg",
                            "bg-gray-50/50",
                            "placeholder:text-gray-500",
                            "focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500",
                            "transition-all duration-200"
                        )}
                        placeholder="Search models..."
                        value={searchQuery}
                        onChange={(e) => onSearch(e.target.value)}
                    />
                </div>

                {/* Pagination */}
                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage <= 1 || loading}
                        className={cn(
                            "px-2.5 min-w-[32px] h-8",
                            "border-gray-200 hover:border-primary-300 hover:bg-primary-50",
                            "disabled:hover:bg-transparent"
                        )}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <form onSubmit={handleCustomPageSubmit} className="flex items-center gap-2">
                        <input
                            type="text"
                            value={customPage}
                            onChange={handleCustomPageChange}
                            className={cn(
                                "w-12 py-1 px-2 text-sm text-center",
                                "border border-gray-200 rounded-md",
                                "focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500",
                                "transition-all duration-200"
                            )}
                            aria-label="Page number"
                        />
                        <span className="text-sm text-gray-600">/ {totalPages}</span>
                    </form>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage >= totalPages || loading}
                        className={cn(
                            "px-2.5 min-w-[32px] h-8",
                            "border-gray-200 hover:border-primary-300 hover:bg-primary-50",
                            "disabled:hover:bg-transparent"
                        )}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
                {models.map((model) => (
                    <div key={model.id} className="h-fit animate-fade-in">
                        <ModelCard model={model} />
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {models.length === 0 && !loading && (
                <div className={cn(
                    "flex flex-col items-center justify-center py-16 rounded-xl",
                    "bg-gradient-to-br from-white via-gray-50 to-primary-50/20",
                    "border border-gray-200/60"
                )}>
                    <p className="text-gray-500 text-sm mb-2">No models found</p>
                    <p className="text-gray-400 text-xs">Try adjusting your search criteria</p>
                </div>
            )}

            {/* Loading State */}
            {loading && (
                <div className={cn(
                    "flex items-center justify-center py-16 rounded-xl",
                    "bg-gradient-to-br from-white via-gray-50 to-primary-50/20",
                    "border border-gray-200/60"
                )}>
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500" />
                </div>
            )}
        </div>
    );
};

export default ModelsGrid;