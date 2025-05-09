import { Routes, Route, Navigate } from 'react-router-dom';
import Instruments from './pages/Instruments';
import Models from './pages/Models';
import Explorer from './pages/Explorer';
import ProjectPage from './pages/ProjectPage';
import Macrobs from './pages/Macros';
import VB from './pages/VB';
import TreeDemo from './pages/TreeDemo';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<ProjectPage />} />
            <Route path="/instruments" element={<Instruments />} />
            <Route path="/models/:instrumentId" element={<Models />} />
            <Route path="/explorer/:id" element={<Explorer />} />
            <Route path="/explorer/:id/:fileType/:fileId" element={<Explorer />} />
            <Route path="/macrobs" element={<Macrobs />} />
            <Route path="/vb" element={<VB />} />
            <Route path="/tree-demo" element={<TreeDemo />} />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

export default AppRoutes;