import React from 'react';
import Breadcrumbs from '../components/common/Breadcrumbs';
import Button from '../components/common/Button';
import { Wrench } from 'lucide-react';
import { useCreationContext } from '../App';

const ProjectPage: React.FC = () => {
  const { setIsCreationSliderOpen } = useCreationContext();
  const breadcrumbItems = [
    { label: 'Project', href: '/' }
  ];

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <Breadcrumbs items={breadcrumbItems} />
            <Button
              onClick={() => setIsCreationSliderOpen(true)}
              className="flex items-center gap-2"
              isCreationButton
            >
              <Wrench className="h-4 w-4" />
              Create HAL/Driver
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col items-center justify-center h-[400px] p-6">
          <h3 className="text-lg font-medium text-gray-700 mb-4">Welcome to Project 1</h3>
          <p className="text-gray-600">Select a navigation item from the left sidebar to get started.</p>
        </div>
      </div>
    </div>
  );
};

export default ProjectPage;