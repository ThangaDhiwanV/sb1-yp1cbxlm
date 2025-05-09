import { BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from 'sonner';
import { createContext, useContext, useState } from 'react';
import AppRoutes from './routes';
import MainLayout from './components/layout/MainLayout';
import CreationSlider from './components/common/CreationSlider';

interface CreationContextType {
  isCreationSliderOpen: boolean;
  setIsCreationSliderOpen: (open: boolean) => void;
}

export const CreationContext = createContext<CreationContextType>({
  isCreationSliderOpen: false,
  setIsCreationSliderOpen: () => { },
});

export const useCreationContext = () => useContext(CreationContext);

function App() {
  const [isCreationSliderOpen, setIsCreationSliderOpen] = useState(false);

  return (
    <Router>
      <CreationContext.Provider value={{ isCreationSliderOpen, setIsCreationSliderOpen }}>
        <MainLayout>
          <AppRoutes />
          <CreationSlider
            isOpen={isCreationSliderOpen}
            onClose={() => setIsCreationSliderOpen(false)}
          />
        </MainLayout>
        <Toaster
          position="top-right"
          richColors
          closeButton
          expand={false}
          className="toaster-compact"
        />
      </CreationContext.Provider>
    </Router>
  );
}

export default App;