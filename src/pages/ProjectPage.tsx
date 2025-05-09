import React from 'react';
import Breadcrumbs from '../components/common/Breadcrumbs';

const ProjectPage: React.FC = () => {
    const breadcrumbItems = [
        { label: 'Project', href: '/' }
    ];

    return (
        <div className="min-h-screen">
            <div className="container mx-auto px-4 py-8">


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