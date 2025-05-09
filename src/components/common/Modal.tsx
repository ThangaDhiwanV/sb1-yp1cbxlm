import React from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X } from 'lucide-react';
import { cn } from '../../utils/cn';
import Button from './Button';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    description?: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
    className?: string;
}

const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    title,
    description,
    children,
    footer,
    size = 'md',
    className,
}) => {
    const sizeClasses = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        full: 'max-w-4xl',
    };

    return (
        <Transition appear show={isOpen} as={React.Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                {/* Backdrop */}
                <Transition.Child
                    as={React.Fragment}
                    enter="ease-out duration-200"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-150"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-900/25 backdrop-blur-sm" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={React.Fragment}
                            enter="ease-out duration-200"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-150"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel
                                className={cn(
                                    'w-full transform overflow-hidden rounded-xl',
                                    'bg-white shadow-xl',
                                    'text-left align-middle',
                                    'transition-all',
                                    sizeClasses[size],
                                    className
                                )}
                            >
                                {/* Header */}
                                {(title || description) && (
                                    <div className="px-6 py-4 border-b border-gray-200/60">
                                        {title && (
                                            <Dialog.Title
                                                as="h3"
                                                className="text-lg font-semibold leading-6 text-gray-900"
                                            >
                                                {title}
                                            </Dialog.Title>
                                        )}
                                        {description && (
                                            <Dialog.Description
                                                as="p"
                                                className="mt-1 text-sm text-gray-600"
                                            >
                                                {description}
                                            </Dialog.Description>
                                        )}
                                    </div>
                                )}

                                {/* Close Button */}
                                <div className="absolute right-4 top-4">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="p-1.5 hover:bg-gray-100 rounded-lg"
                                        onClick={onClose}
                                    >
                                        <X className="h-4 w-4 text-gray-500" />
                                    </Button>
                                </div>

                                {/* Content */}
                                <div className="px-6 py-5">{children}</div>

                                {/* Footer */}
                                {footer && (
                                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-200/60">
                                        {footer}
                                    </div>
                                )}
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

export default Modal;