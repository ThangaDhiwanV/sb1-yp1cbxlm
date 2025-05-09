import React from 'react';
import { GitBranch } from 'lucide-react';

const VC: React.FC = () => {
    return (
        <div className="min-h-screen p-6">
            <div className="max-w-2xl mx-auto text-center">
                <div className="flex justify-center mb-6">
                    <GitBranch className="w-20 h-20 text-indigo-500" />
                </div>
                <h1 className="text-3xl font-bold text-gray-800 mb-4">
                    Version Control - Under Development
                </h1>
                <p className="text-gray-600 mb-8">
                    This feature is currently under development. We're building a robust version control system to help you manage your instrument configurations and settings effectively.
                </p>
                <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-lg inline-block">
                    <p className="text-sm text-indigo-700">
                        Planned features:
                    </p>
                    <ul className="mt-2 text-sm text-indigo-600 text-left list-disc list-inside">
                        <li>Track configuration changes</li>
                        <li>Compare and restore previous versions</li>
                        <li>Collaborate with team members</li>
                        <li>Branch and merge configuration sets</li>
                        <li>Audit trail and change history</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default VC;