import React from 'react';
import { cn } from '../../utils/cn';
import SideNav from './SideNav';

interface MainLayoutProps {
    children: React.ReactNode;
    className?: string;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, className }) => {
    return (
        <div className="min-h-screen bg-gray-50">
            <SideNav />
            <main className={cn(
                'transition-all duration-300',
                'pt-16 px-4', // Reduced padding
                'ml-20', // Match the sidebar width
                className
            )}>
                {children}
            </main>
        </div>
    );
};

export default MainLayout;