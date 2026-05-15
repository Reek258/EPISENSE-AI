import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import WaterReportsPage from './pages/WaterReportsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import HospitalDataPage from './pages/HospitalDataPage';
import HospitalResourcePage from './pages/HospitalResourcePage';
import AlertsPage from './pages/AlertsPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import PageLayout from './components/layout/PageLayout';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default Redirect */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<PageLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/hospital" element={<HospitalDataPage />} />
            <Route path="/resources" element={<HospitalResourcePage />} />
            <Route path="/reports" element={<WaterReportsPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/alerts" element={<AlertsPage />} />
            <Route path="/settings" element={<div className="p-4">Settings Placeholder</div>} />
          </Route>
        </Route>

        {/* Catch-all Redirect back to Dashboard */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
