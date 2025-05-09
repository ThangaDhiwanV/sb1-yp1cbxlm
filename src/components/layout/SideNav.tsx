import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Database, Microscope, Boxes, Settings, FolderTree } from 'lucide-react';
import { cn } from '../../utils/cn';
import Tooltip from '../common/Tooltip';

const navItems = [
    { id: 'explorer', label: 'Explorer', icon: FolderTree, path: '/' },
    { id: 'project', label: 'Project', icon: Home, path: '/project' },
    { id: 'instruments', label: 'Instruments', icon: Boxes, path: '/instruments' },
    { id: 'macros', label: 'Macros', icon: Database, path: '/macros' },
    { id: 'virtual-bench', label: 'Virtual Bench', icon: Microscope, path: '/virtual-bench' },
];

const SideNav: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <>
            <header className={cn(
                "fixed top-0 left-0 right-0 h-14 z-30",
                "bg-white border-b border-gray-200",
                "flex items-center justify-between px-6",
                "bg-gradient-to-r from-white to-gray-50"
            )}>
                <h1 className={cn(
                    "text-xl font-bold tracking-tight",
                    "bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent"
                )}>
                    Instrument Hub
                </h1>
                <Tooltip content="Settings" placement="left">
                    <button
                        onClick={() => navigate('/settings')}
                        className={cn(
                            "p-2 rounded-lg transition-all duration-200",
                            "hover:bg-gray-100 active:bg-gray-200",
                            "focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                        )}
                    >
                        <Settings className="w-5 h-5 text-gray-600" />
                    </button>
                </Tooltip>
            </header>

            <nav className={cn(
                "w-16 fixed left-0 top-14 bottom-0 z-20",
                "bg-white border-r border-gray-200",
                "flex flex-col items-center py-4",
                "shadow-[1px_0_5px_0_rgba(0,0,0,0.05)]"
            )}>
                <div className="flex-1 w-full">
                    <ul className="space-y-2 px-2">
                        {navItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            
                            return (
                                <li key={item.id}>
                                    <Tooltip content={item.label} placement="right">
                                        <button
                                            onClick={() => navigate(item.path)}
                                            className={cn(
                                                "w-full p-2.5 rounded-lg",
                                                "transition-all duration-200",
                                                "group relative",
                                                "hover:bg-primary-50/80",
                                                "active:bg-primary-100/80",
                                                "focus:outline-none focus:ring-2 focus:ring-primary-500/20",
                                                isActive && cn(
                                                    "bg-primary-50",
                                                    "before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2",
                                                    "before:w-0.5 before:h-5 before:bg-primary-500",
                                                    "before:rounded-r-full"
                                                )
                                            )}
                                        >
                                            <item.icon className={cn(
                                                "w-5 h-5 mx-auto",
                                                "transition-colors duration-200",
                                                isActive
                                                    ? "text-primary-600"
                                                    : "text-gray-500 group-hover:text-primary-500"
                                            )} />
                                        </button>
                                    </Tooltip>
                                </li>
                            );
                        })}
                    </ul>
                </div>

                <div className={cn(
                    "px-3 py-2 mt-auto",
                    "text-[10px] font-medium",
                    "text-gray-400",
                    "bg-gradient-to-t from-gray-50/50"
                )}>
                    v1.0.0
                </div>
            </nav>
        </>
    );
};

export default SideNav;