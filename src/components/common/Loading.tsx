import React from 'react';
import { cn } from '../../utils/cn';

interface LoadingProps {
    variant?: 'spinner' | 'skeleton';
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

interface SkeletonProps {
    className?: string;
    animate?: boolean;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className, animate = true }) => {
    return (
        <div
            className={cn(
                'bg-gray-200/60 rounded-lg',
                animate && 'animate-pulse',
                className
            )}
        />
    );
};

const Loading: React.FC<LoadingProps> = ({
    variant = 'spinner',
    size = 'md',
    className,
}) => {
    const spinnerSizes = {
        sm: 'h-4 w-4 border-2',
        md: 'h-8 w-8 border-2',
        lg: 'h-12 w-12 border-3',
    };

    if (variant === 'spinner') {
        return (
            <div
                className={cn(
                    'animate-spin rounded-full',
                    'border-t-primary-500 border-r-primary-500/30 border-b-primary-500/10 border-l-primary-500/50',
                    spinnerSizes[size],
                    className
                )}
            />
        );
    }

    return (
        <div className="space-y-3">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-5/6" />
        </div>
    );
};

export default Loading;