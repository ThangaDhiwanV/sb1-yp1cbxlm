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
                'pt-20 px-6', // Increased top padding to account for header height (14px + extra space)
                'ml-16', // Match the sidebar width
                className
            )}>
                {children}
            </main>
        </div>
    );
};

export default MainLayout;