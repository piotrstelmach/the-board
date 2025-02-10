import { Route, Routes } from 'react-router';
import { LoginPage } from '../features/authorization/components/pages/loginPage';
import { RegisterPage } from '../features/authorization/components/pages/registerPage';
import { ProtectedRoute } from '../components/protectedRoute';

export const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<div>Main page</div>} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route
      path="/dashboard"
      element={
        <ProtectedRoute>
          <h1>Dashboard</h1>
        </ProtectedRoute>
      }
    />
  </Routes>
);
