import { Routes, Route, Navigate } from 'react-router-dom';
import ProjectPage from './pages/project/project-page';
import InstrumentsPage from './pages/instruments/instruments-page';
import ModelsPage from './pages/models/models-page';
import ExplorerPage from './pages/explorer/explorer-page';
import MacrosPage from './pages/macros/macros-page';
import VirtualBenchPage from './pages/virtual-bench/virtual-bench-page';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<ExplorerPage />} />
      <Route path="/project" element={<ProjectPage />} />
      <Route path="/instruments" element={<InstrumentsPage />} />
      <Route path="/models/:instrumentId" element={<ModelsPage />} />
      <Route path="/explorer" element={<ExplorerPage />} />
      <Route path="/explorer/:id" element={<ExplorerPage />} />
      <Route path="/explorer/:id/:fileType/:fileId" element={<ExplorerPage />} />
      <Route path="/macros" element={<MacrosPage />} />
      <Route path="/virtual-bench" element={<VirtualBenchPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;