import React from 'react';
import { ChevronRight, ChevronDown, FileText, Book, Code2, MonitorSmartphone, HardDrive, FileCode, FileBox, Box } from 'lucide-react';
import { cn } from '../../utils/cn';
import { HalApi, Model } from '../../types';

interface TreeNavProps {
    activeSection: string;
    onSectionChange: (section: string) => void;
    halApi: HalApi | null;
    models: Model[];
    loading: boolean;
    onFileSelect: (fileId: string) => void;
    selectedFileId?: string;
    expandedModelId?: string | null;
    onModelExpand?: (modelId: string | null) => void;
}

const TreeNode: React.FC<{
    label: string;
    icon?: React.ElementType;
    expanded?: boolean;
    selected?: boolean;
    onClick?: () => void;
    depth?: number;
    hasChildren?: boolean;
}> = ({
    label,
    icon: Icon,
    expanded,
    selected,
    onClick,
    depth = 0,
    hasChildren
}) => {
        const paddingLeft = `${depth * 1.5}rem`;
        const ChevronIcon = expanded ? ChevronDown : ChevronRight;

        return (
            <button
                onClick={onClick}
                className={cn(
                    'w-full px-3 py-2 flex items-center text-sm transition-colors',
                    'hover:bg-primary-50',
                    selected && 'bg-primary-50 text-primary-600'
                )}
                style={{ paddingLeft }}
            >
                {hasChildren ? (
                    <ChevronIcon className="h-4 w-4 mr-2 text-primary-400" />
                ) : (
                    <span className="w-4 mr-2" />
                )}
                {Icon && <Icon className={cn("h-4 w-4 mr-2", selected ? "text-primary-500" : "text-gray-500")} />}
                <span className="truncate">{label}</span>
            </button>
        );
    };

const TreeNav: React.FC<TreeNavProps> = ({
    activeSection,
    onSectionChange,
    halApi,
    models,
    loading,
    onFileSelect,
    selectedFileId,
    expandedModelId,
    onModelExpand
}) => {
    const getFileIcon = (type: string) => {
        switch (type.toLowerCase()) {
            case 'driver':
                return HardDrive;
            case 'manual':
                return Book;
            case 'documentation':
                return FileText;
            case 'api':
                return Code2;
            case 'abstract':
                return FileCode;
            default:
                return FileBox;
        }
    };

    const handleModelClick = (modelId: string) => {
        if (onModelExpand) {
            onModelExpand(expandedModelId === modelId ? null : modelId);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
            </div>
        );
    }

    return (
        <div className="py-2">
            {/* HAL & API Section */}
            <TreeNode
                label="HAL"
                icon={Box}
                expanded={activeSection === 'hal-api'}
                onClick={() => onSectionChange('hal-api')}
                hasChildren={true}
                selected={activeSection === 'hal-api'}
            />
            {activeSection === 'hal-api' && halApi?.files.map(file => (
                <TreeNode
                    key={file.id}
                    label={file.name}
                    icon={getFileIcon(file.type)}
                    depth={1}
                    selected={selectedFileId === file.id}
                    onClick={() => onFileSelect(file.id)}
                />
            ))}

            {/* Models Section */}
            <TreeNode
                label="Models"
                icon={MonitorSmartphone}
                expanded={activeSection === 'models'}
                onClick={() => onSectionChange('models')}
                hasChildren={true}
                selected={activeSection === 'models'}
            />
            {activeSection === 'models' && models.map(model => (
                <React.Fragment key={model.id}>
                    <TreeNode
                        label={model.name}
                        icon={Box}
                        depth={1}
                        expanded={expandedModelId === model.id}
                        onClick={() => handleModelClick(model.id)}
                        hasChildren={true}
                    />
                    {expandedModelId === model.id && model.files.map(file => (
                        <TreeNode
                            key={file.id}
                            label={file.name}
                            icon={getFileIcon(file.type)}
                            depth={2}
                            selected={selectedFileId === file.id}
                            onClick={() => onFileSelect(file.id)}
                        />
                    ))}
                </React.Fragment>
            ))}
        </div>
    );
};

export default TreeNav;