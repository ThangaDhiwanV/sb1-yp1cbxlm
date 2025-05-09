import React from 'react';
import { AlertTriangle } from 'lucide-react';
import Button from './Button';
import { cn } from '../../utils/cn';

interface ErrorBoundaryProps {
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error?: Error;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('Error caught by ErrorBoundary:', error, errorInfo);
    }

    handleReset = () => {
        this.setState({ hasError: false, error: undefined });
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className={cn(
                    'min-h-[400px] flex items-center justify-center p-8',
                    'bg-gradient-to-br from-error-50 to-white'
                )}>
                    <div className="text-center space-y-4">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-error-100">
                            <AlertTriangle className="w-8 h-8 text-error-600" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-lg font-semibold text-gray-900">
                                Something went wrong
                            </h3>
                            {this.state.error && (
                                <p className="text-sm text-gray-600 max-w-md">
                                    {this.state.error.message}
                                </p>
                            )}
                        </div>
                        <div className="pt-4">
                            <Button
                                onClick={this.handleReset}
                                variant="primary"
                                size="sm"
                            >
                                Try again
                            </Button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;