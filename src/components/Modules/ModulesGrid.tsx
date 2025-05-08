import React from 'react';
import ModuleCard from './ModuleCard';
import { Module } from '../../types';
import { Plus } from 'lucide-react';

interface ModulesGridProps {
  modules: Module[];
  onModuleClick: (moduleId: string) => void;
  onCreateClick: () => void;
}

const ModulesGrid: React.FC<ModulesGridProps> = ({ 
  modules, 
  onModuleClick,
  onCreateClick
}) => {
  return (
    <div className="relative">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((module) => (
          <ModuleCard
            key={module.id}
            module={module}
            onClick={onModuleClick}
          />
        ))}
      </div>
      <button 
        className="absolute bottom-4 right-4 bg-[#1a698b] text-white py-2 px-4 rounded shadow-md hover:bg-[#155a77] transition-all duration-200 flex items-center space-x-2"
        onClick={onCreateClick}
      >
        <Plus size={18} />
        <span>Create Icon</span>
      </button>
    </div>
  );
};

export default ModulesGrid;