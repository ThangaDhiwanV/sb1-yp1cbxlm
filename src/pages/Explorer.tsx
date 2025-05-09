import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { FileSearch } from 'lucide-react';
import { TreeView, TreeNode } from '../components/common/TreeView';
import { ExplorerResponse } from '../types';
import { getFileContent, saveFileContent } from '../api/instrumentService';
import { getExplorerData } from '../api';
import FileEditor from '../components/InstrumentDetail/FileEditor';
import { toast } from 'sonner';
import PageHeader from '../components/common/PageHeader';

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

    const breadcrumbItems = [
        { label: 'Project', href: '/project' },
        { label: 'Explorer' }
    ];

    return (
        <div className="flex flex-col h-screen">
            <PageHeader
                title="Explorer"
                description="Browse and manage instrument files"
                breadcrumbs={breadcrumbItems}
            />

            <div className="flex flex-1 overflow-hidden max-w-screen-2xl mx-auto w-full p-4 gap-4">
                <div className="w-72 flex-shrink-0 flex flex-col gap-2">
                    <div className="relative">
                        <FileSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search files..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 placeholder:text-gray-400 text-sm"
                        />
                    </div>
                    
                    <div className="flex-1 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
                        {loading ? (
                            <div className="p-2">
                                <div className="animate-pulse space-y-2">
                                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                </div>
                            </div>
                        ) : error ? (
                            <div className="p-2 text-red-500">{error}</div>
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
                </div>

                <div className="flex-1 bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                    {fileLoading ? (
                        <div className="h-full flex items-center justify-center">
                            <div className="animate-spin h-5 w-5 border-2 border-primary-500 border-t-transparent rounded-full"></div>
                        </div>
                    ) : selectedNode ? (
                        <div className="h-full flex flex-col">
                            <div className="flex items-center justify-between px-3 py-2 border-b bg-gray-50/50">
                                <span className="text-sm font-medium text-gray-700">{selectedNode.label}</span>
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
                        <div className="h-full flex items-center justify-center text-gray-500 text-sm">
                            Select a file to view its content
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Explorer;