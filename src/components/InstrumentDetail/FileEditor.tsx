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

        // Try to parse as JSON for structured content
        try {
          const parsed = JSON.parse(textContent);
          setParsedContent(parsed);

          // Extract relevant content based on file type
          switch (fileType) {
            case 'hal':
              setEditableContent(parsed.hal?.content || parsed.hal || textContent);
              break;
            case 'api':
              setEditableContent(parsed.api?.content || parsed.api || textContent);
              break;
            case 'documentation':
              setEditableContent(
                parsed.documentation?.content ||
                parsed.documentation ||
                parsed.docs?.content ||
                parsed.docs ||
                textContent
              );
              break;
            case 'manual':
              setEditableContent(
                parsed.manual?.content ||
                parsed.manual ||
                textContent
              );
              break;
            case 'driver':
              setEditableContent(
                parsed.driver?.content ||
                parsed.driver ||
                textContent
              );
              break;
            case 'panel':
              setEditableContent(parsed.panel?.content || parsed.panel || textContent);
              break;
            default:
              setEditableContent(textContent);
          }
        } catch (e) {
          // If not JSON or parsing fails, use raw content
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
  }, [content, fileType]);

  const handleSave = () => {
    if (!onSave) return;

    if (fileType === 'driver') {
      // For driver files, always wrap in JSON format
      onSave(JSON.stringify({ driver: editableContent }, null, 2));
    } else if (parsedContent) {
      // Handle other parsed content types
      const updatedContent = { ...parsedContent };
      switch (fileType) {
        case 'hal':
          if (updatedContent.hal?.content) {
            updatedContent.hal.content = editableContent;
          } else {
            updatedContent.hal = editableContent;
          }
          break;
        case 'api':
          if (updatedContent.api?.content) {
            updatedContent.api.content = editableContent;
          } else {
            updatedContent.api = editableContent;
          }
          break;
        case 'documentation':
          // Update either 'documentation' or 'docs' property
          if (updatedContent.documentation?.content) {
            updatedContent.documentation.content = editableContent;
          } else if (updatedContent.docs?.content) {
            updatedContent.docs.content = editableContent;
          } else if (updatedContent.documentation) {
            updatedContent.documentation = editableContent;
          } else {
            updatedContent.docs = editableContent;
          }
          break;
        case 'manual':
          if (updatedContent.manual?.content) {
            updatedContent.manual.content = editableContent;
          } else {
            updatedContent.manual = editableContent;
          }
          break;
        case 'driver':
          // Update either 'manual' or 'driver' property
          if (updatedContent.driver?.content) {
            updatedContent.driver.content = editableContent;
          } else {
            updatedContent.driver = editableContent;
          }
          break;
        case 'panel':
          if (updatedContent.panel?.content) {
            updatedContent.panel.content = editableContent;
          } else {
            updatedContent.panel = editableContent;
          }
          break;
      }
      onSave(JSON.stringify(updatedContent, null, 2));
    } else {
      // If we didn't have parsed content, save the raw content
      onSave(editableContent);
    }
  };

  // Determine file language for syntax highlighting
  const getLanguage = () => {
    if (fileName?.includes('.')) {
      const ext = fileName.split('.').pop()?.toLowerCase();
      switch (ext) {
        case 'py':
          return 'python';
        case 'json':
          return 'json';
        case 'md':
          return 'markdown';
        default:
          return ext;
      }
    }

    // Determine by file type if no extension
    switch (fileType) {
      case 'hal':
      case 'driver':
      case 'api':
        return 'python'; // Changed to always return python for these types
      case 'documentation':
      case 'manual':
        return 'markdown';
      case 'panel':
        return 'javascript';
      default:
        return '';
    }
  };

  // Detect if content should be rendered as code
  const shouldRenderAsCode = () => {
    return (
      fileType === 'hal' ||
      fileType === 'driver' ||
      fileType === 'api' ||
      isPythonContent(editableContent)
    );
  };

  // Check if content should be rendered as markdown
  const shouldRenderAsMarkdown = () => {
    return (
      fileType === 'documentation' ||
      (fileType === 'manual' && !shouldRenderAsCode())
    );
  };

  // Helper to detect Python content
  const isPythonContent = (content: string): boolean => {
    // Check for common Python indicators
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
      <div className="h-full">
        <textarea
          className="w-full h-full p-4 font-mono text-sm border-0 focus:ring-0 resize-none"
          value={editableContent}
          onChange={(e) => setEditableContent(e.target.value)}
        />
        <div className="fixed bottom-4 right-4 flex gap-2">
          <button
            className="px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600"
            onClick={handleSave}
          >
            Save
          </button>
          <button
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  // Update the render logic
  if (fileType === 'driver') {
    return (
      <div className="p-4">
        <SyntaxHighlighter
          language="python"
          style={materialDark}
          customStyle={{ margin: 0 }}
        >
          {editableContent}
        </SyntaxHighlighter>
      </div>
    );
  }

  if (fileType === 'api' && parsedContent) {
    return (
      <div className="p-4">
        <SyntaxHighlighter
          language="json"
          style={materialDark}
          customStyle={{ margin: 0 }}
        >
          {JSON.stringify(parsedContent, null, 2)}
        </SyntaxHighlighter>
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

  // Default code view with syntax highlighting
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