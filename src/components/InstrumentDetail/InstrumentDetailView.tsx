import React, { useState, useEffect } from 'react';
import { FileSearch } from 'lucide-react';
import FileEditor from './FileEditor';
import TreeNav from './TreeNav';
import { Instrument, Model, HalApi, FileItem, ExplorerResponse } from '../../types';
import { toast } from 'sonner';
import ErrorBoundary from '../common/ErrorBoundary';
import { getFileContent } from '../../api/instrumentService';
import { getModelsByInstrumentId } from '../../api/modelService';
import { getHalApiByInstrumentId } from '../../api/halService';

interface InstrumentDetailViewProps {
  instrument?: Instrument | null;
  initialFileId?: string;
  allInstruments: Instrument[];
  explorerData?: ExplorerResponse;
}

const InstrumentDetailView: React.FC<InstrumentDetailViewProps> = ({
  instrument,
  initialFileId,
  allInstruments,
  explorerData
}) => {
  const [halApiData, setHalApiData] = useState<HalApi[]>([]);
  const [modelsData, setModelsData] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);
  const [fileLoading, setFileLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [expandedNodes, setExpandedNodes] = useState({
    instrumentId: instrument?.id || null,
    modelId: null as string | null,
    expandedModels: [] as string[]
  });

  useEffect(() => {
    const loadData = async () => {
      if (!instrument?.id) return;
      try {
        setLoading(true);

        // Load HAL API data
        const halApi = await getHalApiByInstrumentId(instrument.id);
        if (halApi) {
          setHalApiData([halApi]);
        }

        // Load models data
        const models = await getModelsByInstrumentId(instrument.id);
        setModelsData(models);

        // If initialFileId is provided, expand necessary nodes
        if (initialFileId) {
          const model = models.find(m => m.files?.some(f => f.id === initialFileId));
          if (model) {
            setExpandedNodes(prev => ({
              ...prev,
              modelId: 'models',
              expandedModels: [...prev.expandedModels, model.id]
            }));
          }
        }

        // If initialFileId is provided, load the file content
        if (initialFileId) {
          handleFileSelect(initialFileId);
        }
      } catch (error) {
        console.error('Error loading data:', error);
        toast.error('Failed to load instrument data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [instrument?.id, initialFileId]);

  const handleFileSelect = async (fileId: string) => {
    try {
      setFileLoading(true);
      const file = await getFileContent(fileId);
      if (!file) {
        toast.error('File not found');
        return;
      }
      setSelectedFile(file);
    } catch (error) {
      console.error('Error loading file:', error);
      toast.error('Failed to load file content');
    } finally {
      setFileLoading(false);
    }
  };

  const handleSaveFile = async (content: string) => {
    if (!selectedFile) return;

    try {
      // Update the file content
      const updatedFile = { ...selectedFile, content };
      setSelectedFile(updatedFile);
      setIsEditing(false);
      toast.success('File saved successfully');
    } catch (error) {
      console.error('Error saving file:', error);
      toast.error('Failed to save file');
    }
  };

  const handleFileDownload = async () => {
    if (!selectedFile) return;
    try {
      const blob = new Blob([selectedFile.content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = selectedFile.name;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('File downloaded successfully');
    } catch (error) {
      console.error('Error downloading file:', error);
      toast.error('Failed to download file');
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleNodeExpand = (type: 'instrument' | 'model', id: string) => {
    setExpandedNodes(prev => {
      switch (type) {
        case 'instrument':
          return {
            ...prev,
            instrumentId: prev.instrumentId === id ? null : id,
            modelId: prev.instrumentId === id ? null : 'models'
          };
        case 'model':
          if (id === 'models') {
            return {
              ...prev,
              modelId: prev.modelId === 'models' ? null : 'models'
            };
          }
          return {
            ...prev,
            modelId: 'models',
            expandedModels: prev.expandedModels.includes(id)
              ? prev.expandedModels.filter(m => m !== id)
              : [...prev.expandedModels, id]
          };
        default:
          return prev;
      }
    });
  };

  const getFileType = (type: string): 'manual' | 'documentation' | 'hal' | 'api' | 'panel' | 'driver' => {
    switch (type.toLowerCase()) {
      case 'driver':
        return 'driver';
      case 'manual':
        return 'manual';
      case 'documentation':
        return 'documentation';
      case 'abstract':
        return 'hal';
      case 'api':
        return 'api';
      case 'panel':
        return 'panel';
      default:
        return 'documentation';
    }
  };

  const getFileActions = (file: FileItem) => {
    const actions = {
      allowEdit: file.allowedActions?.includes('edit') ?? false,
      allowDownload: file.allowedActions?.includes('download') ?? true
    };
    return actions;
  };

  return (
    <div className="flex h-full overflow-hidden">
      <div className="w-64 flex-shrink-0 border-r border-gray-200 bg-white overflow-y-auto">
        <TreeNav
          instruments={allInstruments}
          halApi={null}
          models={modelsData}
          loading={loading}
          onFileSelect={handleFileSelect}
          selectedFileId={selectedFile?.id}
          expandedNodes={expandedNodes}
          onNodeExpand={handleNodeExpand}
          halApiData={halApiData}
          explorerData={explorerData}
        />
      </div>

      <div className="flex-1 bg-white overflow-auto">
        {fileLoading ? (
          <div className="h-full flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500 mb-4"></div>
              <p className="text-sm text-gray-500">Loading file content...</p>
            </div>
          </div>
        ) : selectedFile ? (
          <ErrorBoundary>
            <FileEditor
              content={selectedFile.content}
              fileName={selectedFile.name}
              isEditing={isEditing}
              fileType={getFileType(selectedFile.type)}
              onSave={handleSaveFile}
              onStartEdit={() => setIsEditing(true)}
              onDownload={handleFileDownload}
              onCancel={handleCancelEdit}
              {...getFileActions(selectedFile)}
            />
          </ErrorBoundary>
        ) : (
          <div className="h-full flex items-center justify-center bg-gray-50">
            <div className="text-center p-6">
              <FileSearch className="h-10 w-10 text-gray-400 mx-auto mb-3" />
              <p className="text-sm text-gray-500 mb-1">Select a file to view</p>
              <p className="text-xs text-gray-400">Choose from the list on the left</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InstrumentDetailView;