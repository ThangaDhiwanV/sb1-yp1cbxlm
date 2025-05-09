import React, { useState } from 'react';
import { TreeView, TreeNode } from '../components/common/TreeView';

const TreeDemo: React.FC = () => {
    // Example response data transformed into TreeNode format
    const treeData: TreeNode[] = [
        {
            id: 'dmm',
            label: 'DMM',
            type: 'folder',
            children: [
                {
                    id: 'dmm_hal',
                    label: 'HAL',
                    type: 'file',
                },
                {
                    id: 'dmm_docs',
                    label: 'Documentation',
                    type: 'file',
                },
                {
                    id: 'dmm_models',
                    label: 'Models',
                    type: 'folder',
                    children: [
                        {
                            id: 'dmm_dmm6500',
                            label: 'DMM6500',
                            type: 'folder',
                            children: [
                                {
                                    id: 'dmm_dmm6500_panel',
                                    label: 'Panel',
                                    type: 'file',
                                },
                                {
                                    id: 'dmm_dmm6500_manual',
                                    label: 'Manual',
                                    type: 'file',
                                },
                                {
                                    id: 'dmm_dmm6500_driver',
                                    label: 'Driver',
                                    type: 'file',
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            id: 'smu',
            label: 'SMU',
            type: 'folder',
            children: [
                {
                    id: 'smu_hal',
                    label: 'HAL',
                    type: 'file',
                },
                {
                    id: 'smu_docs',
                    label: 'Documentation',
                    type: 'file',
                },
                {
                    id: 'smu_models',
                    label: 'Models',
                    type: 'folder',
                    children: [
                        {
                            id: 'smu_keithley2400',
                            label: 'Keithley2400',
                            type: 'folder',
                            children: [
                                {
                                    id: 'smu_keithley2400_panel',
                                    label: 'Panel',
                                    type: 'file',
                                },
                                {
                                    id: 'smu_keithley2400_manual',
                                    label: 'Manual',
                                    type: 'file',
                                },
                                {
                                    id: 'smu_keithley2400_driver',
                                    label: 'Driver',
                                    type: 'file',
                                }
                            ]
                        },
                        {
                            id: 'smu_ni_smu',
                            label: 'NI SMU',
                            type: 'folder',
                            children: [
                                {
                                    id: 'smu_ni_smu_panel',
                                    label: 'Panel',
                                    type: 'file',
                                },
                                {
                                    id: 'smu_ni_smu_manual',
                                    label: 'Manual',
                                    type: 'file',
                                },
                                {
                                    id: 'smu_ni_smu_driver',
                                    label: 'Driver',
                                    type: 'file',
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ];

    const [expandedNodes, setExpandedNodes] = useState<string[]>(['dmm', 'smu']);
    const [selectedNode, setSelectedNode] = useState<string | undefined>();

    const handleNodeClick = (nodeId: string, node: TreeNode) => {
        setSelectedNode(nodeId);
        console.log('Selected node:', node);
    };

    const handleNodeToggle = (nodeId: string, isExpanded: boolean) => {
        setExpandedNodes(prev =>
            isExpanded
                ? [...prev, nodeId]
                : prev.filter(id => id !== nodeId)
        );
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Instrument Tree View</h1>
            <div className="border rounded-lg shadow-sm">
                <TreeView
                    data={treeData}
                    expanded={expandedNodes}
                    selected={selectedNode}
                    onNodeClick={handleNodeClick}
                    onNodeToggle={handleNodeToggle}
                />
            </div>
        </div>
    );
};

export default TreeDemo;