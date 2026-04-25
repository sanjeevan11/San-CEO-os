import { Navigate, Route, Routes } from 'react-router-dom';
import AppShell from './components/AppShell';
import Landing from './routes/Landing';
import DemoQuote from './routes/DemoQuote';
import AdminOverview from './routes/AdminOverview';
import AdminLeads from './routes/AdminLeads';
import AdminPricing from './routes/AdminPricing';
import AdminSettings from './routes/AdminSettings';
import AdminAnalytics from './routes/AdminAnalytics';
import AdminExport from './routes/AdminExport';

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/" element={<Landing />} />
        <Route path="/demo" element={<DemoQuote />} />
        <Route path="/admin" element={<AdminOverview />} />
        <Route path="/admin/leads" element={<AdminLeads />} />
        <Route path="/admin/pricing" element={<AdminPricing />} />
        <Route path="/admin/settings" element={<AdminSettings />} />
        <Route path="/admin/analytics" element={<AdminAnalytics />} />
        <Route path="/admin/export" element={<AdminExport />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
