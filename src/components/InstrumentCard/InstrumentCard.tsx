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

    const tooltipLabel = viewType === 'api' ? 'API' : label;

    return (
      <div className="group relative">
        <div
          onClick={handleIconClick}
          className={cn(
            'p-2.5 rounded-lg transition-all duration-200',
            'bg-white/80 backdrop-blur-sm hover:bg-white',
            'border border-white/60 hover:border-primary-200',
            'shadow-sm hover:shadow-md',
            'cursor-pointer'
          )}
        >
          <Icon className="h-5 w-5 text-primary-600" />
        </div>
        <div className={cn(
          'absolute -top-9 left-1/2 transform -translate-x-1/2',
          'px-3 py-1.5 rounded-lg text-xs font-medium',
          'bg-gray-900/90 text-white whitespace-nowrap',
          'opacity-0 group-hover:opacity-100 transition-opacity duration-200',
          'pointer-events-none z-10',
          'backdrop-blur-sm shadow-lg'
        )}>
          {tooltipLabel}
        </div>
      </div>
    );
  };

  const InstrumentIcon = getInstrumentIcon(instrument.type);

  const getCardGradient = (type: string) => {
    switch (type) {
      case 'SMU':
        return 'from-amber-50 via-orange-50 to-yellow-50 hover:from-amber-100 hover:via-orange-100 hover:to-yellow-100';
      case 'DMM':
        return 'from-blue-50 via-indigo-50 to-violet-50 hover:from-blue-100 hover:via-indigo-100 hover:to-violet-100';
      case 'Power Supply':
        return 'from-emerald-50 via-green-50 to-teal-50 hover:from-emerald-100 hover:via-green-100 hover:to-teal-100';
      default:
        return 'from-rose-50 via-pink-50 to-fuchsia-50 hover:from-rose-100 hover:via-pink-100 hover:to-fuchsia-100';
    }
  };

  return (
    <Card
      className={cn(
        'transform transition-all duration-200 hover:scale-[1.02]',
        'bg-gradient-to-br',
        getCardGradient(instrument.type),
        'border-2 border-white/80 hover:border-white',
        'shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:shadow-gray-300/50'
      )}
      onClick={handleClick}
    >
      <CardContent className="p-4">
        <div className="flex flex-col gap-3">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className={cn(
                'p-2 rounded-lg',
                'bg-white/80 backdrop-blur-sm',
                'border border-white/60'
              )}>
                <InstrumentIcon className="h-5 w-5 text-primary-600" />
              </div>
              <h3 className="font-medium text-gray-900">{instrument.name}</h3>
            </div>
            <div className={cn(
              'flex items-center gap-2 px-3 py-1.5 rounded-lg w-fit',
              'bg-white/80 backdrop-blur-sm text-primary-700',
              'border border-white/60'
            )}>
              <FileArchive className="h-4 w-4 text-primary-600" />
              <span className="text-sm">{instrument.driverCount || 0} Available Driver{instrument.driverCount !== 1 ? 's' : ''}</span>
            </div>
          </div>

          <div className="flex justify-between items-center border-t border-white/60 pt-3 mt-1">
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