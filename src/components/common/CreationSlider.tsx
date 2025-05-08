import React, { useState } from 'react';
import { X, Download, Library, FileCode } from 'lucide-react';
import { toast } from 'sonner';
import Button from './Button';
import Card from './Card';

type TabType = 'hal' | 'driver';

interface CreationSliderProps {
    isOpen: boolean;
    onClose: () => void;
}

const CreationSlider: React.FC<CreationSliderProps> = ({ isOpen, onClose }) => {
    const [activeTab, setActiveTab] = useState<TabType>('hal');
    const [selectedTechnology, setSelectedTechnology] = useState('');
    const [selectedDocument, setSelectedDocument] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [selectedFunctions, setSelectedFunctions] = useState<string[]>([]);

    // Mock data
    const technologies = ['Python', 'TypeScript', 'C++', 'Java'];
    const documents = ['SCPI Manual', 'IVI Manual', 'Programming Guide', 'User Manual'];
    const mockFunctions = [
        'initialize()',
        'reset()',
        'selfTest()',
        'connect()',
        'disconnect()',
        'measure()',
        'configure()',
        'calibrate()',
    ];

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    const handleGenerate = () => {
        if (!selectedTechnology) {
            toast.error('Please select a technology');
            return;
        }

        if (activeTab === 'hal' && !selectedDocument) {
            toast.error('Please select a document');
            return;
        }

        if (activeTab === 'driver' && !selectedFile) {
            toast.error('Please upload a manual');
            return;
        }

        if (activeTab === 'driver' && selectedFunctions.length === 0) {
            toast.error('Please select at least one function');
            return;
        }

        toast.success(`Generating ${activeTab === 'hal' ? 'HAL' : 'Driver'} for ${selectedTechnology}...`);
    };

    const handleSelectAll = (checked: boolean) => {
        setSelectedFunctions(checked ? mockFunctions : []);
    };

    const handleFunctionToggle = (func: string) => {
        setSelectedFunctions(prev =>
            prev.includes(func)
                ? prev.filter(f => f !== func)
                : [...prev, func]
        );
    };

    return (
        <div
            className={`fixed inset-y-0 right-0 w-96 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${isOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
        >
            <div className="h-full flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-xl font-semibold">
                        {activeTab === 'hal' ? 'HAL Creation' : 'Driver Creation'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full"
                        aria-label="Close"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b">
                    <button
                        className={`flex-1 py-3 text-center font-medium ${activeTab === 'hal'
                            ? 'text-blue-600 border-b-2 border-blue-600'
                            : 'text-gray-500 hover:text-gray-700'
                            }`}
                        onClick={() => setActiveTab('hal')}
                    >
                        HAL Creation
                    </button>
                    <button
                        className={`flex-1 py-3 text-center font-medium ${activeTab === 'driver'
                            ? 'text-blue-600 border-b-2 border-blue-600'
                            : 'text-gray-500 hover:text-gray-700'
                            }`}
                        onClick={() => setActiveTab('driver')}
                    >
                        Driver Creation
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4">
                    <div className="space-y-4">
                        {/* Technology Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Select Technology
                            </label>
                            <select
                                value={selectedTechnology}
                                onChange={(e) => setSelectedTechnology(e.target.value)}
                                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Choose technology...</option>
                                {technologies.map(tech => (
                                    <option key={tech} value={tech}>{tech}</option>
                                ))}
                            </select>
                        </div>

                        {/* HAL Document Selection or Driver File Upload */}
                        {activeTab === 'hal' ? (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Select Document
                                </label>
                                <select
                                    value={selectedDocument}
                                    onChange={(e) => setSelectedDocument(e.target.value)}
                                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Choose document...</option>
                                    {documents.map(doc => (
                                        <option key={doc} value={doc}>{doc}</option>
                                    ))}
                                </select>
                            </div>
                        ) : (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Upload Manual
                                </label>
                                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                    <div className="space-y-1 text-center">
                                        <div className="flex text-sm text-gray-600">
                                            <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                                                <span>Upload a file</span>
                                                <input
                                                    type="file"
                                                    className="sr-only"
                                                    onChange={handleFileChange}
                                                />
                                            </label>
                                        </div>
                                        <p className="text-xs text-gray-500">PDF or DOC up to 10MB</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Driver-specific Function Selection */}
                        {activeTab === 'driver' && (
                            <Card className="p-4">
                                <div className="space-y-2">
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={selectedFunctions.length === mockFunctions.length}
                                            onChange={(e) => handleSelectAll(e.target.checked)}
                                            className="h-4 w-4 text-blue-600 rounded"
                                        />
                                        <label className="ml-2 text-sm font-medium text-gray-700">
                                            Select All Functions
                                        </label>
                                    </div>
                                    <div className="ml-4 space-y-1">
                                        {mockFunctions.map(func => (
                                            <div key={func} className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedFunctions.includes(func)}
                                                    onChange={() => handleFunctionToggle(func)}
                                                    className="h-4 w-4 text-blue-600 rounded"
                                                />
                                                <label className="ml-2 text-sm text-gray-600">
                                                    {func}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </Card>
                        )}

                        {/* Generate Button */}
                        <Button
                            onClick={handleGenerate}
                            className="w-full"
                        >
                            <FileCode className="h-4 w-4 mr-2" />
                            Generate {activeTab === 'hal' ? 'HAL' : 'Driver'}
                        </Button>

                        {/* Action Buttons */}
                        <div className="space-y-2">
                            <Button
                                variant="outline"
                                className="w-full"
                            >
                                <Library className="h-4 w-4 mr-2" />
                                Add to Library
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full"
                            >
                                <Download className="h-4 w-4 mr-2" />
                                Download {activeTab === 'hal' ? 'HAL' : 'Driver'}
                            </Button>
                            {activeTab === 'hal' && (
                                <Button
                                    variant="outline"
                                    className="w-full"
                                >
                                    <Download className="h-4 w-4 mr-2" />
                                    Download API
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreationSlider;