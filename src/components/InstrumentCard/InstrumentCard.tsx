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
            'p-2.5 rounded-lg transition-all duration-200',
            'bg-white/80 hover:bg-white',
            'border border-primary-100/60 hover:border-primary-300/60',
            'shadow-sm hover:shadow-md',
            'cursor-pointer'
          )}
        >
          <Icon className="h-5 w-5 text-primary-600" />
        </div>
        <div className={cn(
          'absolute -top-8 left-1/2 transform -translate-x-1/2',
          'px-2 py-1 rounded-md text-xs font-medium',
          'bg-gray-800 text-white whitespace-nowrap',
          'opacity-0 group-hover:opacity-100 transition-opacity duration-200',
          'pointer-events-none z-10'
        )}>
          {label}
        </div>
      </div>
    );
  };

  const InstrumentIcon = getInstrumentIcon(instrument.type);

  return (
    <Card
      className={cn(
        'transform transition-all duration-200 hover:scale-[1.02]',
        'bg-gradient-to-br from-white via-primary-50/30 to-secondary-100/50',
        'hover:from-white hover:via-primary-100/40 hover:to-secondary-200/60',
        'border-2 border-primary-200/30 hover:border-primary-300/50',
        'shadow-lg shadow-primary-100/20 hover:shadow-xl hover:shadow-primary-200/30'
      )}
      onClick={handleClick}
    >
      <CardContent className="p-4">
        <div className="flex flex-col gap-3">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className={cn(
                'p-2 rounded-lg',
                'bg-gradient-to-br from-primary-50 to-primary-100/50',
                'border border-primary-200/30'
              )}>
                <InstrumentIcon className="h-5 w-5 text-primary-600" />
              </div>
              <h3 className="font-medium text-gray-900">{instrument.name}</h3>
            </div>
            <div className={cn(
              'flex items-center gap-2 px-3 py-1.5 rounded-lg w-fit',
              'bg-primary-50/80 text-primary-700',
              'border border-primary-100/60'
            )}>
              <FileArchive className="h-4 w-4 text-primary-600" />
              <span className="text-sm">{instrument.driverCount || 0} Available Driver{instrument.driverCount !== 1 ? 's' : ''}</span>
            </div>
          </div>

          <div className="flex justify-between items-center border-t border-primary-200/40 pt-3 mt-1">
            <IconButton icon={BookOpen} label="Documentation" viewType="documentation" />
            <IconButton icon={Code2} label="HAL" viewType="hal" />
            <IconButton icon={FileText} label="API" viewType="api" />
            <IconButton icon={Layout} label="Panel" viewType="panel" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InstrumentCard;