import React, { useState } from 'react';
import {
    useFloating,
    autoUpdate,
    offset,
    flip,
    shift,
    useHover,
    useFocus,
    useDismiss,
    useRole,
    useInteractions,
    FloatingPortal,
    arrow,
    type Placement,
} from '@floating-ui/react';
import { cn } from '../../utils/cn';

interface TooltipProps {
    content: React.ReactNode;
    children: React.ReactNode;
    placement?: Placement;
    className?: string;
    delayShow?: number;
}

const Tooltip: React.FC<TooltipProps> = ({
    content,
    children,
    placement = 'top',
    className,
    delayShow = 200,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const arrowRef = React.useRef(null);

    const {
        refs,
        floatingStyles,
        context
    } = useFloating({
        placement,
        open: isOpen,
        onOpenChange: setIsOpen,
        middleware: [
            offset(8),
            flip({
                fallbackAxisSideDirection: 'start',
                padding: 8
            }),
            shift({ padding: 8 }),
            arrow({ element: arrowRef }),
        ],
        whileElementsMounted: autoUpdate,
    });

    const hover = useHover(context, { delay: { open: delayShow } });
    const focus = useFocus(context);
    const dismiss = useDismiss(context);
    const role = useRole(context, { role: 'tooltip' });

    const { getReferenceProps, getFloatingProps } = useInteractions([
        hover,
        focus,
        dismiss,
        role,
    ]);

    return (
        <>
            <div ref={refs.setReference} {...getReferenceProps()}>
                {children}
            </div>
            {isOpen && (
                <FloatingPortal>
                    <div
                        ref={refs.setFloating}
                        style={{
                            ...floatingStyles,
                            zIndex: 50,
                        }}
                        {...getFloatingProps()}
                        className={cn(
                            'animate-in fade-in-0 zoom-in-95',
                            'px-3 py-2 rounded-lg',
                            'text-xs font-medium text-white',
                            'bg-gray-900/90 backdrop-blur-sm',
                            'shadow-lg shadow-gray-900/10',
                            'max-w-[300px] text-center',
                            'border border-gray-800/20',
                            className
                        )}
                    >
                        {content}
                        <div
                            ref={arrowRef}
                            className={cn(
                                'absolute rotate-45 w-2 h-2',
                                'bg-gray-900/90 border-gray-800/20',
                                placement.includes('top') && 'bottom-0 -translate-y-1 border-b border-r',
                                placement.includes('bottom') && 'top-0 translate-y-1 border-t border-l',
                                placement.includes('left') && 'right-0 translate-x-1 border-t border-r',
                                placement.includes('right') && 'left-0 -translate-x-1 border-b border-l'
                            )}
                        />
                    </div>
                </FloatingPortal>
            )}
        </>
    );
};

export default Tooltip;