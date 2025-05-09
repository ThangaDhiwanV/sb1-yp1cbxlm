import React from 'react';
import { Construction } from 'lucide-react';

const Macrobs: React.FC = () => {
    return (
        <div className="min-h-screen p-6">
            <div className="max-w-2xl mx-auto text-center">
                <div className="flex justify-center mb-6">
                    <Construction className="w-20 h-20 text-amber-500" />
                </div>
                <h1 className="text-3xl font-bold text-gray-800 mb-4">
                    Macrobs - Under Development
                </h1>
                <p className="text-gray-600 mb-8">
                    This feature is currently under development. We're working hard to bring you powerful macros and automation capabilities. Check back soon!
                </p>
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg inline-block">
                    <p className="text-sm text-amber-700">
                        Expected features:
                    </p>
                    <ul className="mt-2 text-sm text-amber-600 text-left list-disc list-inside">
                        <li>Record and playback automation sequences</li>
                        <li>Create custom macro scripts</li>
                        <li>Schedule automated tasks</li>
                        <li>Integrate with instrument controls</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Macrobs;