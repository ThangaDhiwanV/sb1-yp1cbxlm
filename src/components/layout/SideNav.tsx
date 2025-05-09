import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Box, Code, Database } from 'lucide-react';
import { cn } from '../../utils/cn';
import Tooltip from '../common/Tooltip';

const navItems = [
    { id: 'project', label: 'Project', icon: Home, path: '/' },
    { id: 'macrobs', label: 'Macros', icon: Database, path: '/macrobs' },
    { id: 'vc', label: 'VB', icon: Code, path: '/vc' },
    { id: 'instruments', label: 'All Instruments', icon: Box, path: '/instruments' },
];

const SideNav: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <>
            {/* Full-width Title Bar */}
            <header className="fixed top-0 left-0 right-0 h-14 bg-white border-b border-gray-200 shadow-sm flex items-center justify-between px-6 z-30">
                <h1 className="text-xl font-bold text-primary-600 tracking-wide">
                    INSTRUMENT <span className="text-primary-500">360</span>
                </h1>
                <Tooltip content="Pal" placement="left">
                    <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-medium cursor-pointer hover:bg-primary-200 transition-colors">
                        P
                    </div>
                </Tooltip>
            </header>

            {/* Side Navigation - Start below header */}
            <div className="w-16 bg-white border-r border-gray-200/60 fixed left-0 top-14 bottom-0 flex flex-col items-center py-4 shadow-sm z-20">
                {/* Navigation Items */}
                <nav className="flex-1 w-full">
                    <ul className="space-y-2 px-2">
                        {navItems.map((item) => (
                            <li key={item.id}>
                                <Tooltip content={item.label} placement="right">
                                    <button
                                        onClick={() => navigate(item.path)}
                                        className={cn(
                                            'w-full flex items-center justify-center p-2 rounded-lg group',
                                            'transition-all duration-200 ease-in-out',
                                            location.pathname === item.path
                                                ? 'bg-primary-100 text-primary-600 shadow-sm'
                                                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                                        )}
                                    >
                                        <item.icon
                                            className={cn(
                                                'w-5 h-5 transition-colors',
                                                location.pathname === item.path
                                                    ? 'text-primary-500'
                                                    : 'text-gray-400 group-hover:text-gray-600'
                                            )}
                                        />
                                    </button>
                                </Tooltip>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Version Tag */}
                <div className="text-[10px] text-gray-400 mt-auto py-2">
                    v1.0.0
                </div>
            </div>
        </>
    );
};

export default SideNav;
