import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Cpu, Code2, Database, Ruler, Battery, Zap, GitBranch } from 'lucide-react';
import { cn } from '../../utils/cn';
import Tooltip from '../common/Tooltip';

const navItems = [
    { id: 'project', label: 'Dashboard', icon: Home, path: '/' },
    { id: 'instruments', label: 'Instruments', icon: Cpu, path: '/instruments', 
      subItems: [
        { id: 'smu', label: 'SMU', icon: Zap },
        { id: 'dmm', label: 'DMM', icon: Ruler },
        { id: 'power', label: 'Power Supply', icon: Battery }
      ]
    },
    { id: 'macrobs', label: 'Macros', icon: Database, path: '/macrobs' },
    { id: 'vc', label: 'Version Control', icon: GitBranch, path: '/vc' },
    { id: 'code', label: 'Code Editor', icon: Code2, path: '/code' }
];

const SideNav: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <>
            {/* Title Bar */}
            <header className="fixed top-0 left-0 right-0 h-12 bg-white border-b border-gray-200 shadow-sm flex items-center justify-between px-4 z-30">
                <h1 className="text-lg font-semibold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                    Instrument Management
                </h1>
                <Tooltip content="User Profile" placement="left">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center text-primary-600 font-medium cursor-pointer hover:from-primary-200 hover:to-secondary-200 transition-all">
                        <span className="text-sm">P</span>
                    </div>
                </Tooltip>
            </header>

            {/* Side Navigation */}
            <div className="w-14 bg-white border-r border-gray-200/60 fixed left-0 top-12 bottom-0 flex flex-col items-center py-3 shadow-sm z-20">
                <nav className="flex-1 w-full">
                    <ul className="space-y-1 px-2">
                        {navItems.map((item) => (
                            <li key={item.id} className="relative group">
                                <Tooltip content={item.label} placement="right">
                                    <button
                                        onClick={() => navigate(item.path)}
                                        className={cn(
                                            'w-full flex items-center justify-center p-2 rounded-lg',
                                            'transition-all duration-200 ease-in-out',
                                            location.pathname === item.path
                                                ? 'bg-gradient-to-br from-primary-50 to-secondary-50 text-primary-600'
                                                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                                        )}
                                    >
                                        <item.icon className="w-4 h-4" />
                                    </button>
                                </Tooltip>

                                {/* Sub-items dropdown for Instruments */}
                                {item.subItems && (
                                    <div className={cn(
                                        'absolute left-full top-0 ml-2 py-1 w-32',
                                        'bg-white rounded-lg shadow-lg border border-gray-200/60',
                                        'invisible opacity-0 translate-x-2 group-hover:visible group-hover:opacity-100 group-hover:translate-x-0',
                                        'transition-all duration-200 ease-in-out'
                                    )}>
                                        {item.subItems.map((subItem) => (
                                            <button
                                                key={subItem.id}
                                                className={cn(
                                                    'w-full flex items-center gap-2 px-3 py-1.5',
                                                    'text-sm text-gray-600 hover:text-gray-900',
                                                    'hover:bg-gray-50 transition-colors'
                                                )}
                                                onClick={() => navigate(`/instruments?type=${subItem.id}`)}
                                            >
                                                <subItem.icon className="w-3.5 h-3.5" />
                                                <span>{subItem.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Version Tag */}
                <div className="text-[10px] text-gray-400 mt-auto pb-2">
                    v1.0.0
                </div>
            </div>
        </>
    );
};

export default SideNav;