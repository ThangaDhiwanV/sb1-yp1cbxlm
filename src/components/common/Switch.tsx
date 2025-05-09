import React from 'react';
import { Switch as HeadlessSwitch } from '@headlessui/react';
import { cn } from '../../utils/cn';

interface SwitchProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    label?: string;
    description?: string;
    disabled?: boolean;
    size?: 'sm' | 'md';
    className?: string;
}

const Switch: React.FC<SwitchProps> = ({
    checked,
    onChange,
    label,
    description,
    disabled = false,
    size = 'md',
    className,
}) => {
    const switchSizes = {
        sm: {
            switch: 'h-5 w-9',
            dot: 'h-3.5 w-3.5',
            translate: 'translate-x-4',
        },
        md: {
            switch: 'h-6 w-11',
            dot: 'h-4 w-4',
            translate: 'translate-x-5',
        },
    };

    return (
        <HeadlessSwitch.Group>
            <div className={cn('flex items-center gap-3', className)}>
                <HeadlessSwitch
                    checked={checked}
                    onChange={onChange}
                    disabled={disabled}
                    className={cn(
                        'relative inline-flex shrink-0 cursor-pointer rounded-full',
                        'transition-colors duration-200 ease-in-out',
                        'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/20',
                        checked ? 'bg-primary-500' : 'bg-gray-200',
                        disabled && 'opacity-50 cursor-not-allowed',
                        switchSizes[size].switch
                    )}
                >
                    <span
                        className={cn(
                            'pointer-events-none inline-block rounded-full bg-white',
                            'shadow transform ring-0 transition duration-200 ease-in-out',
                            checked ? switchSizes[size].translate : 'translate-x-0.5',
                            switchSizes[size].dot
                        )}
                    />
                </HeadlessSwitch>

                {(label || description) && (
                    <div className="flex flex-col">
                        {label && (
                            <HeadlessSwitch.Label className="text-sm font-medium text-gray-900">
                                {label}
                            </HeadlessSwitch.Label>
                        )}
                        {description && (
                            <HeadlessSwitch.Description className="text-xs text-gray-500">
                                {description}
                            </HeadlessSwitch.Description>
                        )}
                    </div>
                )}
            </div>
        </HeadlessSwitch.Group>
    );
};

export default Switch;