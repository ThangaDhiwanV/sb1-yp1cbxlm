import React, { useState } from 'react';
import { X, Download, Library, FileCode, Minimize2, Maximize2 } from 'lucide-react';
import { toast } from 'sonner';
import Button from './Button';
import Card from './Card';

interface CreationSliderProps {
    isOpen: boolean;
    onClose: () => void;
}

type TabType = 'hal' | 'driver';
type PreviewType = 'document' | 'generated';

// Instrument types
type InstrumentType = 'DMM' | 'SMU' | 'Power Supply' | 'Oscilloscope';

// Add interfaces for the collapsible sections
interface Section {
    id: string;
    title: string;
    isExpanded: boolean;
}

// Enhanced driver data interface
interface DriverData {
    technology: string;
    instrumentType: InstrumentType | '';
    modelName: string;
    file: File | null;
    functions: string[];
    isGenerated: boolean;
    previewContent: string | null;
    abstractPreview: string | null;
}

// Separate interfaces for HAL and Driver data
interface HalData {
    technology: string;
    document: string;
    isGenerated: boolean;
    documentPreview: string | null;
    generatedPreview: string | null;
    previewType: PreviewType;
}

// Mock data constants
const technologies = ['Python', 'TypeScript', 'C++', 'Java'];
const documents = ['SCPI Manual', 'IVI Manual', 'Programming Guide', 'User Manual'] as const;
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

// Add type for the document content mapping
type DocumentType = typeof documents[number];

// Type for the document content mapping
type DocumentContent = Record<DocumentType, string>;

const instrumentTypes: InstrumentType[] = ['DMM', 'SMU', 'Power Supply', 'Oscilloscope'];

const mockAbstractCode = {
    'DMM': `abstract class DMMDriver {
    abstract initialize(): Promise<boolean>;
    abstract measure(type: 'voltage' | 'current' | 'resistance'): Promise<number>;
    abstract autoRange(enable: boolean): Promise<void>;
    abstract setRange(range: number): Promise<void>;
}`,
    'SMU': `abstract class SMUDriver {
    abstract initialize(): Promise<boolean>;
    abstract sourceVoltage(voltage: number): Promise<void>;
    abstract sourceCurrent(current: number): Promise<void>;
    abstract measure(type: 'voltage' | 'current'): Promise<number>;
    abstract setCompliance(value: number): Promise<void>;
}`,
    'Power Supply': `abstract class PowerSupplyDriver {
    abstract initialize(): Promise<boolean>;
    abstract setVoltage(voltage: number): Promise<void>;
    abstract setCurrent(current: number): Promise<void>;
    abstract enableOutput(enable: boolean): Promise<void>;
    abstract readOutput(): Promise<{ voltage: number; current: number }>;
}`,
    'Oscilloscope': `abstract class OscilloscopeDriver {
    abstract initialize(): Promise<boolean>;
    abstract setTimebase(scale: number): Promise<void>;
    abstract setTrigger(level: number, source: string): Promise<void>;
    abstract acquire(): Promise<number[]>;
    abstract autoScale(): Promise<void>;
}`
};

const CreationSlider: React.FC<CreationSliderProps> = ({ isOpen, onClose }) => {
    const [activeTab, setActiveTab] = useState<TabType>('hal');

    // Remove previewRef and handleScroll since we're using mouse scrolling

    // Separate state for HAL and Driver
    const [halData, setHalData] = useState<HalData>({
        technology: '',
        document: '',
        isGenerated: false,
        documentPreview: null,
        generatedPreview: null,
        previewType: 'document'
    });

    // Enhanced driver state
    const [driverData, setDriverData] = useState<DriverData>({
        technology: '',
        instrumentType: '',
        modelName: '',
        file: null,
        functions: [],
        isGenerated: false,
        previewContent: null,
        abstractPreview: null
    });

    // Sections state for driver creation
    const [sections, setSections] = useState<Section[]>([
        { id: 'model', title: 'Model Selection', isExpanded: true },
        { id: 'manual', title: 'Manual Upload', isExpanded: true },
        { id: 'methods', title: 'Methods Selection', isExpanded: true }
    ]);

    // Mock document content
    const documentContent: DocumentContent = {
        'SCPI Manual': `SCPI Command Reference Manual
--------------------------------

1. Initialization Commands
   - *RST: Reset device to default state
   - *CLS: Clear status registers

2. Measurement Commands
   - MEASure:VOLTage?
   - MEASure:CURRent?

3. Configuration Commands
   - CONFigure:VOLTage
   - CONFigure:CURRent`,

        'IVI Manual': `IVI Driver Manual
---------------

1. Driver Overview
   - Initialization
   - Error handling
   - Resource management

2. API Reference
   - Initialize()
   - Configure()
   - Measure()`,

        'Programming Guide': `Instrument Programming Guide
-------------------------

1. Getting Started
   - Device connection
   - Basic measurements
   - Error handling

2. Advanced Features
   - Triggering
   - Data logging
   - System integration`,

        'User Manual': `Instrument User Manual
-------------------

1. Installation
   - Hardware setup
   - Software installation
   - Initial configuration

2. Operation
   - Basic measurements
   - Advanced features
   - Troubleshooting`
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setDriverData(prev => ({
                ...prev,
                file,
                previewContent: null,
                isGenerated: false
            }));

            // Read and preview the file content
            const reader = new FileReader();
            reader.onload = (e) => {
                setDriverData(prev => ({
                    ...prev,
                    previewContent: e.target?.result as string
                }));
            };
            reader.readAsText(file);
        }
    };

    const handleDocumentSelect = (document: DocumentType) => {
        setHalData(prev => ({
            ...prev,
            document,
            documentPreview: documentContent[document] || null,
            isGenerated: false,
            generatedPreview: null,
            previewType: 'document'
        }));
    };

    const canGenerate = () => {
        if (activeTab === 'hal') {
            return halData.technology !== '' && halData.document !== '';
        }
        return (
            driverData.technology !== '' &&
            driverData.instrumentType !== '' &&
            driverData.modelName.trim() !== '' &&
            driverData.file !== null &&
            driverData.functions.length > 0
        );
    };

    const handleGenerate = () => {
        if (!canGenerate()) {
            toast.error(activeTab === 'hal'
                ? 'Please select both technology and document'
                : 'Please select technology, upload a manual, and select at least one function'
            );
            return;
        }

        if (activeTab === 'hal') {
            const generatedCode = `// Generated HAL content for ${halData.document}
// Technology: ${halData.technology}

class ${halData.document.replace(/\s+/g, '')}HAL {
    constructor() {
        this.initialized = false;
    }

    initialize() {
        this.initialized = true;
        return true;
    }

    // Methods generated from ${halData.document}:
    ${halData.document.includes('SCPI') ? `
    async measureVoltage() {
        return this.query('MEAS:VOLT?');
    }

    async measureCurrent() {
        return this.query('MEAS:CURR?');
    }` : ''}
    ${halData.document.includes('IVI') ? `
    async configure(parameter: string, value: number) {
        return this.write(\`CONF:\${parameter} \${value}\`);
    }

    async measure(parameter: string) {
        return this.query(\`MEAS:\${parameter}?\`);
    }` : ''}
}`;

            setHalData(prev => ({
                ...prev,
                isGenerated: true,
                generatedPreview: generatedCode,
                previewType: 'generated'
            }));

        } else {
            const preview = `// Generated Driver for ${driverData.file?.name}
// Technology: ${driverData.technology}
// Selected Functions:
${driverData.functions.map(f => `// - ${f}`).join('\n')}

class InstrumentDriver {
    constructor() {
        this.connected = false;
    }

    ${driverData.functions.join('\n\n    ')}
}`;
            setDriverData(prev => ({
                ...prev,
                isGenerated: true,
                previewContent: preview
            }));
        }

        toast.success(`Generating ${activeTab === 'hal' ? 'HAL' : 'Driver'} for ${activeTab === 'hal' ? halData.technology : driverData.technology}...`);
    };

    const handleTabChange = (tab: TabType) => {
        setActiveTab(tab);
    };

    const handleSelectAll = (checked: boolean) => {
        setDriverData(prev => ({
            ...prev,
            functions: checked ? mockFunctions : [],
            isGenerated: false,
            previewContent: null
        }));
    };

    const handleFunctionToggle = (func: string) => {
        setDriverData(prev => ({
            ...prev,
            functions: prev.functions.includes(func)
                ? prev.functions.filter(f => f !== func)
                : [...prev.functions, func],
            isGenerated: false,
            previewContent: null
        }));
    };

    // Section toggle handler
    const toggleSection = (sectionId: string) => {
        setSections(prev => prev.map(section =>
            section.id === sectionId
                ? { ...section, isExpanded: !section.isExpanded }
                : section
        ));
    };

    // Handle instrument type selection
    const handleInstrumentTypeSelect = (type: InstrumentType) => {
        setDriverData(prev => ({
            ...prev,
            instrumentType: type,
            abstractPreview: mockAbstractCode[type],
            isGenerated: false,
            functions: [] // Reset functions when instrument type changes
        }));
    };

    return (
        <div
            className={`fixed inset-y-0 right-0 w-[800px] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 flex ${isOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
        >
            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0">
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

                <div className="flex border-b">
                    <button
                        className={`flex-1 py-3 text-center font-medium ${activeTab === 'hal'
                            ? 'text-primary-600 border-b-2 border-primary-600'
                            : 'text-gray-500 hover:text-gray-700'
                            }`}
                        onClick={() => handleTabChange('hal')}
                    >
                        HAL Creation
                    </button>
                    <button
                        className={`flex-1 py-3 text-center font-medium ${activeTab === 'driver'
                            ? 'text-primary-600 border-b-2 border-primary-600'
                            : 'text-gray-500 hover:text-gray-700'
                            }`}
                        onClick={() => handleTabChange('driver')}
                    >
                        Driver Creation
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {/* Form Section - now takes full width */}
                    <div className="w-full p-4">
                        <div className="space-y-4">
                            {/* Technology Selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Select Technology
                                </label>
                                <select
                                    value={activeTab === 'hal' ? halData.technology : driverData.technology}
                                    onChange={(e) => {
                                        if (activeTab === 'hal') {
                                            setHalData(prev => ({
                                                ...prev,
                                                technology: e.target.value,
                                                isGenerated: false,
                                                generatedPreview: null
                                            }));
                                        } else {
                                            setDriverData(prev => ({
                                                ...prev,
                                                technology: e.target.value,
                                                isGenerated: false,
                                                previewContent: null
                                            }));
                                        }
                                    }}
                                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary-500"
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
                                        Select Instrument Document
                                    </label>
                                    <select
                                        value={halData.document as DocumentType}
                                        onChange={(e) => handleDocumentSelect(e.target.value as DocumentType)}
                                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary-500"
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
                                        Select Instrument Type
                                    </label>
                                    <select
                                        value={driverData.instrumentType}
                                        onChange={(e) => handleInstrumentTypeSelect(e.target.value as InstrumentType)}
                                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary-500"
                                    >
                                        <option value="">Choose instrument type...</option>
                                        {instrumentTypes.map(type => (
                                            <option key={type} value={type}>{type}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {/* Collapsible Sections for Driver */}
                            {activeTab === 'driver' && driverData.technology && driverData.instrumentType && (
                                <>
                                    {/* Model Selection Section */}
                                    <Card className="overflow-hidden">
                                        <div
                                            className="flex items-center justify-between p-3 bg-gray-50 cursor-pointer"
                                            onClick={() => toggleSection('model')}
                                        >
                                            <h3 className="font-medium">Model Selection</h3>
                                            {sections.find(s => s.id === 'model')?.isExpanded
                                                ? <Minimize2 className="h-4 w-4" />
                                                : <Maximize2 className="h-4 w-4" />
                                            }
                                        </div>
                                        {sections.find(s => s.id === 'model')?.isExpanded && (
                                            <div className="p-3">
                                                <input
                                                    type="text"
                                                    placeholder="Enter model name..."
                                                    value={driverData.modelName}
                                                    onChange={(e) => setDriverData(prev => ({
                                                        ...prev,
                                                        modelName: e.target.value
                                                    }))}
                                                    className="w-full p-2 border rounded-md"
                                                />
                                            </div>
                                        )}
                                    </Card>

                                    {/* Manual Upload Section */}
                                    <Card className="overflow-hidden">
                                        <div
                                            className="flex items-center justify-between p-3 bg-gray-50 cursor-pointer"
                                            onClick={() => toggleSection('manual')}
                                        >
                                            <h3 className="font-medium">Manual Upload</h3>
                                            {sections.find(s => s.id === 'manual')?.isExpanded
                                                ? <Minimize2 className="h-4 w-4" />
                                                : <Maximize2 className="h-4 w-4" />
                                            }
                                        </div>
                                        {sections.find(s => s.id === 'manual')?.isExpanded && (
                                            <div className="p-3">
                                                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                                    <div className="space-y-1 text-center">
                                                        <div className="flex text-sm text-gray-600">
                                                            <label className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500">
                                                                <span>Upload a file</span>
                                                                <input
                                                                    type="file"
                                                                    className="sr-only"
                                                                    onChange={handleFileChange}
                                                                    accept=".pdf,.doc,.docx,.txt"
                                                                />
                                                            </label>
                                                        </div>
                                                        {driverData.file && (
                                                            <p className="text-sm text-gray-500">{driverData.file.name}</p>
                                                        )}
                                                        <p className="text-xs text-gray-500">PDF, DOC, or TXT up to 10MB</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </Card>

                                    {/* Methods Selection Section */}
                                    <Card className="overflow-hidden">
                                        <div
                                            className="flex items-center justify-between p-3 bg-gray-50 cursor-pointer"
                                            onClick={() => toggleSection('methods')}
                                        >
                                            <h3 className="font-medium">Methods Selection</h3>
                                            {sections.find(s => s.id === 'methods')?.isExpanded
                                                ? <Minimize2 className="h-4 w-4" />
                                                : <Maximize2 className="h-4 w-4" />
                                            }
                                        </div>
                                        {sections.find(s => s.id === 'methods')?.isExpanded && (
                                            <div className="p-3">
                                                <div className="space-y-2">
                                                    <div className="flex items-center">
                                                        <input
                                                            type="checkbox"
                                                            checked={driverData.functions.length === mockFunctions.length}
                                                            onChange={(e) => handleSelectAll(e.target.checked)}
                                                            className="h-4 w-4 text-primary-600 rounded"
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
                                                                    checked={driverData.functions.includes(func)}
                                                                    onChange={() => handleFunctionToggle(func)}
                                                                    className="h-4 w-4 text-primary-600 rounded"
                                                                />
                                                                <label className="ml-2 text-sm text-gray-600">
                                                                    {func}
                                                                </label>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </Card>
                                </>
                            )}

                            {/* Generate Button */}
                            <Button
                                onClick={handleGenerate}
                                className="w-full"
                                disabled={!canGenerate()}
                            >
                                <FileCode className="h-4 w-4 mr-2" />
                                Generate {activeTab === 'hal' ? 'HAL' : 'Driver'}
                            </Button>

                            {/* Action Buttons */}
                            {activeTab === 'hal' ? (
                                <div className="mt-4 flex gap-2">
                                    <Button
                                        variant="outline"
                                        className="flex-1"
                                        disabled={!halData.isGenerated}
                                    >
                                        <Library className="h-4 w-4 mr-2" />
                                        Add to Library
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="flex-1"
                                        disabled={!halData.isGenerated}
                                    >
                                        <Download className="h-4 w-4 mr-2" />
                                        Download HAL
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="flex-1"
                                        disabled={!halData.isGenerated}
                                    >
                                        <Download className="h-4 w-4 mr-2" />
                                        Download API
                                    </Button>
                                </div>
                            ) : (
                                <div className="mt-4 flex gap-2">
                                    <Button
                                        variant="outline"
                                        className="flex-1"
                                        disabled={!driverData.isGenerated}
                                    >
                                        <Library className="h-4 w-4 mr-2" />
                                        Add to Library
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="flex-1"
                                        disabled={!driverData.isGenerated}
                                    >
                                        <Download className="h-4 w-4 mr-2" />
                                        Download Driver
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreationSlider;