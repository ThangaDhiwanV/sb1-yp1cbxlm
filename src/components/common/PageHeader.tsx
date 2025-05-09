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
        <div className={cn('mb-8 space-y-4', className)}>
            {breadcrumbs && <Breadcrumbs items={breadcrumbs} className="mb-6" />}

            <div className="flex items-start justify-between gap-4">
                <div className="space-y-1.5">
                    <h1 className={cn(
                        "text-2xl font-semibold leading-tight",
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
                    <div className="flex items-center gap-3">
                        {actions}
                    </div>
                )}
            </div>

            {/* Gradient Separator */}
            <div className="h-px w-full bg-gradient-to-r from-primary-100/50 via-secondary-200/50 to-transparent" />
        </div>
    );
};

export default PageHeader;