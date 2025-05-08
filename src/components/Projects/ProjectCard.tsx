import React from 'react';
import { Project } from '../../types';

interface ProjectCardProps {
  project: Project;
  onClick: (projectId: string) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick }) => {
  return (
    <div 
      className="card p-5 h-48 cursor-pointer hover:translate-y-[-5px]"
      onClick={() => onClick(project.id)}
    >
      <div className="flex flex-col items-center justify-center h-full">
        <h3 className="text-xl font-medium">{project.name}</h3>
      </div>
    </div>
  );
};

export default ProjectCard;