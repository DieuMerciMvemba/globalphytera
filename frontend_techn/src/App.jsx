import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import DroneMissions from './pages/DroneMissions';
import Exploitations from './pages/Exploitations';
import Devices from './pages/Devices';
import Login from './pages/Login';
import Analytics from './pages/Analytics';
import MapPage from './pages/MapPage';
import Reports from './pages/Reports';
import Interventions from './pages/Interventions';
import ComingSoon from './components/common/ComingSoon';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="*" element={
          <Layout>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/missions" element={<DroneMissions />} />

              <Route path="/exploitations" element={<Exploitations />} />
              <Route path="/fields" element={<MapPage />} />
              <Route path="/devices" element={<Devices />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/alerts" element={<ComingSoon title="Alertes" />} />
              <Route path="/interventions" element={<Interventions />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/settings" element={<ComingSoon title="Paramètres" />} />

              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </Layout>
        } />
      </Routes>
    </Router>
  );
}

export default App;
