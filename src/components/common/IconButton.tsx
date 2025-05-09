import React from 'react';
import { cn } from '../../utils/cn';
import Tooltip from './Tooltip';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    icon: React.ElementType;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    tooltip?: string;
    loading?: boolean;
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(({
    icon: Icon,
    variant = 'ghost',
    size = 'md',
    tooltip,
    loading = false,
    disabled = false,
    className,
    ...props
}, ref) => {
    const sizeClasses = {
        sm: 'p-1.5',
        md: 'p-2',
        lg: 'p-2.5',
    };

    const iconSizes = {
        sm: 'h-4 w-4',
        md: 'h-5 w-5',
        lg: 'h-6 w-6',
    };

    const variantClasses = {
        primary: cn(
            'bg-primary-500 text-white',
            'hover:bg-primary-600',
            'focus:ring-primary-500/20',
            'shadow-sm'
        ),
        secondary: cn(
            'bg-secondary-500 text-white',
            'hover:bg-secondary-600',
            'focus:ring-secondary-500/20',
            'shadow-sm'
        ),
        outline: cn(
            'border border-gray-200 bg-white text-gray-700',
            'hover:bg-gray-50 hover:border-gray-300',
            'focus:ring-primary-500/20',
            'shadow-sm'
        ),
        ghost: cn(
            'text-gray-700 bg-transparent',
            'hover:bg-gray-100',
            'focus:ring-gray-500/20'
        ),
    };

    const button = (
        <button
            ref={ref}
            type="button"
            disabled={disabled || loading}
            className={cn(
                'inline-flex items-center justify-center rounded-lg',
                'transition-all duration-200',
                'focus:outline-none focus:ring-2 focus:ring-offset-2',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                variantClasses[variant],
                sizeClasses[size],
                className
            )}
            {...props}
        >
            {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
            ) : (
                <Icon className={iconSizes[size]} />
            )}
        </button>
    );

    if (tooltip) {
        return (
            <Tooltip content={tooltip}>
                {button}
            </Tooltip>
        );
    }

    return button;
});

IconButton.displayName = 'IconButton';

export default IconButton;