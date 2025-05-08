import React, { useState } from 'react';
import Layout from '../components/Layout/Layout';
import SearchBar from '../components/UI/SearchBar';
import FilterSortControls from '../components/UI/FilterSortControls';
import ProjectsGrid from '../components/Projects/ProjectsGrid';
import { projects, sidebarItems } from '../data/mockData';
import { SidebarItem } from '../types';

interface ProjectsPageProps {
  onProjectClick: (projectId: string) => void;
}

const ProjectsPage: React.FC<ProjectsPageProps> = ({ onProjectClick }) => {
  const [filteredProjects, setFilteredProjects] = useState(projects);
  const [items, setItems] = useState<SidebarItem[]>(sidebarItems);

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setFilteredProjects(projects);
      return;
    }
    
    const filtered = projects.filter(project => 
      project.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredProjects(filtered);
  };

  const handleFilter = () => {
    // Implement filtering logic here
    console.log('Filter clicked');
  };

  const handleSort = () => {
    // Implement sorting logic here
    console.log('Sort clicked');
  };

  const handleSidebarItemClick = (itemId: string) => {
    const updatedItems = items.map(item => ({
      ...item,
      isActive: item.id === itemId
    }));
    setItems(updatedItems);
  };

  return (
    <Layout 
      title="Projects" 
      sidebarItems={items} 
      onSidebarItemClick={handleSidebarItemClick}
    >
      <div className="mb-6 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        <SearchBar onSearch={handleSearch} />
        <FilterSortControls onFilter={handleFilter} onSort={handleSort} />
      </div>
      <ProjectsGrid projects={filteredProjects} onProjectClick={onProjectClick} />
    </Layout>
  );
};

export default ProjectsPage;