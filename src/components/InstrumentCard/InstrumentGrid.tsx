import React from 'react';
import { InstrumentCard } from './InstrumentCard';

interface InstrumentGridProps {
  instruments: any[];
}

const InstrumentGrid: React.FC<InstrumentGridProps> = ({ instruments }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {instruments.map((instrument) => (
        <InstrumentCard key={instrument.id} instrument={instrument} />
      ))}
    </div>
  );
};

export default InstrumentGrid;