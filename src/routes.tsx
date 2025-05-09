import { Routes, Route, Navigate } from 'react-router-dom';
import ProjectPage from './pages/ProjectPage';
import InstrumentsPage from './pages/Instruments';
import ModelsPage from './pages/Models';
import Explorer from './pages/Explorer';
import Macros from './pages/Macros';
import VB from './pages/VB';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Explorer />} />
      <Route path="/project" element={<ProjectPage />} />
      <Route path="/instruments" element={<InstrumentsPage />} />
      <Route path="/models/:instrumentId" element={<ModelsPage />} />
      <Route path="/explorer" element={<Explorer />} />
      <Route path="/explorer/:id" element={<Explorer />} />
      <Route path="/explorer/:id/:fileType/:fileId" element={<Explorer />} />
      <Route path="/macros" element={<Macros />} />
      <Route path="/virtual-bench" element={<VB />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;