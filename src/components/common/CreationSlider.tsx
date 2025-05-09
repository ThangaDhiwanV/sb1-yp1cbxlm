import React from 'react';
import { X } from 'lucide-react';

interface CreationSliderProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreationSlider: React.FC<CreationSliderProps> = ({ isOpen, onClose }) => {
  return (
    <div
      className={`fixed right-0 top-0 h-full w-96 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Create New</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="space-y-4">
          {/* Add creation options here */}
        </div>
      </div>
    </div>
  );
};

export default CreationSlider;