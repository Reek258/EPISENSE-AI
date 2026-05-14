import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import WaterReportsPage from './pages/WaterReportsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import HospitalDataPage from './pages/HospitalDataPage';
import AlertsPage from './pages/AlertsPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import PageLayout from './components/layout/PageLayout';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<PageLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            {/* Placeholder for other routes */}
            <Route path="/heatmap" element={<DashboardPage />} />
            <Route path="/hospital" element={<HospitalDataPage />} />
            <Route path="/reports" element={<WaterReportsPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/alerts" element={<AlertsPage />} />
            <Route path="/settings" element={<div className="p-4">Settings Placeholder</div>} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
