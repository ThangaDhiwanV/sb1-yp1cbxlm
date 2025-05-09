import React, { useState, useEffect } from 'react';
import { X, Download, Library, FileCode, Minimize2, Maximize2, Upload, FileText } from 'lucide-react';
import { toast } from 'sonner';
import Button from './Button';
import Card from './Card';
import { cn } from '../../utils/cn';
import LoadingOverlay from './LoadingOverlay';
import { getTechStacks as getHalTechStacks, generateHal, addToLibrary as addHalToLibrary, downloadHal, downloadApi } from '../../api/halService';
import { getTechStacks as getDriverTechStacks, getHalClasses, generateDriver, addToLibrary as addDriverToLibrary, downloadDriver } from '../../api/driverService';

interface CreationSliderProps {
    isOpen: boolean;
    onClose: () => void;
}

type TabType = 'hal' | 'driver';
type PreviewType = 'document' | 'generated';

type InstrumentType = 'DMM' | 'SMU' | 'Power Supply' | 'Oscilloscope';

interface Section {
    id: string;
    title: string;
    isExpanded: boolean;
}

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

interface HalData {
    technology: string;
    document: string;
    isGenerated: boolean;
    documentPreview: string | null;
    generatedPreview: string | null;
    previewType: PreviewType;
    uploadedFile: File | null;
}

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

type DocumentType = typeof documents[number];

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
    const [isGenerating, setIsGenerating] = useState(false);
    const [techStacks, setTechStacks] = useState<string[]>([]);
    const [halClasses, setHalClasses] = useState<string[]>([]);

    useEffect(() => {
        const loadTechStacks = async () => {
            try {
                const stacks = await (activeTab === 'hal' ? getHalTechStacks() : getDriverTechStacks());
                setTechStacks(stacks);
            } catch (error) {
                console.error('Error loading tech stacks:', error);
                toast.error('Failed to load technology stacks');
            }
        };

        const loadHalClasses = async () => {
            if (activeTab === 'driver') {
                try {
                    const classes = await getHalClasses();
                    setHalClasses(classes);
                } catch (error) {
                    console.error('Error loading HAL classes:', error);
                    toast.error('Failed to load HAL classes');
                }
            }
        };

        loadTechStacks();
        loadHalClasses();
    }, [activeTab]);

    const [halData, setHalData] = useState<HalData>({
        technology: '',
        document: '',
        isGenerated: false,
        documentPreview: null,
        generatedPreview: null,
        previewType: 'document',
        uploadedFile: null
    });

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

    const [sections, setSections] = useState<Section[]>([
        { id: 'model', title: 'Model Selection', isExpanded: true },
        { id: 'manual', title: 'Manual Upload', isExpanded: true },
        { id: 'methods', title: 'Methods Selection', isExpanded: true }
    ]);

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
            if (activeTab === 'hal') {
                setHalData(prev => ({
                    ...prev,
                    uploadedFile: file,
                    documentPreview: null,
                    isGenerated: false
                }));

                const reader = new FileReader();
                reader.onload = (e) => {
                    setHalData(prev => ({
                        ...prev,
                        documentPreview: e.target?.result as string
                    }));
                };
                reader.readAsText(file);
            } else {
                setDriverData(prev => ({
                    ...prev,
                    file,
                    previewContent: null,
                    isGenerated: false
                }));

                const reader = new FileReader();
                reader.onload = (e) => {
                    setDriverData(prev => ({
                        ...prev,
                        previewContent: e.target?.result as string
                    }));
                };
                reader.readAsText(file);
            }
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
            return halData.technology !== '' && (halData.document !== '' || halData.uploadedFile !== null);
        }
        return (
            driverData.technology !== '' &&
            driverData.instrumentType !== '' &&
            driverData.modelName.trim() !== '' &&
            driverData.file !== null &&
            driverData.functions.length > 0
        );
    };

    const handleGenerate = async () => {
        if (!canGenerate()) {
            toast.error(activeTab === 'hal'
                ? 'Please select technology and either upload a file or select a document'
                : 'Please select technology, upload a manual, and select at least one function'
            );
            return;
        }

        setIsGenerating(true);
        
        try {
            if (activeTab === 'hal') {
                const result = await generateHal(
                    halData.document || halData.uploadedFile?.name || 'Unknown',
                    halData.technology
                );

                setHalData(prev => ({
                    ...prev,
                    isGenerated: true,
                    generatedPreview: result.abstract_class,
                    previewType: 'generated'
                }));
            } else {
                const result = await generateDriver({
                    instrumentName: driverData.instrumentType,
                    modelName: driverData.modelName,
                    functions: driverData.functions,
                    stack: driverData.technology,
                    manual: driverData.file || undefined
                });

                setDriverData(prev => ({
                    ...prev,
                    isGenerated: true,
                    previewContent: result.driver,
                    abstractPreview: result.abstractClass
                }));
            }

            toast.success(`${activeTab === 'hal' ? 'HAL' : 'Driver'} generated successfully!`);
        } catch (error) {
            console.error('Error generating code:', error);
            toast.error('Failed to generate code');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleAddToLibrary = async () => {
        try {
            if (activeTab === 'hal') {
                if (!halData.generatedPreview) {
                    toast.error('No HAL code to add to library');
                    return;
                }

                const success = await addHalToLibrary(
                    halData.document || halData.uploadedFile?.name || 'Unknown',
                    halData.generatedPreview
                );

                if (success) {
                    toast.success('HAL added to library successfully');
                } else {
                    toast.error('Failed to add HAL to library');
                }
            } else {
                if (!driverData.previewContent) {
                    toast.error('No driver code to add to library');
                    return;
                }

                const success = await addDriverToLibrary({
                    instrumentName: driverData.instrumentType,
                    modelName: driverData.modelName,
                    driver: driverData.previewContent
                });

                if (success) {
                    toast.success('Driver added to library successfully');
                } else {
                    toast.error('Failed to add driver to library');
                }
            }
        } catch (error) {
            console.error('Error adding to library:', error);
            toast.error('Failed to add to library');
        }
    };

    const handleDownload = async () => {
        try {
            if (activeTab === 'hal') {
                if (!halData.generatedPreview) {
                    toast.error('No HAL code to download');
                    return;
                }

                const blob = await downloadHal(
                    halData.document || halData.uploadedFile?.name || 'Unknown',
                    halData.generatedPreview
                );

                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `HAL_${halData.document || 'Unknown'}.py`;
                a.click();
                URL.revokeObjectURL(url);

                toast.success('HAL downloaded successfully');
            } else {
                if (!driverData.previewContent) {
                    toast.error('No driver code to download');
                    return;
                }

                const blob = await downloadDriver({
                    instrumentName: driverData.instrumentType,
                    modelName: driverData.modelName,
                    driver: driverData.previewContent
                });

                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${driverData.modelName}_Driver.py`;
                a.click();
                URL.revokeObjectURL(url);

                toast.success('Driver downloaded successfully');
            }
        } catch (error) {
            console.error('Error downloading file:', error);
            toast.error('Failed to download file');
        }
    };

    const handleDownloadApi = async () => {
        if (!halData.generatedPreview) {
            toast.error('No API code to download');
            return;
        }

        try {
            const blob = await downloadApi(
                halData.document || halData.uploadedFile?.name || 'Unknown',
                halData.generatedPreview
            );

            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `API_${halData.document || 'Unknown'}.py`;
            a.click();
            URL.revokeObjectURL(url);

            toast.success('API downloaded successfully');
        } catch (error) {
            console.error('Error downloading API:', error);
            toast.error('Failed to download API');
        }
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

    const toggleSection = (sectionId: string) => {
        setSections(prev => prev.map(section =>
            section.id === sectionId
                ? { ...section, isExpanded: !section.isExpanded }
                : section
        ));
    };

    const handleInstrumentTypeSelect = (type: InstrumentType) => {
        setDriverData(prev => ({
            ...prev,
            instrumentType: type,
            abstractPreview: mockAbstractCode[type],
            isGenerated: false,
            functions: []
        }));
    };

    return (
        <div
            className={cn(
                'fixed inset-y-0 right-0 w-[800px] bg-white shadow-2xl',
                'transform transition-all duration-500 ease-out z-50',
                'border-l border-gray-200',
                isOpen ? 'translate-x-0' : 'translate-x-full'
            )}
        >
            <div className="flex-1 flex flex-col h-full relative">
                {isGenerating && (
                    <LoadingOverlay message="Generating code..." />
                )}

                <div className={cn(
                    'flex items-center justify-between p-4',
                    'border-b border-gray-200',
                    'bg-gradient-to-r from-white to-gray-50'
                )}>
                    <h2 className={cn(
                        'text-xl font-semibold',
                        'bg-gradient-to-r from-gray-900 to-gray-600',
                        'bg-clip-text text-transparent'
                    )}>
                        {activeTab === 'hal' ? 'HAL Creation' : 'Driver Creation'}
                    </h2>
                    <button
                        onClick={onClose}
                        className={cn(
                            'p-2 rounded-full',
                            'hover:bg-gray-100',
                            'transition-colors duration-200',
                            'group'
                        )}
                        aria-label="Close"
                    >
                        <X className="h-5 w-5 text-gray-500 group-hover:text-gray-700 transition-colors" />
                    </button>
                </div>

                <div className="flex border-b">
                    {['hal', 'driver'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => handleTabChange(tab as TabType)}
                            className={cn(
                                'flex-1 py-3 px-4',
                                'text-center font-medium',
                                'transition-all duration-300',
                                'relative',
                                activeTab === tab ? [
                                    'text-primary-600',
                                    'before:absolute before:bottom-0 before:left-0 before:right-0',
                                    'before:h-0.5 before:bg-primary-600',
                                    'before:animate-slide-in-from-left'
                                ] : [
                                    'text-gray-500 hover:text-gray-700',
                                    'hover:bg-gray-50'
                                ]
                            )}
                        >
                            {tab === 'hal' ? 'HAL Creation' : 'Driver Creation'}
                        </button>
                    ))}
                </div>

                <div className="flex-1 overflow-y-auto">
                    <div className="w-full p-4">
                        <div className="space-y-4">
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
                                    {techStacks.map(tech => (
                                        <option key={tech} value={tech}>{tech}</option>
                                    ))}
                                </select>
                            </div>

                            {activeTab === 'hal' ? (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Select Instrument Document
                                        </label>
                                        <div className="relative">
                                            <select
                                                value={halData.document as DocumentType}
                                                onChange={(e) => handleDocumentSelect(e.target.value as DocumentType)}
                                                className="w-full p-2 pr-20 border rounded-md focus:ring-2 focus:ring-primary-500"
                                            >
                                                <option value="">Choose document...</option>
                                                {documents.map(doc => (
                                                    <option key={doc} value={doc}>{doc}</option>
                                                ))}
                                            </select>
                                            <div className="absolute right-1 top-1 bottom-1 flex items-center">
                                                <label className={cn(
                                                    "px-3 py-1 rounded-md cursor-pointer",
                                                    "bg-gray-50 hover:bg-gray-100",
                                                    "border border-gray-200",
                                                    "text-sm text-gray-600 hover:text-gray-900",
                                                    "transition-colors duration-200",
                                                    "flex items-center gap-1"
                                                )}>
                                                    <Upload className="h-4 w-4" />
                                                    <span className="text-xs">Upload</span>
                                                    <input
                                                        type="file"
                                                        className="sr-only"
                                                        onChange={handleFileChange}
                                                        accept=".pdf,.doc,.docx,.txt"
                                                    />
                                                </label>
                                            </div>
                                        </div>
                                        {halData.uploadedFile && (
                                            <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                                                <FileText className="h-4 w-4" />
                                                <span>{halData.uploadedFile.name}</span>
                                            </div>
                                        )}
                                    </div>
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

                            {activeTab === 'driver' && driverData.technology && driverData.instrumentType && (
                                <>
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

                            <Button
                                onClick={handleGenerate}
                                className="w-full"
                                disabled={!canGenerate()}
                            >
                                <FileCode className="h-4 w-4 mr-2" />
                                Generate {activeTab === 'hal' ? 'HAL' : 'Driver'}
                            </Button>

                            <div className="mt-4 flex gap-2">
                                <Button
                                    variant="outline"
                                    className="flex-1"
                                    disabled={activeTab === 'hal' ? !halData.isGenerated : !driverData.isGenerated}
                                    onClick={handleAddToLibrary}
                                >
                                    <Library className="h-4 w-4 mr-2" />
                                    Add to Library
                                </Button>
                                <Button
                                    variant="outline"
                                    className="flex-1"
                                    disabled={activeTab === 'hal' ? !halData.isGenerated : !driverData.isGenerated}
                                    onClick={handleDownload}
                                >
                                    <Download className="h-4 w-4 mr-2" />
                                    Download {activeTab === 'hal' ? 'HAL' : 'Driver'}
                                </Button>
                                {activeTab === 'hal' && (
                                    <Button
                                        variant="outline"
                                        className="flex-1"
                                        disabled={!halData.isGenerated}
                                        onClick={handleDownloadApi}
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
        </div>
    );
};

export default CreationSlider;