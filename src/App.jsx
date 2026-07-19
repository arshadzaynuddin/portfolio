import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import Home from './pages/Home';
import TerminalPage from './pages/TerminalPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import NotFoundPage from './pages/NotFoundPage';

// Lazy: keeps the Firebase auth/firestore SDKs out of the main bundle
const AdminPage = lazy(() => import('./pages/AdminPage'));

function App() {
  return (
    <div className="min-h-screen bg-night-950 text-night-200 font-sans antialiased">
      <Navbar />
      <Suspense fallback={<div className="min-h-screen bg-night-950" />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/terminal" element={<TerminalPage />} />
          <Route path="/projects/:id" element={<ProjectDetailPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
      <Footer />
    </div>
  );
}

export default App;
