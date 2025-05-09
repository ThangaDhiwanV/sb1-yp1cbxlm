import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, FolderTree, Microscope, Database, Boxes, User } from 'lucide-react';
import { cn } from '../../utils/cn';
import Tooltip from '../common/Tooltip';

const navItems = [
    { id: 'project', label: 'Project', icon: Home, path: '/project' },
    { id: 'explorer', label: 'Explorer', icon: FolderTree, path: '/explorer' },
    { id: 'virtual-bench', label: 'Virtual Bench', icon: Microscope, path: '/virtual-bench' },
    { id: 'macros', label: 'Macros', icon: Database, path: '/macros' },
    { id: 'instruments', label: 'Instruments', icon: Boxes, path: '/instruments' },
];

const SideNav: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const userName = "JOHN DOE";

    return (
        <>
            <header className={cn(
                "fixed top-0 left-0 right-0 h-16 z-30",
                "bg-white border-b border-gray-200",
                "flex items-center justify-between px-6",
                "bg-gradient-to-r from-white to-gray-50"
            )}>
                <h1 className={cn(
                    "text-xl font-bold tracking-tight",
                    "bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent"
                )}>
                    Instrument 360
                </h1>
                
                <div className="flex items-center">
                    <button
                        className={cn(
                            "flex items-center gap-3 px-4 py-2 rounded-xl",
                            "bg-gradient-to-br from-white to-gray-50",
                            "border border-gray-200/80",
                            "hover:border-primary-200 hover:bg-primary-50/50",
                            "active:bg-primary-100/50",
                            "transition-all duration-300",
                            "group"
                        )}
                    >
                        <div className={cn(
                            "w-8 h-8 rounded-lg",
                            "bg-gradient-to-br from-primary-500/10 to-primary-600/10",
                            "flex items-center justify-center",
                            "group-hover:from-primary-500/20 group-hover:to-primary-600/20",
                            "transition-all duration-300"
                        )}>
                            <User className="w-5 h-5 text-primary-600" />
                        </div>
                        <span className="font-medium text-gray-700">{userName}</span>
                    </button>
                </div>
            </header>

            <nav className={cn(
                "w-20 fixed left-0 top-16 bottom-0 z-20",
                "bg-white border-r border-gray-200",
                "flex flex-col items-center py-6",
                "shadow-[1px_0_5px_0_rgba(0,0,0,0.05)]"
            )}>
                <div className="flex-1 w-full">
                    <ul className="space-y-4 px-3">
                        {navItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            
                            return (
                                <li key={item.id}>
                                    <Tooltip content={item.label} placement="right">
                                        <button
                                            onClick={() => navigate(item.path)}
                                            className={cn(
                                                "w-full p-3.5 rounded-xl",
                                                "transition-all duration-300",
                                                "group relative",
                                                "hover:bg-primary-50/80",
                                                "active:bg-primary-100/80",
                                                "focus:outline-none focus:ring-2 focus:ring-primary-500/20",
                                                isActive && cn(
                                                    "bg-primary-50",
                                                    "before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2",
                                                    "before:w-1 before:h-8 before:bg-primary-500",
                                                    "before:rounded-r-full"
                                                )
                                            )}
                                        >
                                            <item.icon className={cn(
                                                "w-8 h-8 mx-auto",
                                                "transition-all duration-300",
                                                isActive
                                                    ? "text-primary-600 transform scale-110"
                                                    : "text-gray-500 group-hover:text-primary-500 group-hover:scale-110"
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