import { Route, Routes } from 'react-router';
import { LoginPage } from '../features/authorization/components/pages/loginPage';
import { RegisterPage } from '../features/authorization/components/pages/registerPage';
import { ProtectedRoute } from '../components/protectedRoute';
import DashboardPage from '../features/dashboard/components/pages/dashboardPage';

export const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<h1>Welcome</h1>} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route
      path="/dashboard"
      element={
        <ProtectedRoute>
          <DashboardPage />
        </ProtectedRoute>
      }
    />
  </Routes>
);
