import { Route, Routes } from 'react-router';

export const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<div>Main page</div>} />
    <Route path="/login" element={<div>Login page</div>} />
    <Route path="/register" element={<div>Register page</div>} />
    <Route path="/dashboard" element={<div>Dashboard page</div>} />
  </Routes>
);
