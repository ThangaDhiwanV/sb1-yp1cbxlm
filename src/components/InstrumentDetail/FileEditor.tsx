import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import { cn } from '../../utils/cn';
import styles from './FileEditor.module.css';

interface FileEditorProps {
  content: string | Blob;
  fileType: 'manual' | 'documentation' | 'hal' | 'api' | 'panel' | 'driver';
  fileName?: string;
  isEditing: boolean;
  onSave?: (content: string) => void;
  onCancel?: () => void;
}

const FileEditor: React.FC<FileEditorProps> = ({
  content,
  fileType,
  fileName,
  isEditing,
  onSave,
  onCancel,
}) => {
  const [editableContent, setEditableContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [parsedContent, setParsedContent] = useState<any>(null);

  useEffect(() => {
    const initializeContent = async () => {
      setIsLoading(true);
      setError(null);
      try {
        let textContent = '';
        if (content instanceof Blob) {
          textContent = await content.text();
        } else {
          textContent = content;
        }

        try {
          const parsed = JSON.parse(textContent);
          setParsedContent(parsed);
          setEditableContent(parsed.content || textContent);
        } catch {
          setEditableContent(textContent);
          setParsedContent(null);
        }
      } catch (err) {
        setError('Failed to load file content');
        console.error('Error loading file:', err);
      }
      setIsLoading(false);
    };

    initializeContent();
  }, [content]);

  const handleSave = () => {
    if (!onSave) return;
    onSave(editableContent);
  };

  const getLanguage = () => {
    if (fileName?.includes('.')) {
      const ext = fileName.split('.').pop()?.toLowerCase();
      switch (ext) {
        case 'py': return 'python';
        case 'json': return 'json';
        case 'md': return 'markdown';
        default: return ext;
      }
    }

    switch (fileType) {
      case 'hal':
      case 'driver':
      case 'api':
        return 'python';
      case 'documentation':
      case 'manual':
        return 'markdown';
      case 'panel':
        return 'javascript';
      default:
        return '';
    }
  };

  const shouldRenderAsCode = () => {
    return (
      fileType === 'hal' ||
      fileType === 'driver' ||
      fileType === 'api' ||
      isPythonContent(editableContent)
    );
  };

  const shouldRenderAsMarkdown = () => {
    return (
      fileType === 'documentation' ||
      (fileType === 'manual' && !shouldRenderAsCode())
    );
  };

  const isPythonContent = (content: string): boolean => {
    const pythonIndicators = [
      'class',
      'def',
      'self',
      '__init__',
      'import',
      '@property',
      'async',
      'await'
    ];
    return pythonIndicators.some(indicator => content.includes(indicator));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin h-8 w-8 border-4 border-primary-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-auto">
          <textarea
            className="w-full h-full p-4 font-mono text-sm border-0 focus:ring-0 resize-none"
            value={editableContent}
            onChange={(e) => setEditableContent(e.target.value)}
          />
        </div>
        <div className="flex justify-end gap-2 p-4 bg-white border-t">
          <button
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
    );
  }

  if (shouldRenderAsMarkdown()) {
    return (
      <div className={cn('p-4 prose max-w-none', styles['markdown-content'])}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            code({ node, className, children, ...props }: any) {
              const match = /language-(\w+)/.exec(className || '');
              return match ? (
                <SyntaxHighlighter
                  style={materialDark}
                  language={match[1]}
                  PreTag="div"
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            }
          }}
        >
          {editableContent}
        </ReactMarkdown>
      </div>
    );
  }

  return (
    <div className="p-4">
      <SyntaxHighlighter
        language={getLanguage()}
        style={materialDark}
        customStyle={{ margin: 0 }}
      >
        {editableContent}
      </SyntaxHighlighter>
    </div>
  );
};

export default FileEditor;