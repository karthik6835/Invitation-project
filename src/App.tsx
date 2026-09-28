import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import LandingPage from '@/pages/LandingPage';
import LoginPage from '@/pages/LoginPage';
import SignupPage from '@/pages/SignupPage';
import DashboardPage from '@/pages/DashboardPage';
import TemplateGalleryPage from '@/pages/TemplateGalleryPage';
import EditorPage from '@/pages/EditorPage';
import InvitationViewPage from '@/pages/InvitationViewPage';
import PricingPage from '@/pages/PricingPage';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center bg-stone-50"><div className="w-8 h-8 border-2 border-stone-300 border-t-stone-800 rounded-full animate-spin" /></div>;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-stone-50">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

function PublicRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/invite/:uuid" element={<InvitationViewPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function ProtectedRoutes() {
  return (
    <Routes>
      <Route path="/dashboard" element={<ProtectedRoute><AppLayout><DashboardPage /></AppLayout></ProtectedRoute>} />
      <Route path="/templates" element={<ProtectedRoute><AppLayout><TemplateGalleryPage /></AppLayout></ProtectedRoute>} />
      <Route path="/editor/:templateId" element={<ProtectedRoute><AppLayout><EditorPage /></AppLayout></ProtectedRoute>} />
      <Route path="/editor/edit/:invitationId" element={<ProtectedRoute><AppLayout><EditorPage /></AppLayout></ProtectedRoute>} />
      <Route path="/pricing" element={<AppLayout><PricingPage /></AppLayout>} />
      <Route path="/" element={<LandingPage />} />
      <Route path="/invite/:uuid" element={<InvitationViewPage />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

function AppRoutes() {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center bg-stone-50"><div className="w-8 h-8 border-2 border-stone-300 border-t-stone-800 rounded-full animate-spin" /></div>;
  return user ? <ProtectedRoutes /> : <PublicRoutes />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
