import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout/Layout';
import SearchBar from '../components/UI/SearchBar';
import FilterSortControls from '../components/UI/FilterSortControls';
import ModulesGrid from '../components/Modules/ModulesGrid';
import { projects, sidebarItems } from '../data/mockData';
import { Project, Module, SidebarItem } from '../types';

interface ProjectDetailPageProps {
  projectId: string;
  onBack: () => void;
}

const ProjectDetailPage: React.FC<ProjectDetailPageProps> = ({ 
  projectId, 
  onBack 
}) => {
  const [project, setProject] = useState<Project | null>(null);
  const [filteredModules, setFilteredModules] = useState<Module[]>([]);
  const [items, setItems] = useState<SidebarItem[]>(sidebarItems);

  useEffect(() => {
    const foundProject = projects.find(p => p.id === projectId);
    if (foundProject) {
      setProject(foundProject);
      setFilteredModules(foundProject.modules);
    }
  }, [projectId]);

  const handleSearch = (query: string) => {
    if (!project) return;
    
    if (!query.trim()) {
      setFilteredModules(project.modules);
      return;
    }
    
    const filtered = project.modules.filter(module => 
      module.type.toLowerCase().includes(query.toLowerCase()) ||
      module.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredModules(filtered);
  };

  const handleFilter = () => {
    // Implement filtering logic here
    console.log('Filter clicked');
  };

  const handleSort = () => {
    // Implement sorting logic here
    console.log('Sort clicked');
  };

  const handleModuleClick = (moduleId: string) => {
    // Implement module click logic here
    console.log('Module clicked:', moduleId);
  };

  const handleCreateClick = () => {
    // Implement create module logic here
    console.log('Create Icon clicked');
  };

  const handleSidebarItemClick = (itemId: string) => {
    const updatedItems = items.map(item => ({
      ...item,
      isActive: item.id === itemId
    }));
    setItems(updatedItems);
  };

  if (!project) {
    return <div>Loading...</div>;
  }

  return (
    <Layout 
      title={project.name}
      sidebarItems={items}
      onSidebarItemClick={handleSidebarItemClick}
    >
      <div className="mb-6 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        <SearchBar onSearch={handleSearch} />
        <FilterSortControls onFilter={handleFilter} onSort={handleSort} />
      </div>
      <ModulesGrid 
        modules={filteredModules} 
        onModuleClick={handleModuleClick} 
        onCreateClick={handleCreateClick}
      />
    </Layout>
  );
};

export default ProjectDetailPage;