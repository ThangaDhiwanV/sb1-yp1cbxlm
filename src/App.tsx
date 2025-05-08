import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { Wrench } from 'lucide-react';
import Instruments from './pages/Instruments';
import Models from './pages/Models';
import Explorer from './pages/Explorer';
import CreationSlider from './components/common/CreationSlider';
import { useState } from 'react';
import { cn } from './utils/cn';

function App() {
  const [isCreationSliderOpen, setIsCreationSliderOpen] = useState(false);

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Toaster position="top-right" richColors />
        <Routes>
          <Route path="/" element={<Instruments />} />
          <Route path="/models/:instrumentId" element={<Models />} />
          <Route path="/explorer/:id" element={<Explorer />} />
          <Route path="/explorer/:id/:fileType/:fileId" element={<Explorer />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <CreationSlider
          isOpen={isCreationSliderOpen}
          onClose={() => setIsCreationSliderOpen(false)}
        />
        <div className="group fixed bottom-6 right-24 inline-block">
          <div className={cn(
            "absolute bottom-[100%] left-1/2 -translate-x-1/2 mb-2",
            "px-3 py-1.5 rounded-lg",
            "bg-gray-800 text-white text-sm",
            "opacity-0 group-hover:opacity-100",
            "transform transition-all duration-200",
            "pointer-events-none",
            "whitespace-nowrap"
          )}>
            Create HAL/Driver
          </div>
          <button
            onClick={() => setIsCreationSliderOpen(true)}
            className={cn(
              "p-4",
              "bg-primary-500 text-white rounded-full",
              "shadow-lg hover:shadow-xl",
              "transform transition-all duration-300",
              "hover:scale-105 hover:bg-primary-600",
              "z-50"
            )}
            aria-label="Create HAL/Driver"
          >
            <Wrench className="h-6 w-6" />
          </button>
        </div>
      </div>
    </Router>
  );
}

export default App;