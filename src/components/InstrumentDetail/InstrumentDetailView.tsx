import React, { useState, useEffect, useMemo } from 'react';
import { FileSearch } from 'lucide-react';
import FileEditor from './FileEditor';
import TreeNav from '../InstrumentDetail/TreeNav';
import { Instrument, TabType, Model, HalApi, FileItem } from '../../types';
import {
  getHalApiByInstrumentId,
  getModelsByInstrumentId,
  getFileContent,
  saveFileContent,
  downloadFile
} from '../../api/instrumentService';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface InstrumentDetailViewProps {
  instrument: Instrument;
  initialFileId?: string;
  initialFileType?: string;
}

const InstrumentDetailView: React.FC<InstrumentDetailViewProps> = ({
  instrument,
  initialFileId,
  initialFileType
}) => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<TabType>(
    initialFileType?.includes('hal') || initialFileType === 'api' ? 'hal-api' : 'models'
  );
  const [halApi, setHalApi] = useState<HalApi | null>(null);
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [expandedModelId, setExpandedModelId] = useState<string | null>(null);

  // Memoize data fetching to prevent unnecessary API calls
  const fetchData = useMemo(() => {
    return async () => {
      try {
        setLoading(true);
        const [halApiData, modelsData] = await Promise.all([
          getHalApiByInstrumentId(instrument.id),
          getModelsByInstrumentId(instrument.id)
        ]);

        setHalApi(halApiData || null);
        setModels(modelsData);

        if (initialFileId) {
          let file: FileItem | undefined;

          // Look in HAL API files first
          if (halApiData) {
            file = halApiData.files.find(f => f.id === initialFileId);
            if (file) {
              setActiveSection('hal-api');
            }
          }

          // If not found in HAL API, look in models
          if (!file) {
            for (const model of modelsData) {
              file = model.files.find(f => f.id === initialFileId);
              if (file) {
                setExpandedModelId(model.id);
                setActiveSection('models');
                break;
              }
            }
          }

          if (file) {
            setSelectedFile(file);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load content');
      } finally {
        setLoading(false);
      }
    };
  }, [instrument.id, initialFileId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSectionChange = (sectionId: string) => {
    setActiveSection(sectionId as TabType);
    // Don't clear selection when changing sections
  };

  const handleFileSelect = async (fileId: string) => {
    try {
      const file = await getFileContent(fileId);
      if (file) {
        // Clear previous selection
        setSelectedFile(null);
        setIsEditing(false);

        // Set new selection
        setSelectedFile(file);

        // Find the model if it's a model file
        const model = models.find(m => m.files.some(f => f.id === fileId));
        if (model) {
          setExpandedModelId(model.id);
        }

        // Update URL with file info
        const fileType = file.type.toLowerCase();
        navigate(`/explorer/${instrument.id}/${fileType}/${fileId}`, { replace: true });
      }
    } catch (error) {
      console.error('Error fetching file content:', error);
      toast.error('Failed to load file content');
    }
  };

  const handleFileDownload = async () => {
    if (!selectedFile) return;
    try {
      const result = await downloadFile(selectedFile.id);
      if (result) {
        const blob = new Blob([result.content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = result.name;
        a.click();
        URL.revokeObjectURL(url);
        toast.success('File downloaded successfully');
      }
    } catch (error) {
      console.error('Error downloading file:', error);
      toast.error('Failed to download file');
    }
  };

  const handleSaveFile = async (content: string) => {
    if (!selectedFile) return;

    try {
      const success = await saveFileContent(selectedFile.id, content);
      if (success) {
        setSelectedFile(prev => prev ? { ...prev, content } : null);
        setIsEditing(false);
        toast.success('File saved successfully');
      }
    } catch (error) {
      console.error('Error saving file:', error);
      toast.error('Failed to save file');
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    // Reset the content
    if (selectedFile) {
      getFileContent(selectedFile.id).then(file => {
        if (file) {
          setSelectedFile(file);
        }
      });
    }
  };

  const getFileActions = (file: FileItem) => {
    const actions: { allowEdit: boolean; allowDownload: boolean } = {
      allowEdit: file.allowedActions?.includes('edit') ?? false,
      allowDownload: file.allowedActions?.includes('download') ?? true
    };
    return actions;
  };

  return (
    <div className="flex h-full overflow-hidden">
      <div className="w-64 flex-shrink-0 border-r border-gray-200 bg-white overflow-y-auto">
        <TreeNav
          activeSection={activeSection}
          onSectionChange={handleSectionChange}
          halApi={halApi}
          models={models}
          loading={loading}
          onFileSelect={handleFileSelect}
          selectedFileId={selectedFile?.id}
          expandedModelId={expandedModelId}
          onModelExpand={setExpandedModelId}
        />
      </div>

      <div className="flex-1 bg-white overflow-auto">
        {selectedFile ? (
          <FileEditor
            content={selectedFile.content}
            fileName={selectedFile.name}
            isEditing={isEditing}
            onSave={handleSaveFile}
            onStartEdit={() => setIsEditing(true)}
            onDownload={handleFileDownload}
            onCancel={handleCancelEdit}
            {...getFileActions(selectedFile)}
          />
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