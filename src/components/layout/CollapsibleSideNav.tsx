import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Box, FileText, Microscope, GitBranch, ChevronRight, ChevronLeft } from 'lucide-react';
import { cn } from '../../utils/cn';

const navItems = [
    { icon: Home, label: 'Dashboard', to: '/' },
    { icon: Box, label: 'Instruments', to: '/instruments' },
    { icon: FileText, label: 'VC', to: '/VC' },
    { icon: Microscope, label: 'Macrobs', to: '/macrobs' },
    { icon: GitBranch, label: 'Version Control', to: '/vc' },
];

const CollapsibleSideNav = () => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <nav
            className={cn(
                'fixed left-0 top-0 h-screen bg-white border-r border-gray-200',
                'transition-all duration-300 z-10',
                isExpanded ? 'w-48' : 'w-16'
            )}
        >
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className={cn(
                    'absolute -right-3 top-6',
                    'p-1 rounded-full shadow-sm',
                    'bg-white border border-gray-200',
                    'hover:bg-gray-50 transition-colors'
                )}
            >
                {isExpanded ? (
                    <ChevronLeft className="h-4 w-4 text-gray-600" />
                ) : (
                    <ChevronRight className="h-4 w-4 text-gray-600" />
                )}
            </button>

            <div className="pt-16 px-2 space-y-1">
                {navItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        className={({ isActive }) =>
                            cn(
                                'flex items-center gap-3 px-3 py-2 rounded-md relative group',
                                'transition-colors duration-200',
                                isActive
                                    ? 'bg-primary-50 text-primary-600'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            )
                        }
                    >
                        <item.icon className="w-5 h-5 shrink-0" />
                        {isExpanded ? (
                            <span className="text-sm font-medium truncate">{item.label}</span>
                        ) : (
                            <div className={cn(
                                'absolute left-full ml-2 px-2 py-1',
                                'bg-gray-900 text-white text-xs rounded',
                                'opacity-0 pointer-events-none',
                                'group-hover:opacity-100 group-hover:pointer-events-auto',
                                'transition-opacity duration-200',
                                'whitespace-nowrap z-20'
                            )}>
                                {item.label}
                            </div>
                        )}
                    </NavLink>
                ))}
            </div>
        </nav>
    );
};

export default CollapsibleSideNav;