import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Code2, BookOpen, Layout, Cpu, Ruler, Battery, Zap, FileArchive } from 'lucide-react';
import { toast } from 'sonner';
import Card, { CardContent } from '../common/Card';
import { Instrument } from '../../types';
import { cn } from '../../utils/cn';
import { getHalApiByInstrumentId, getFileContent } from '../../api/instrumentService';

interface InstrumentCardProps {
  instrument: Instrument;
}

const InstrumentCard: React.FC<InstrumentCardProps> = ({ instrument }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/models/${instrument.id}`);  // Navigate to models page for this instrument
  };

  const getInstrumentIcon = (type: string) => {
    switch (type) {
      case 'SMU':
        return Zap;
      case 'DMM':
        return Ruler;
      case 'Power':
        return Battery;
      default:
        return Cpu;
    }
  };

  const checkAndNavigate = async (viewType: string) => {
    try {
      const halApi = await getHalApiByInstrumentId(instrument.id);
      let fileId: string | undefined;
      let fileType: string | undefined;

      if (viewType === 'hal') {
        const file = halApi?.files.find(f => f.type === 'abstract');
        if (file) {
          fileId = file.id;
          fileType = 'hal';
        }
      } else if (viewType === 'api') {
        const file = halApi?.files.find(f => f.type === 'api');
        if (file) {
          fileId = file.id;
          fileType = 'api';
        }
      } else if (viewType === 'manual') {
        const file = halApi?.files.find(f => f.type === 'Documentation');
        if (file) {
          fileId = file.id;
          fileType = 'manual';
        }
      }

      if (fileId && fileType) {
        const fileContent = await getFileContent(fileId);
        if (fileContent) {
          navigate(`/explorer/${instrument.id}/${fileType}/${fileId}`);
        } else {
          toast.error(`Unable to load ${viewType} content`);
        }
      } else {
        const contentTypes: Record<string, string> = {
          hal: 'HAL',
          api: 'API',
          manual: 'Documentation',
          panel: 'Soft Panel'
        };
        toast.error(`${contentTypes[viewType]} is not available for this instrument`);
      }
    } catch (error) {
      toast.error('Failed to check content availability');
    }
  };

  const IconButton = ({ icon: Icon, label, viewType }: { icon: React.ElementType; label: string; viewType: string }) => {
    const handleIconClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      checkAndNavigate(viewType);
    };

    return (
      <div className="group relative">
        <div
          onClick={handleIconClick}
          className={cn(
            'p-3 rounded-lg transition-colors cursor-pointer',
            'bg-white/80 hover:bg-white',
            'border border-gray-200 shadow-sm'
          )}
        >
          <Icon className="h-6 w-6 text-gray-600" />
        </div>
        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 -translate-y-full z-10
                opacity-0 group-hover:opacity-100 transition-opacity
                bg-gray-800 text-white text-sm px-3 py-1.5 rounded-md whitespace-nowrap">
          {label}
        </div>
      </div>
    );
  };

  const InstrumentIcon = getInstrumentIcon(instrument.type);

  return (
    <Card
      className={cn(
        'transform transition-all duration-200 hover:scale-[1.02] min-h-[200px]',
        'bg-gradient-to-br',
        instrument.type === 'SMU'
          ? 'from-primary-50 to-primary-100 hover:from-primary-100 hover:to-primary-200'
          : 'from-cyan-50 to-blue-50 hover:from-cyan-100 hover:to-blue-100'
      )}
      onClick={handleClick}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className={cn(
              'p-3 rounded-lg',
              instrument.type === 'SMU'
                ? 'bg-primary-100'
                : 'bg-cyan-100'
            )}>
              <InstrumentIcon className={cn(
                'h-7 w-7',
                instrument.type === 'SMU'
                  ? 'text-primary-600'
                  : 'text-cyan-600'
              )} />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">{instrument.name}</h3>
              <div className={cn(
                'flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm',
                'bg-gray-100/80 text-gray-700 w-fit'
              )}>
                <FileArchive className="h-4 w-4 text-gray-600" />
                <span>{instrument.driverCount || 0} Available Driver{instrument.driverCount !== 1 ? 's' : ''}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center px-4">
          <IconButton icon={BookOpen} label="Documentation" viewType="manual" />
          <IconButton icon={Code2} label="HAL" viewType="hal" />
          <IconButton icon={FileText} label="API" viewType="api" />
          <IconButton icon={Layout} label="Panel" viewType="panel" />
        </div>
      </CardContent>
    </Card>
  );
};

export default InstrumentCard;