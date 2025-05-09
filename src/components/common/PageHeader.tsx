import React from 'react';
import { cn } from '../../utils/cn';
import Breadcrumbs from './Breadcrumbs';
import type { BreadcrumbItem } from '../../types';

interface PageHeaderProps {
    title: string;
    description?: string;
    breadcrumbs?: BreadcrumbItem[];
    actions?: React.ReactNode;
    className?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({
    title,
    description,
    breadcrumbs,
    actions,
    className,
}) => {
    return (
        <div className={cn('mb-4', className)}> {/* Reduced margin */}
            {breadcrumbs && <Breadcrumbs items={breadcrumbs} className="mb-3" />} {/* Reduced margin */}

            <div className="flex items-start justify-between gap-3"> {/* Reduced gap */}
                <div className="space-y-1">
                    <h1 className={cn(
                        "text-xl font-semibold leading-tight", // Reduced text size
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

                {actions && (
                    <div className="flex items-center gap-2"> {/* Reduced gap */}
                        {actions}
                    </div>
                )}
            </div>

            <div className="h-px w-full bg-gradient-to-r from-primary-100/50 via-secondary-200/50 to-transparent mt-3" /> {/* Reduced margin */}
        </div>
    );
};

export default PageHeader;