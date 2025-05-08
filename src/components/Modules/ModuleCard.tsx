import React from 'react';
import ActionButtons from '../UI/ActionButtons';
import { Module } from '../../types';

interface ModuleCardProps {
  module: Module;
  onClick: (moduleId: string) => void;
}

const ModuleCard: React.FC<ModuleCardProps> = ({ module, onClick }) => {
  const isEmpty = !module.type;

  const handleDocClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Handle Doc button click
    console.log('Doc clicked for module:', module.id);
  };

  const handleHalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Handle HAL button click
    console.log('HAL clicked for module:', module.id);
  };

  const handleApiClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Handle API button click
    console.log('API clicked for module:', module.id);
  };

  if (isEmpty) {
    return (
      <div 
        className="card module-card cursor-pointer hover:translate-y-[-5px]"
        onClick={() => onClick(module.id)}
      >
        {/* Empty module card */}
      </div>
    );
  }

  return (
    <div 
      className={`card module-card cursor-pointer hover:translate-y-[-5px] ${module.highlighted ? 'highlighted' : ''}`}
      onClick={() => onClick(module.id)}
    >
      <div className="mb-4">
        <h3 className="text-xl font-medium">{module.type} – {module.icon}</h3>
        <p className="mt-2">No. of Drivers - {`<${module.driverCount}>`}</p>
      </div>
      <ActionButtons
        onDocClick={handleDocClick}
        onHalClick={handleHalClick}
        onApiClick={handleApiClick}
      />
    </div>
  );
};

export default ModuleCard;