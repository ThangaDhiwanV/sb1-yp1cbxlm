import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock } from 'lucide-react';
import { Model } from '../../types';
import Card, { CardContent } from '../common/Card';
import { cn } from '../../utils/cn';

interface ModelCardProps {
  model: Model;
  selectedFileId?: string;
}

const ModelCard: React.FC<ModelCardProps> = ({ model, selectedFileId }) => {
  const navigate = useNavigate();

  const statusColors = {
    active: 'from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100',
    offline: 'from-red-50 to-rose-50 hover:from-red-100 hover:to-rose-100',
  };

  const statusBadgeColors = {
    active: 'bg-green-100 text-green-800',
    offline: 'bg-red-100 text-red-800',
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const handleFileClick = (fileId: string, fileType: string) => {
    navigate(`/explorer/${model.instrumentId}/${fileType}/${fileId}`);
  };

  return (
    <Card
      className={cn(
        'transform transition-all duration-200 hover:scale-[1.01]',
        'bg-gradient-to-br shadow-sm w-full',
        statusColors[model.status || 'active']
      )}
    >
      <CardContent className="p-2">
        <div className="flex items-start justify-between mb-1.5">
          <div className="flex items-center space-x-2">
            <div>
              <h3 className="font-medium text-sm text-gray-900">{model.name}</h3>
              <p className="text-xs text-gray-500 flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                {formatDate(model.lastUpdated)}
              </p>
            </div>
          </div>
          <span className={cn(
            'px-1.5 py-0.5 text-xs font-medium rounded-full',
            statusBadgeColors[model.status || 'active']
          )}>
            {model.status || 'active'}
          </span>
        </div>

        <div className="space-y-1.5">
          {model.files.map(file => (
            <button
              key={file.id}
              onClick={() => handleFileClick(file.id, file.type)}
              className="w-full text-left"
            >
              <div
                className={cn(
                  'flex items-center p-1.5 rounded-md border transition-colors text-xs',
                  selectedFileId === file.id
                    ? 'bg-white border-primary-500 ring-1 ring-primary-500'
                    : 'bg-white/60 border-gray-200 hover:border-primary-300'
                )}
              >
                <span className="font-medium truncate">{file.name}</span>
              </div>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ModelCard;