import React from 'react';
import { FolderOpen, FileCode, ChevronRight, ChevronDown } from 'lucide-react';
import { Instrument, Model, HalApi, FileItem, InstrumentCapabilities, ExplorerResponse } from '../../types';

interface TreeNavProps {
    instruments: Instrument[];
    halApi: HalApi | null;
    models: Model[];
    loading: boolean;
    onFileSelect: (fileId: string) => void;
    selectedFileId?: string;
    expandedNodes: {
        instrumentId: string | null;
        modelId: string | null;
        expandedModels: string[];
    };
    onNodeExpand: (type: 'instrument' | 'model', id: string) => void;
    halApiData: HalApi[];
    explorerData?: ExplorerResponse;
}

const TreeNav: React.FC<TreeNavProps> = ({
    instruments,
    loading,
    onFileSelect,
    selectedFileId,
    expandedNodes,
    onNodeExpand,
    halApiData,
    explorerData
}) => {
    const renderFileNode = (
        instrumentId: string,
        modelName: string | undefined,
        fileName: string,
        fileType: string,
        depth: number = 0
    ) => {
        // Generate a consistent file ID format: instrumentId_modelName_fileType or instrumentId_fileType
        const fileId = modelName ? `${instrumentId}_${modelName}_${fileType}` : `${instrumentId}_${fileType}`;
        const isSelected = selectedFileId === fileId;

        return (
            <div
                key={fileId}
                className={`pl-${depth * 4} py-1 cursor-pointer hover:bg-gray-100 ${isSelected ? 'bg-blue-50' : ''
                    }`}
                onClick={() => onFileSelect(fileId)}
            >
                <div className="flex items-center">
                    <FileCode className="h-4 w-4 mr-2" />
                    <span className="text-sm">{fileName}</span>
                </div>
            </div>
        );
    };

    const renderInstrumentNode = (instrument: Instrument) => {
        const isExpanded = expandedNodes.instrumentId === instrument.id;
        const instrumentData = explorerData?.[instrument.type];
        const halApi = halApiData.find(h => h.instrumentId === instrument.id);

        return (
            <div key={instrument.id} className="mb-2">
                <div
                    className="flex items-center py-1 px-2 cursor-pointer hover:bg-gray-100"
                    onClick={() => onNodeExpand('instrument', instrument.id)}
                >
                    {isExpanded ? (
                        <ChevronDown className="h-4 w-4 mr-1" />
                    ) : (
                        <ChevronRight className="h-4 w-4 mr-1" />
                    )}
                    <FolderOpen className="h-4 w-4 mr-2" />
                    <span className="text-sm font-medium">{instrument.name}</span>
                </div>

                {isExpanded && (
                    <div className="pl-4">
                        {/* HAL/API Section */}
                        {instrumentData?.hal && (
                            <div className="mb-2">
                                <div className="flex items-center py-1">
                                    <FolderOpen className="h-4 w-4 mr-2" />
                                    <span className="text-sm">HAL/API</span>
                                </div>
                                <div className="pl-4">
                                    {renderFileNode(instrument.id, undefined, 'HAL', 'hal', 1)}
                                </div>
                            </div>
                        )}

                        {/* API Section */}
                        {instrumentData?.api && (
                            <div className="mb-2">
                                <div className="pl-4">
                                    {renderFileNode(instrument.id, undefined, 'API', 'api', 1)}
                                </div>
                            </div>
                        )}

                        {/* Documentation Section */}
                        {instrumentData?.documentation && (
                            <div className="mb-2">
                                <div className="pl-4">
                                    {renderFileNode(instrument.id, undefined, 'Documentation', 'docs', 1)}
                                </div>
                            </div>
                        )}

                        {/* Models Section */}
                        {instrumentData?.models && instrumentData.models.length > 0 && (
                            <div>
                                <div
                                    className="flex items-center py-1 cursor-pointer hover:bg-gray-100"
                                    onClick={() => onNodeExpand('model', 'models')}
                                >
                                    {expandedNodes.modelId === 'models' ? (
                                        <ChevronDown className="h-4 w-4 mr-1" />
                                    ) : (
                                        <ChevronRight className="h-4 w-4 mr-1" />
                                    )}
                                    <FolderOpen className="h-4 w-4 mr-2" />
                                    <span className="text-sm">Models</span>
                                </div>

                                {expandedNodes.modelId === 'models' && (
                                    <div className="pl-4">
                                        {instrumentData.models.map(modelObj => {
                                            const modelName = Object.keys(modelObj)[0];
                                            const modelCapabilities = modelObj[modelName];
                                            const isModelExpanded = expandedNodes.expandedModels.includes(modelName);

                                            return (
                                                <div key={modelName}>
                                                    <div
                                                        className="flex items-center py-1 cursor-pointer hover:bg-gray-100"
                                                        onClick={() => onNodeExpand('model', modelName)}
                                                    >
                                                        {isModelExpanded ? (
                                                            <ChevronDown className="h-4 w-4 mr-1" />
                                                        ) : (
                                                            <ChevronRight className="h-4 w-4 mr-1" />
                                                        )}
                                                        <FolderOpen className="h-4 w-4 mr-2" />
                                                        <span className="text-sm">{modelName}</span>
                                                    </div>

                                                    {isModelExpanded && (
                                                        <div className="pl-4">
                                                            {modelCapabilities.driver && (
                                                                renderFileNode(instrument.id, modelName, 'Driver', 'driver', 2)
                                                            )}
                                                            {modelCapabilities.manual && (
                                                                renderFileNode(instrument.id, modelName, 'Manual', 'manual', 2)
                                                            )}
                                                            {modelCapabilities.panel && (
                                                                renderFileNode(instrument.id, modelName, 'Panel', 'panel', 2)
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    };

    if (loading) {
        return (
            <div className="p-4">
                <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-2">
            <div className="space-y-1">
                {instruments.map(renderInstrumentNode)}
            </div>
        </div>
    );
};

export default TreeNav;