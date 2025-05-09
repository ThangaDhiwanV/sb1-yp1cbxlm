import React from 'react';
import { AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react';
import { cn } from '../../utils/cn';

interface AlertProps {
    title?: string;
    children: React.ReactNode;
    variant?: 'info' | 'success' | 'warning' | 'error';
    className?: string;
}

const Alert: React.FC<AlertProps> = ({
    title,
    children,
    variant = 'info',
    className,
}) => {
    const icons = {
        info: Info,
        success: CheckCircle,
        warning: AlertCircle,
        error: XCircle,
    };

    const styles = {
        info: {
            container: 'bg-primary-50/50 border-primary-200/60',
            icon: 'text-primary-500',
            title: 'text-primary-800',
            content: 'text-primary-700',
        },
        success: {
            container: 'bg-success-50/50 border-success-200/60',
            icon: 'text-success-500',
            title: 'text-success-800',
            content: 'text-success-700',
        },
        warning: {
            container: 'bg-warning-50/50 border-warning-200/60',
            icon: 'text-warning-500',
            title: 'text-warning-800',
            content: 'text-warning-700',
        },
        error: {
            container: 'bg-error-50/50 border-error-200/60',
            icon: 'text-error-500',
            title: 'text-error-800',
            content: 'text-error-700',
        },
    };

    const Icon = icons[variant];

    return (
        <div
            className={cn(
                'flex gap-3 rounded-lg border p-4',
                styles[variant].container,
                className
            )}
        >
            <Icon className={cn('h-5 w-5 flex-shrink-0', styles[variant].icon)} />

            <div className="flex-1 space-y-1">
                {title && (
                    <h3 className={cn(
                        'text-sm font-medium leading-6',
                        styles[variant].title
                    )}>
                        {title}
                    </h3>
                )}
                <div className={cn(
                    'text-sm',
                    styles[variant].content
                )}>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Alert;