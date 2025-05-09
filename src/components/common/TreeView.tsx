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
                    "flex items-center py-2 px-3 cursor-pointer rounded-lg mx-1.5 my-0.5",
                    "transition-all duration-200",
                    "hover:bg-primary-50/80",
                    isSelected && "bg-primary-50 shadow-sm border border-primary-100",
                )}
                style={{ paddingLeft: `${depth * 12}px` }}
                onClick={handleClick}
            >
                {hasChildren ? (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onNodeToggle?.(node.id, !isExpanded);
                        }}
                        className={cn(
                            "p-0.5 rounded-md mr-1.5 transition-colors",
                            "hover:bg-primary-100/50",
                            "active:bg-primary-200/50"
                        )}
                    >
                        {isExpanded ? (
                            <ChevronDown className="h-4 w-4 text-primary-600" />
                        ) : (
                            <ChevronRight className="h-4 w-4 text-primary-600" />
                        )}
                    </button>
                ) : (
                    <span className="w-6" />
                )}
                {node.type === 'folder' ? (
                    <FolderOpen className={cn(
                        "h-4 w-4 mr-2",
                        isSelected ? "text-primary-600" : "text-primary-500"
                    )} />
                ) : (
                    <FileCode className={cn(
                        "h-4 w-4 mr-2",
                        isSelected ? "text-primary-600" : "text-gray-500"
                    )} />
                )}
                <span className={cn(
                    "text-sm transition-colors",
                    isSelected ? "text-primary-900 font-medium" : "text-gray-700",
                    node.error && "text-gray-400"
                )}>
                    {node.label}
                </span>
                {node.error && (
                    <span className="ml-2 text-xs text-red-500 opacity-75">({node.error})</span>
                )}
            </div>
            {isExpanded && node.children && (
                <div className={cn(
                    "transition-all duration-200",
                    isExpanded ? "opacity-100" : "opacity-0"
                )}>
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
        <div className={cn(
            "overflow-y-auto rounded-lg",
            "bg-white shadow-sm border border-gray-200",
            "p-2"
        )}>
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