import React, { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { ChevronRight } from 'lucide-react';
import { cn } from '../../utils/cn';

interface MenuItem {
    label: string;
    onClick?: () => void;
    icon?: React.ElementType;
    disabled?: boolean;
    variant?: 'default' | 'danger';
    submenu?: MenuItem[];
}

interface MenuListProps {
    items: MenuItem[];
    className?: string;
}

const MenuList: React.FC<MenuListProps> = ({ items, className }) => {
    const renderMenuItem = (item: MenuItem, close: () => void) => {
        const commonClasses = cn(
            'group flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm',
            'transition-colors duration-200',
            item.disabled && 'opacity-50 cursor-not-allowed',
            !item.disabled && item.variant !== 'danger' && 'text-gray-700 hover:bg-primary-50 hover:text-primary-700',
            !item.disabled && item.variant === 'danger' && 'text-error-600 hover:bg-error-50 hover:text-error-700'
        );

        if (item.submenu) {
            return (
                <Menu as="div" className="relative w-full">
                    <Menu.Button className={commonClasses}>
                        {item.icon && (
                            <item.icon className={cn(
                                'h-4 w-4',
                                item.variant === 'danger' ? 'text-error-500' : 'text-gray-400 group-hover:text-primary-500'
                            )} />
                        )}
                        <span className="flex-1 text-left">{item.label}</span>
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                    </Menu.Button>

                    <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                    >
                        <Menu.Items className={cn(
                            'absolute left-full top-0 ml-1 w-48',
                            'rounded-lg bg-white shadow-lg ring-1 ring-gray-200',
                            'focus:outline-none',
                            'p-1'
                        )}>
                            {item.submenu.map((subItem, index) => (
                                <Menu.Item key={index}>
                                    {renderMenuItem(subItem, close)}
                                </Menu.Item>
                            ))}
                        </Menu.Items>
                    </Transition>
                </Menu>
            );
        }

        return (
            <button
                onClick={() => {
                    if (!item.disabled && item.onClick) {
                        item.onClick();
                        close();
                    }
                }}
                disabled={item.disabled}
                className={commonClasses}
            >
                {item.icon && (
                    <item.icon className={cn(
                        'h-4 w-4',
                        item.variant === 'danger' ? 'text-error-500' : 'text-gray-400 group-hover:text-primary-500'
                    )} />
                )}
                <span className="flex-1 text-left">{item.label}</span>
            </button>
        );
    };

    return (
        <div className={cn(
            'rounded-lg bg-white shadow-lg ring-1 ring-gray-200',
            'p-1',
            className
        )}>
            {items.map((item, index) => (
                <Menu.Item key={index}>
                    {({ close }) => renderMenuItem(item, close)}
                </Menu.Item>
            ))}
        </div>
    );
};

export default MenuList;