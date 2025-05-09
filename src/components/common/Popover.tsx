import React from 'react';
import { Popover as HeadlessPopover, Transition } from '@headlessui/react';
import { useFloating, offset, flip, shift, arrow } from '@floating-ui/react';
import { cn } from '../../utils/cn';

interface PopoverProps {
    trigger: React.ReactNode;
    children: React.ReactNode;
    className?: string;
}

const Popover: React.FC<PopoverProps> = ({
    trigger,
    children,
    className,
}) => {
    const arrowRef = React.useRef(null);
    const {
        refs,
        floatingStyles,
    } = useFloating({
        middleware: [
            offset(8),
            flip(),
            shift(),
            arrow({ element: arrowRef }),
        ],
    });

    return (
        <HeadlessPopover className="relative">
            <HeadlessPopover.Button ref={refs.setReference} className="outline-none">
                {trigger}
            </HeadlessPopover.Button>

            <Transition
                enter="transition duration-200 ease-out"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="transition duration-150 ease-in"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
            >
                <HeadlessPopover.Panel
                    ref={refs.setFloating}
                    style={floatingStyles}
                    className={cn(
                        'absolute z-50',
                        'rounded-lg bg-white shadow-lg',
                        'ring-1 ring-gray-200',
                        'focus:outline-none',
                        className
                    )}
                >
                    <div className="relative">
                        {children}
                        <div
                            ref={arrowRef}
                            className={cn(
                                'absolute -top-1 left-1/2 -translate-x-1/2 -translate-y-1/2',
                                'h-2 w-2 rotate-45 transform',
                                'bg-white ring-1 ring-gray-200',
                                'ring-gray-200/60'
                            )}
                        />
                    </div>
                </HeadlessPopover.Panel>
            </Transition>
        </HeadlessPopover>
    );
};

export default Popover;