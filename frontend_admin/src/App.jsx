import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './components/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import Reports from './pages/admin/Reports';
import ReportDetails from './pages/admin/ReportDetails';
import Technicians from './pages/admin/Technicians';
import IoTSupervision from './pages/admin/IoTSupervision';
import Farmers from './pages/admin/Farmers';
import Marketplace from './pages/admin/Marketplace';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="reports" element={<Reports />} />
          <Route path="reports/:id" element={<ReportDetails />} />
          <Route path="technicians" element={<Technicians />} />
          <Route path="iot" element={<IoTSupervision />} />
          <Route path="farmers" element={<Farmers />} />
          <Route path="marketplace" element={<Marketplace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
