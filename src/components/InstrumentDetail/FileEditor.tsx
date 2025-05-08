import React, { useState, useEffect } from 'react';
import { FileText } from 'lucide-react';
import { cn } from '../../utils/cn';

interface FileEditorProps {
  content: string;
  fileName: string;
  isEditing: boolean;
  onSave: (content: string) => void;
  onStartEdit?: () => void;
  onDownload?: () => void;
  onCancel?: () => void;
  allowEdit?: boolean;
  allowDownload?: boolean;
}

const FileEditor: React.FC<FileEditorProps> = ({
  content,
  fileName,
  isEditing,
  onSave,
  onStartEdit,
  onDownload,
  onCancel,
  allowEdit = true,
  allowDownload = true,
}) => {
  const [editableContent, setEditableContent] = useState(content);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setEditableContent(content);
  }, [content]);

  const handleContentChange = (newContent: string) => {
    setEditableContent(newContent);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(editableContent);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 bg-white">
        <div className="flex items-center space-x-2">
          <FileText className="h-5 w-5 text-primary-500" />
          <span className="font-medium text-gray-700">{fileName}</span>
        </div>
        <div className="flex items-center space-x-2">
          {allowEdit && !isEditing && (
            <button
              onClick={onStartEdit}
              className={cn(
                "px-3 py-1.5 text-sm font-medium rounded-md",
                "text-primary-600 hover:text-primary-700",
                "bg-primary-50 hover:bg-primary-100",
                "transition-colors"
              )}
            >
              Edit
            </button>
          )}
          {allowDownload && (
            <button
              onClick={onDownload}
              className={cn(
                "px-3 py-1.5 text-sm font-medium rounded-md",
                "text-primary-600 hover:text-primary-700",
                "bg-primary-50 hover:bg-primary-100",
                "transition-colors"
              )}
            >
              Download
            </button>
          )}
        </div>
      </div>
      <div className="flex-1 overflow-auto bg-gray-50">
        {isEditing ? (
          <div className="h-full flex flex-col">
            <textarea
              value={editableContent}
              onChange={(e) => handleContentChange(e.target.value)}
              className="flex-1 p-4 font-mono text-sm bg-white border-0 focus:ring-2 focus:ring-primary-500"
            />
            <div className="flex justify-end space-x-2 p-2 bg-white border-t border-gray-200">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-md",
                  "text-white bg-primary-500 hover:bg-primary-600",
                  "transition-colors",
                  "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
              >
                {isSaving ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={onCancel}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-md",
                  "text-gray-700 bg-white border border-gray-300",
                  "hover:bg-gray-50 transition-colors"
                )}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <pre className="p-4 font-mono text-sm whitespace-pre-wrap">{content}</pre>
        )}
      </div>
    </div>
  );
};

export default FileEditor;