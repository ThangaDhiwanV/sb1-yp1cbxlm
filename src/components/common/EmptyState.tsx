import React from 'react';
import { cn } from '../../utils/cn';
import Button from './Button';

interface EmptyStateProps {
    icon?: React.ElementType;
    title: string;
    description?: string;
    action?: {
        label: string;
        onClick: () => void;
    };
    className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
    icon: Icon,
    title,
    description,
    action,
    className,
}) => {
    return (
        <div className={cn(
            'flex flex-col items-center justify-center text-center',
            'p-8 rounded-xl',
            'bg-gradient-to-br from-white via-gray-50/50 to-primary-50/20',
            'border border-gray-200/60',
            className
        )}>
            {Icon && (
                <div className={cn(
                    'w-12 h-12 mb-4 rounded-lg',
                    'bg-primary-50/50 text-primary-600',
                    'flex items-center justify-center'
                )}>
                    <Icon className="w-6 h-6" />
                </div>
            )}

            <h3 className={cn(
                'text-base font-semibold text-gray-900',
                'bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent'
            )}>
                {title}
            </h3>

            {description && (
                <p className="mt-1 text-sm text-gray-500 max-w-sm">
                    {description}
                </p>
            )}

            {action && (
                <div className="mt-4">
                    <Button
                        variant="primary"
                        size="sm"
                        onClick={action.onClick}
                    >
                        {action.label}
                    </Button>
                </div>
            )}
        </div>
    );
};

export default EmptyState;