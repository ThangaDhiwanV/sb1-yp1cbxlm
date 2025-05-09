import React from 'react';
import { cn } from '../../utils/cn';

interface Tab {
    id: string;
    label: string;
    icon?: React.ElementType;
}

interface TabsProps {
    tabs: Tab[];
    activeTab: string;
    onChange: (tabId: string) => void;
    variant?: 'pills' | 'underline';
    className?: string;
}

const Tabs: React.FC<TabsProps> = ({
    tabs,
    activeTab,
    onChange,
    variant = 'pills',
    className,
}) => {
    const getTabStyles = (isActive: boolean) => {
        if (variant === 'pills') {
            return cn(
                'px-4 py-2 rounded-lg text-sm font-medium',
                'transition-all duration-200 ease-in-out',
                'focus:outline-none focus:ring-2 focus:ring-primary-500/20',
                isActive
                    ? 'bg-primary-50 text-primary-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            );
        }

        return cn(
            'px-4 py-2 text-sm font-medium border-b-2',
            'transition-all duration-200 ease-in-out',
            'focus:outline-none',
            isActive
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
        );
    };

    return (
        <nav className={cn('flex', variant === 'underline' && 'border-b border-gray-200', className)}>
            {tabs.map((tab) => {
                const isActive = tab.id === activeTab;
                const Icon = tab.icon;

                return (
                    <button
                        key={tab.id}
                        onClick={() => onChange(tab.id)}
                        className={getTabStyles(isActive)}
                        aria-current={isActive ? 'page' : undefined}
                    >
                        <span className="flex items-center gap-2">
                            {Icon && (
                                <Icon className={cn(
                                    'h-4 w-4',
                                    isActive ? 'text-primary-500' : 'text-gray-400 group-hover:text-gray-500'
                                )} />
                            )}
                            {tab.label}
                        </span>
                    </button>
                );
            })}
        </nav>
    );
};

export default Tabs;