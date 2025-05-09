import React from 'react';
import { Card } from '../common/Card';

interface InstrumentCardProps {
  instrument: {
    id: string;
    name: string;
    description?: string;
    [key: string]: any;
  };
}

export const InstrumentCard: React.FC<InstrumentCardProps> = ({ instrument }) => {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900">{instrument.name}</h3>
        {instrument.description && (
          <p className="mt-2 text-sm text-gray-600">{instrument.description}</p>
        )}
      </div>
    </Card>
  );
};