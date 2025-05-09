import React from 'react';
import { cn } from '../../utils/cn';

interface BadgeProps {
    children: React.ReactNode;
    variant?: 'default' | 'success' | 'warning' | 'error' | 'primary' | 'secondary';
    size?: 'sm' | 'md';
    className?: string;
}

const Badge: React.FC<BadgeProps> = ({
    children,
    variant = 'default',
    size = 'md',
    className,
}) => {
    const variantClasses = {
        default: 'bg-gray-100 text-gray-700',
        success: 'bg-success-50 text-success-700',
        warning: 'bg-warning-50 text-warning-700',
        error: 'bg-error-50 text-error-700',
        primary: 'bg-primary-50 text-primary-700',
        secondary: 'bg-secondary-50 text-secondary-700',
    };

    const sizeClasses = {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-0.5 text-sm',
    };

    return (
        <span
            className={cn(
                'inline-flex items-center gap-1 font-medium rounded-md',
                'transition-colors duration-200',
                variantClasses[variant],
                sizeClasses[size],
                className
            )}
        >
            {children}
        </span>
    );
};

export default Badge;