import React from 'react';
import { ChevronRight, ChevronDown, FolderOpen, FileCode } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface TreeNode {
    id: string;
    label: string;
    type: 'folder' | 'file';
    children?: TreeNode[];
    error?: string;
}

interface TreeViewProps {
    data: TreeNode[];
    expanded?: string[];
    selected?: string;
    onNodeClick?: (nodeId: string, node: TreeNode) => void;
    onNodeToggle?: (nodeId: string, isExpanded: boolean) => void;
}

interface TreeNodeProps {
    node: TreeNode;
    depth?: number;
    expanded?: string[];
    selected?: string;
    onNodeClick?: (nodeId: string, node: TreeNode) => void;
    onNodeToggle?: (nodeId: string, isExpanded: boolean) => void;
}

const TreeNodeComponent: React.FC<TreeNodeProps> = ({
    node,
    depth = 0,
    expanded = [],
    selected,
    onNodeClick,
    onNodeToggle
}) => {
    const isExpanded = expanded.includes(node.id);
    const isSelected = selected === node.id;
    const hasChildren = node.children && node.children.length > 0;

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (hasChildren && onNodeToggle) {
            onNodeToggle(node.id, !isExpanded);
        }
        if (onNodeClick) {
            onNodeClick(node.id, node);
        }
    };

    return (
        <div>
            <div
                className={cn(
                    "flex items-center py-1.5 px-2 cursor-pointer transition-all duration-150",
                    "hover:bg-gray-100/80",
                    isSelected && "bg-blue-100/80 hover:bg-blue-100",
                    "border-l-2",
                    isSelected ? "border-l-primary-500" : "border-l-transparent",
                )}
                style={{ paddingLeft: `${depth * 16}px` }}
                onClick={handleClick}
            >
                {hasChildren ? (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onNodeToggle?.(node.id, !isExpanded);
                        }}
                        className="p-0.5 hover:bg-gray-200 rounded mr-1"
                    >
                        {isExpanded ? (
                            <ChevronDown className="h-4 w-4 text-gray-600" />
                        ) : (
                            <ChevronRight className="h-4 w-4 text-gray-600" />
                        )}
                    </button>
                ) : (
                    <span className="w-5" />
                )}
                {node.type === 'folder' ? (
                    <FolderOpen className={cn(
                        "h-4 w-4 mr-2",
                        isSelected ? "text-primary-500" : "text-blue-500"
                    )} />
                ) : (
                    <FileCode className={cn(
                        "h-4 w-4 mr-2",
                        isSelected ? "text-primary-500" : "text-gray-500"
                    )} />
                )}
                <span className={cn(
                    "text-sm transition-colors",
                    isSelected ? "text-primary-700 font-medium" : "text-gray-700",
                    node.error && "text-gray-400"
                )}>
                    {node.label}
                </span>
                {node.error && (
                    <span className="ml-2 text-xs text-red-500 opacity-75">({node.error})</span>
                )}
            </div>
            {isExpanded && node.children && (
                <div>
                    {node.children.map((child) => (
                        <TreeNodeComponent
                            key={child.id}
                            node={child}
                            depth={depth + 1}
                            expanded={expanded}
                            selected={selected}
                            onNodeClick={onNodeClick}
                            onNodeToggle={onNodeToggle}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export const TreeView: React.FC<TreeViewProps> = ({
    data,
    expanded = [],
    selected,
    onNodeClick,
    onNodeToggle
}) => {
    return (
        <div className="overflow-y-auto">
            {data.map((node) => (
                <TreeNodeComponent
                    key={node.id}
                    node={node}
                    expanded={expanded}
                    selected={selected}
                    onNodeClick={onNodeClick}
                    onNodeToggle={onNodeToggle}
                />
            ))}
        </div>
    );
};