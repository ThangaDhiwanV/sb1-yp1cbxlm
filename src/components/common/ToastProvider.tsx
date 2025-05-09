import React from 'react';
import { Toaster } from 'sonner';

export const ToastProvider: React.FC = () => {
    return (
        <Toaster
            position="top-right"
            toastOptions={{
                style: {
                    background: 'white',
                    color: 'rgb(17, 24, 39)', // text-gray-900
                    border: '1px solid rgba(229, 231, 235, 0.6)', // border-gray-200/60
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                    fontSize: '0.875rem',
                },
                success: {
                    style: {
                        borderLeft: '4px solid rgb(16, 185, 129)', // success-500
                    },
                },
                error: {
                    style: {
                        borderLeft: '4px solid rgb(239, 68, 68)', // error-500
                    },
                },
                warning: {
                    style: {
                        borderLeft: '4px solid rgb(245, 158, 11)', // warning-500
                    },
                },
            }}
        />
    );
};