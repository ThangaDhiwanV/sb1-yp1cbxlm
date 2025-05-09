import React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../utils/cn';

interface SelectOption {
    value: string;
    label: string;
}

interface SelectProps {
    options: SelectOption[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
    disabled?: boolean;
    size?: 'sm' | 'md' | 'lg';
    error?: boolean;
    required?: boolean;
}

const Select: React.FC<SelectProps> = ({
    options,
    value,
    onChange,
    placeholder = 'Select an option',
    className,
    disabled = false,
    size = 'md',
    error = false,
    required = false,
}) => {
    const sizeClasses = {
        sm: 'py-1.5 px-3 text-sm',
        md: 'py-2 px-3 text-sm',
        lg: 'py-2.5 px-4 text-base',
    };

    return (
        <div className="relative">
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                required={required}
                className={cn(
                    'w-full appearance-none rounded-lg',
                    'border border-gray-200',
                    'bg-white pr-10',
                    'text-gray-900 placeholder-gray-500',
                    'focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500',
                    'disabled:opacity-50 disabled:cursor-not-allowed',
                    'transition-all duration-200',
                    error && 'border-error-300 focus:border-error-500 focus:ring-error-500/20',
                    sizeClasses[size],
                    className
                )}
            >
                {placeholder && (
                    <option value="" disabled>
                        {placeholder}
                    </option>
                )}
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            <div className={cn(
                'absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none',
                error ? 'text-error-500' : 'text-gray-400'
            )}>
                <ChevronDown className={cn(
                    'h-4 w-4 transition-transform duration-200',
                    'group-focus-within:rotate-180'
                )} />
            </div>
        </div>
    );
};

export default Select;