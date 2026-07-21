import { Routes, Route } from 'react-router-dom';
import { AppLayout } from './layouts/AppLayout';
import {
  Dashboard,
  Orders,
  OrderDetail,
  Customers,
  CustomerDetail,
  Campaigns,
  CampaignBuilder,
  CampaignDetail,
  Automations,
  AutomationBuilder,
  Templates,
  TemplateEditor,
  Broadcasts,
  Settings,
  Analytics,
  ActivityLog,
  SetupWizard
} from './pages';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/setup" element={<SetupWizard />} />
      <Route element={<AppLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/orders/:id" element={<OrderDetail />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/customers/:id" element={<CustomerDetail />} />
        <Route path="/campaigns" element={<Campaigns />} />
        <Route path="/campaigns/new" element={<CampaignBuilder />} />
        <Route path="/campaigns/:id" element={<CampaignDetail />} />
        <Route path="/automations" element={<Automations />} />
        <Route path="/automations/new" element={<AutomationBuilder />} />
        <Route path="/automations/:id/edit" element={<AutomationBuilder />} />
        <Route path="/templates" element={<Templates />} />
        <Route path="/templates/:id" element={<TemplateEditor />} />
        <Route path="/broadcasts" element={<Broadcasts />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/activity" element={<ActivityLog />} />
      </Route>
    </Routes>
  );
}
