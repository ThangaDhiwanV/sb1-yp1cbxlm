import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Code2, BookOpen, Layout, Cpu, Ruler, Battery, Zap, FileArchive } from 'lucide-react';
import { toast } from 'sonner';
import Card, { CardContent } from '../common/Card';
import { Instrument } from '../../types';
import { cn } from '../../utils/cn';

interface InstrumentCardProps {
  instrument: Instrument;
}

const InstrumentCard: React.FC<InstrumentCardProps> = ({ instrument }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/models/${instrument.id}`);
  };

  const getInstrumentIcon = (type: string) => {
    switch (type) {
      case 'SMU':
        return Zap;
      case 'DMM':
        return Ruler;
      case 'Power Supply':
        return Battery;
      default:
        return Cpu;
    }
  };

  const checkAndNavigate = (viewType: 'hal' | 'api' | 'documentation' | 'panel') => {
    let isAvailable = false;
    let errorMessage = "";

    switch (viewType) {
      case 'hal':
        isAvailable = instrument.hasAbstractClass || false;
        errorMessage = "HAL is not available for this instrument";
        break;
      case 'api':
        isAvailable = instrument.hasApi || false;
        errorMessage = "API is not available for this instrument";
        break;
      case 'documentation':
        isAvailable = instrument.documentation || false;
        errorMessage = "Documentation is not available for this instrument";
        break;
      case 'panel':
        isAvailable = instrument.hasSoftPanel || false;
        errorMessage = "Soft Panel is not available for this instrument";
        break;
    }

    if (!isAvailable) {
      toast.error(errorMessage);
      return;
    }

    navigate(`/explorer/${instrument.type}`, {
      state: {
        fileType: viewType,
        instrumentId: instrument.id
      }
    });
  };

  const IconButton = ({ icon: Icon, label, viewType }: {
    icon: React.ElementType;
    label: string;
    viewType: 'hal' | 'api' | 'documentation' | 'panel'
  }) => {
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
          ? 'from-yellow-50 to-amber-50 hover:from-yellow-100 hover:to-amber-100'
          : instrument.type === 'DMM'
            ? 'from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100'
            : 'from-gray-50 to-slate-50 hover:from-gray-100 hover:to-slate-100'
      )}
      onClick={handleClick}
    >
      <CardContent>
        <div className="mb-6">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <InstrumentIcon className="h-5 w-5 text-gray-700" />
                <h3 className="font-medium text-gray-900">{instrument.name}</h3>
              </div>
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
          <IconButton icon={BookOpen} label="Documentation" viewType="documentation" />
          <IconButton icon={Code2} label="HAL" viewType="hal" />
          <IconButton icon={FileText} label="API" viewType="api" />
          <IconButton icon={Layout} label="Panel" viewType="panel" />
        </div>
      </CardContent>
    </Card>
  );
};

export default InstrumentCard;