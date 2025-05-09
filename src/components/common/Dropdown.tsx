import React from 'react';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../utils/cn';

interface DropdownItem {
    label: string;
    onClick: () => void;
    icon?: React.ElementType;
    disabled?: boolean;
    variant?: 'default' | 'danger';
}

interface DropdownProps {
    trigger: React.ReactNode;
    items: DropdownItem[];
    align?: 'left' | 'right';
    className?: string;
}

const Dropdown: React.FC<DropdownProps> = ({
    trigger,
    items,
    align = 'right',
    className,
}) => {
    return (
        <Menu as="div" className="relative inline-block text-left">
            <Menu.Button className="outline-none">
                {trigger}
            </Menu.Button>

            <Transition
                as={React.Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <Menu.Items
                    className={cn(
                        'absolute z-50 mt-2 w-56 rounded-lg',
                        'bg-white shadow-lg ring-1 ring-gray-200',
                        'focus:outline-none',
                        align === 'right' ? 'right-0' : 'left-0',
                        'divide-y divide-gray-200/60',
                        className
                    )}
                >
                    <div className="p-1">
                        {items.map((item, index) => (
                            <Menu.Item key={index}>
                                {({ active }) => (
                                    <button
                                        onClick={item.onClick}
                                        disabled={item.disabled}
                                        className={cn(
                                            'group flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm',
                                            'transition-colors duration-200',
                                            active && !item.disabled && item.variant !== 'danger' && 'bg-primary-50 text-primary-700',
                                            active && !item.disabled && item.variant === 'danger' && 'bg-error-50 text-error-700',
                                            !active && item.variant === 'danger' && 'text-error-600',
                                            !active && item.variant !== 'danger' && 'text-gray-700',
                                            item.disabled && 'cursor-not-allowed opacity-50',
                                            'outline-none'
                                        )}
                                    >
                                        {item.icon && (
                                            <item.icon className={cn(
                                                'h-4 w-4',
                                                active && !item.disabled && item.variant !== 'danger' && 'text-primary-500',
                                                active && !item.disabled && item.variant === 'danger' && 'text-error-500',
                                                !active && item.variant === 'danger' && 'text-error-500',
                                                !active && item.variant !== 'danger' && 'text-gray-400'
                                            )} />
                                        )}
                                        {item.label}
                                    </button>
                                )}
                            </Menu.Item>
                        ))}
                    </div>
                </Menu.Items>
            </Transition>
        </Menu>
    );
};

export default Dropdown;