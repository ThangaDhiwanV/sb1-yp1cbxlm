import React from 'react';
import ProjectCard from './ProjectCard';
import { Project } from '../../types';

interface ProjectsGridProps {
  projects: Project[];
  onProjectClick: (projectId: string) => void;
}

const ProjectsGrid: React.FC<ProjectsGridProps> = ({ projects, onProjectClick }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          onClick={onProjectClick}
        />
      ))}
    </div>
  );
};

export default ProjectsGrid;