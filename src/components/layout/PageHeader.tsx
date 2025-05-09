import React from 'react';
import { cn } from '../../utils/cn';
import Breadcrumbs from './Breadcrumbs';
import type { BreadcrumbItem } from '../../types';
import { Sparkles } from 'lucide-react';
import Button from '../common/Button';
import { useCreationContext } from '../../App';

interface PageHeaderProps {
    title: string;
    description?: string;
    breadcrumbs?: BreadcrumbItem[];
    className?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({
    title,
    description,
    breadcrumbs,
    className,
}) => {
    const { setIsCreationSliderOpen } = useCreationContext();

    return (
        <div className={cn('mb-4', className)}>
            <div className="flex items-center justify-between gap-4 mb-3">
                {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}
                <Button
                    variant="create"
                    icon={Sparkles}
                    onClick={() => setIsCreationSliderOpen(true)}
                    className="animate-fade-in"
                >
                    Create HAL/Driver
                </Button>
            </div>

            <div className="space-y-1">
                <h1 className={cn(
                    "text-xl font-semibold leading-tight",
                    "bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent"
                )}>
                    {title}
                </h1>
                {description && (
                    <p className="text-sm text-gray-600 max-w-2xl">
                        {description}
                    </p>
                )}
            </div>

            <div className="h-px w-full bg-gradient-to-r from-primary-100/50 via-secondary-200/50 to-transparent mt-3" />
        </div>
    );
};

export default PageHeader;