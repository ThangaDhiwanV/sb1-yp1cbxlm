import React from 'react';
import { cn } from '../../utils/cn';

interface ProgressProps {
    value: number;
    max?: number;
    variant?: 'default' | 'success' | 'warning' | 'error';
    size?: 'sm' | 'md' | 'lg';
    showValue?: boolean;
    label?: string;
    className?: string;
    animated?: boolean;
}

const Progress: React.FC<ProgressProps> = ({
    value,
    max = 100,
    variant = 'default',
    size = 'md',
    showValue = false,
    label,
    className,
    animated = true,
}) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    const variants = {
        default: {
            bar: 'bg-primary-500',
            text: 'text-primary-700',
        },
        success: {
            bar: 'bg-success-500',
            text: 'text-success-700',
        },
        warning: {
            bar: 'bg-warning-500',
            text: 'text-warning-700',
        },
        error: {
            bar: 'bg-error-500',
            text: 'text-error-700',
        },
    };

    const sizes = {
        sm: {
            track: 'h-1.5',
            text: 'text-xs',
            wrapper: 'space-y-1',
        },
        md: {
            track: 'h-2',
            text: 'text-sm',
            wrapper: 'space-y-1.5',
        },
        lg: {
            track: 'h-3',
            text: 'text-sm',
            wrapper: 'space-y-2',
        },
    };

    return (
        <div className={cn('w-full', sizes[size].wrapper, className)}>
            {(label || showValue) && (
                <div className="flex justify-between items-center">
                    {label && (
                        <p className={cn(sizes[size].text, 'font-medium text-gray-700')}>
                            {label}
                        </p>
                    )}
                    {showValue && (
                        <p className={cn(sizes[size].text, variants[variant].text, 'font-medium')}>
                            {Math.round(percentage)}%
                        </p>
                    )}
                </div>
            )}

            <div className={cn(
                'overflow-hidden rounded-full bg-gray-100',
                sizes[size].track
            )}>
                <div
                    className={cn(
                        'h-full rounded-full transition-all duration-500',
                        variants[variant].bar,
                        animated && percentage > 0 && percentage < 100 && 'animate-pulse',
                    )}
                    style={{ width: `${percentage}%` }}
                    role="progressbar"
                    aria-valuenow={value}
                    aria-valuemin={0}
                    aria-valuemax={max}
                />
            </div>
        </div>
    );
};

export default Progress;