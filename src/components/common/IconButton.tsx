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
      'bg-gradient-to-r from-primary-500 to-primary-600 text-white',
      'hover:from-primary-600 hover:to-primary-700',
      'focus:ring-primary-500/20',
      'shadow-md shadow-primary-500/10 hover:shadow-lg hover:shadow-primary-500/20'
    ),
    secondary: cn(
      'bg-gradient-to-r from-secondary-500 to-secondary-600 text-white',
      'hover:from-secondary-600 hover:to-secondary-700',
      'focus:ring-secondary-500/20',
      'shadow-md shadow-secondary-500/10 hover:shadow-lg hover:shadow-secondary-500/20'
    ),
    outline: cn(
      'border-2 border-gray-200 bg-white text-gray-700',
      'hover:border-primary-500/50 hover:text-primary-600',
      'focus:ring-primary-500/20',
      'shadow-sm hover:shadow-md hover:shadow-primary-500/10'
    ),
    ghost: cn(
      'text-gray-700 bg-transparent',
      'hover:bg-gray-100 hover:text-primary-600',
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
        'transition-all duration-300 ease-in-out transform',
        'focus:outline-none focus:ring-2',
        'active:scale-95',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {loading ? (
        <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
      ) : (
        <Icon className={cn(
          iconSizes[size],
          'transition-transform duration-300 hover:scale-110 hover:rotate-3'
        )} />
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