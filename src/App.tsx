import React, { useState } from 'react';
import ProjectsPage from './pages/ProjectsPage';
import ProjectDetailPage from './pages/ProjectDetailPage';

function App() {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  const handleProjectClick = (projectId: string) => {
    setSelectedProjectId(projectId);
  };

  const handleBackToProjects = () => {
    setSelectedProjectId(null);
  };

  return (
    <div className="min-h-screen bg-white">
      {selectedProjectId ? (
        <ProjectDetailPage 
          projectId={selectedProjectId} 
          onBack={handleBackToProjects} 
        />
      ) : (
        <ProjectsPage onProjectClick={handleProjectClick} />
      )}
    </div>
  );
}

export default App;