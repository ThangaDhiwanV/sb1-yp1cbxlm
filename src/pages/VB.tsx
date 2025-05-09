import React from 'react';
import { Microscope } from 'lucide-react';

const VB: React.FC = () => {
    return (
        <div className="min-h-screen p-6">
            <div className="max-w-2xl mx-auto text-center">
                <div className="flex justify-center mb-6">
                    <Microscope className="w-20 h-20 text-indigo-500" />
                </div>
                <h1 className="text-3xl font-bold text-gray-800 mb-4">
                    Virtual Bench - Under Development
                </h1>
                <p className="text-gray-600 mb-8">
                    This feature is currently under development. We're building a comprehensive virtual bench system to help you control and monitor your instruments remotely.
                </p>
                <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-lg inline-block">
                    <p className="text-sm text-indigo-700">
                        Planned features:
                    </p>
                    <ul className="mt-2 text-sm text-indigo-600 text-left list-disc list-inside">
                        <li>Remote instrument control</li>
                        <li>Real-time monitoring</li>
                        <li>Virtual instrument panels</li>
                        <li>Data visualization</li>
                        <li>Automated testing sequences</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default VB;