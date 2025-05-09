import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Wrench, Edit2, Download, Search } from 'lucide-react';
import { TreeView, TreeNode } from '../components/common/TreeView';
import { ExplorerResponse } from '../types';
import Breadcrumbs from '../components/common/Breadcrumbs';
import Button from '../components/common/Button';
import { useCreationContext } from '../App';
import { getFileContent, saveFileContent } from '../api/instrumentService';
import { getExplorerData } from '../api';
import FileEditor from '../components/InstrumentDetail/FileEditor';
import { toast } from 'sonner';
import { cn } from '../utils/cn';

interface LocationState {
    fileType: 'hal' | 'api' | 'documentation' | 'panel';
    instrumentId: string;
}

const Explorer: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const location = useLocation();
    const state = location.state as LocationState;

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [treeData, setTreeData] = useState<TreeNode[]>([]);
    const [expandedNodes, setExpandedNodes] = useState<string[]>([]);
    const [selectedNode, setSelectedNode] = useState<TreeNode | null>(null);
    const [fileContent, setFileContent] = useState<string>('');
    const [fileLoading, setFileLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const { setIsCreationSliderOpen } = useCreationContext();
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const explorerResponse = await getExplorerData();
                const transformedData = transformExplorerData(explorerResponse);
                setTreeData(transformedData);

                if (state?.instrumentId && state?.fileType) {
                    const nodeId = `${id}_${state.fileType}`;
                    setExpandedNodes([id || '']);

                    const instrumentSection = transformedData.find(node => node.id === id);
                    if (instrumentSection) {
                        const targetNode = instrumentSection.children?.find(
                            child => child.id === nodeId
                        );
                        if (targetNode) {
                            handleNodeClick(nodeId, targetNode);
                        }
                    }
                } else if (id) {
                    setExpandedNodes([id]);
                }
            } catch (err) {
                setError('Failed to load data');
                console.error('Error loading data:', err);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [id, state]);

    const transformExplorerData = (data: ExplorerResponse): TreeNode[] => {
        return Object.entries(data).map(([instrumentType, capabilities]) => ({
            id: instrumentType,
            label: instrumentType,
            type: 'folder',
            children: [
                {
                    id: `${instrumentType}_hal`,
                    label: 'HAL',
                    type: 'file',
                    error: !capabilities.hal ? 'Not available' : undefined
                },
                {
                    id: `${instrumentType}_documentation`,
                    label: 'Documentation',
                    type: 'file',
                    error: !capabilities.documentation ? 'Not available' : undefined
                },
                {
                    id: `${instrumentType}_panel`,
                    label: 'Panel',
                    type: 'file',
                    error: !capabilities.panel ? 'Not available' : undefined
                },
                {
                    id: `${instrumentType}_api`,
                    label: 'API',
                    type: 'file',
                    error: !capabilities.api ? 'Not available' : undefined
                },
                {
                    id: `${instrumentType}_models`,
                    label: 'Models',
                    type: 'folder',
                    children: capabilities.models.map(modelObj => {
                        const modelName = Object.keys(modelObj)[0];
                        const modelCapabilities = modelObj[modelName];
                        return {
                            id: `${instrumentType}_${modelName}`,
                            label: modelName,
                            type: 'folder',
                            children: [
                                {
                                    id: `${instrumentType}_${modelName}_panel`,
                                    label: 'Panel',
                                    type: 'file',
                                    error: !modelCapabilities.panel ? 'Not available' : undefined
                                },
                                {
                                    id: `${instrumentType}_${modelName}_manual`,
                                    label: 'Manual',
                                    type: 'file',
                                    error: !modelCapabilities.manual ? 'Not available' : undefined
                                },
                                {
                                    id: `${instrumentType}_${modelName}_driver`,
                                    label: 'Driver',
                                    type: 'file',
                                    error: !modelCapabilities.driver ? 'Not available' : undefined
                                }
                            ]
                        };
                    })
                }
            ]
        }));
    };

    const getFileType = (nodeId: string): 'manual' | 'documentation' | 'hal' | 'api' | 'panel' => {
        if (nodeId.includes('_hal')) return 'hal';
        if (nodeId.includes('_documentation')) return 'documentation';
        if (nodeId.includes('_api')) return 'api';
        if (nodeId.includes('_panel')) return 'panel';
        if (nodeId.includes('_manual')) return 'manual';
        return 'documentation';
    };

    const handleNodeClick = async (nodeId: string, node: TreeNode) => {
        if (node.type === 'file') {
            setSelectedNode(node);
            if (node.error) {
                setFileContent(`Error: ${node.error}`);
                return;
            }

            try {
                setFileLoading(true);
                const content = await getFileContent(nodeId);
                if (content) {
                    setFileContent(content.content);
                } else {
                    setFileContent('Error: Failed to load file content');
                }
            } catch (error) {
                console.error('Error loading file:', error);
                setFileContent('Error: Failed to load file content');
            } finally {
                setFileLoading(false);
            }
        }
    };

    const handleNodeToggle = (nodeId: string, isExpanded: boolean) => {
        setExpandedNodes(prev =>
            isExpanded
                ? [...prev, nodeId]
                : prev.filter(id => id !== nodeId)
        );
    };

    const handleSave = async (content: string) => {
        if (!selectedNode) return;
        try {
            const success = await saveFileContent(selectedNode.id, content);
            if (success) {
                setFileContent(content);
                setIsEditing(false);
                toast.success('File saved successfully');
            } else {
                toast.error('Failed to save file');
            }
        } catch (error) {
            console.error('Error saving file:', error);
            toast.error('Failed to save file');
        }
    };

    const handleDownload = () => {
        if (!selectedNode || !fileContent) return;
        try {
            const blob = new Blob([fileContent], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = selectedNode.label + (getFileType(selectedNode.id) === 'hal' ? '.py' : '.txt');
            a.click();
            URL.revokeObjectURL(url);
            toast.success('File downloaded successfully');
        } catch (error) {
            console.error('Error downloading file:', error);
            toast.error('Failed to download file');
        }
    };

    const breadcrumbItems = [
        { label: 'Project', href: '/' },
        { label: 'All Instruments', href: '/instruments' },
        { label: 'Explorer' }
    ];

    return (
        <div className="flex flex-col h-screen bg-gray-50">
            <div className="flex-none p-3 border-b border-gray-200 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-center">
                        <Breadcrumbs items={breadcrumbItems} />
                        <Button
                            onClick={() => setIsCreationSliderOpen(true)}
                            className="flex items-center gap-2"
                        >
                            <Wrench className="h-4 w-4" />
                            Create HAL/Driver
                        </Button>
                    </div>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden p-3 gap-3 max-w-7xl mx-auto w-full">
                <div className="w-72 flex-shrink-0">
                    <div className="mb-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search files..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className={cn(
                                    "w-full pl-10 pr-4 py-2 rounded-lg",
                                    "border border-gray-200",
                                    "focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500",
                                    "placeholder:text-gray-400 text-sm"
                                )}
                            />
                        </div>
                    </div>
                    
                    {loading ? (
                        <div className="p-3">
                            <div className="animate-pulse space-y-2">
                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                            </div>
                        </div>
                    ) : error ? (
                        <div className="p-3 text-red-500">{error}</div>
                    ) : (
                        <TreeView
                            data={treeData}
                            expanded={expandedNodes}
                            selected={selectedNode?.id}
                            onNodeClick={handleNodeClick}
                            onNodeToggle={handleNodeToggle}
                        />
                    )}
                </div>

                <div className="flex-1 bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                    {fileLoading ? (
                        <div className="h-full flex items-center justify-center">
                            <div className="text-center">
                                <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500 mb-4"></div>
                                <p className="text-sm text-gray-500">Loading file content...</p>
                            </div>
                        </div>
                    ) : selectedNode ? (
                        <div className="h-full flex flex-col">
                            <div className="flex items-center justify-between p-3 border-b bg-gray-50/50">
                                <span className="text-sm font-medium text-gray-900">{selectedNode.label}</span>
                                {selectedNode.type === 'file' && !selectedNode.error && (
                                    <div className="flex items-center gap-2">
                                        <Button
                                            onClick={() => setIsEditing(true)}
                                            size="sm"
                                            className="flex items-center gap-1.5"
                                        >
                                            <Edit2 className="h-4 w-4" />
                                            Edit
                                        </Button>
                                        <Button
                                            onClick={handleDownload}
                                            variant="outline"
                                            size="sm"
                                            className="flex items-center gap-1.5"
                                        >
                                            <Download className="h-4 w-4" />
                                            Download
                                        </Button>
                                    </div>
                                )}
                            </div>
                            <FileEditor
                                content={fileContent}
                                fileType={getFileType(selectedNode.id)}
                                isEditing={isEditing}
                                onSave={handleSave}
                                onCancel={() => setIsEditing(false)}
                            />
                        </div>
                    ) : (
                        <div className="h-full flex items-center justify-center">
                            <div className="text-center text-gray-500">
                                <p>Select a file to view its content</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Explorer;