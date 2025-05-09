import React from 'react';
import { cn } from '../../utils/cn';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    error?: boolean;
    icon?: React.ElementType;
    size?: 'sm' | 'md' | 'lg';
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({
    className,
    error,
    icon: Icon,
    size = 'md',
    type = 'text',
    disabled = false,
    ...props
}, ref) => {
    const sizeClasses = {
        sm: 'py-1.5 text-sm',
        md: 'py-2 text-sm',
        lg: 'py-2.5 text-base',
    };

    return (
        <div className="relative">
            {Icon && (
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Icon className={cn(
                        'h-4 w-4',
                        error ? 'text-error-500' : 'text-gray-400',
                        disabled && 'opacity-50'
                    )} />
                </div>
            )}
            <input
                ref={ref}
                type={type}
                disabled={disabled}
                className={cn(
                    'w-full rounded-lg',
                    'border border-gray-200',
                    'bg-white',
                    'text-gray-900 placeholder:text-gray-500',
                    'focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500',
                    'disabled:opacity-50 disabled:cursor-not-allowed',
                    'transition-all duration-200',
                    error && 'border-error-300 focus:border-error-500 focus:ring-error-500/20',
                    Icon ? 'pl-10' : 'px-3',
                    sizeClasses[size],
                    className
                )}
                {...props}
            />
        </div>
    );
});

Input.displayName = 'Input';

export default Input;