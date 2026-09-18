import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/useAuthStore';
import { useTenantStore } from './store/useTenantStore';

import { PublicLayout } from './components/layout/PublicLayout';
import { AppLayout } from './components/layout/AppLayout';

import { HomePage } from './features/marketing/HomePage';
import { ProductPage } from './features/marketing/ProductPage';
import { FeaturesPage } from './features/marketing/FeaturesPage';
import { SolutionsPage } from './features/marketing/SolutionsPage';
import { CustomersPage as MarketingCustomersPage } from './features/marketing/CustomersPage';
import { PricingPage } from './features/marketing/PricingPage';
import { DownloadPage } from './features/marketing/DownloadPage';
import { SecurityPage } from './features/marketing/SecurityPage';
import { AboutPage } from './features/marketing/AboutPage';
import { WhyPage } from './features/marketing/WhyPage';
import { ContactPage } from './features/marketing/ContactPage';
import { ResourcesPage } from './features/marketing/ResourcesPage';
import { DocsPage } from './features/marketing/DocsPage';
import { UserGuidePage } from './features/marketing/UserGuidePage';
import { DevelopersPage } from './features/marketing/DevelopersPage';
import { PartnersPage } from './features/marketing/PartnersPage';
import { ReleasesPage } from './features/marketing/ReleasesPage';
import { HalftoneGeneratorPage } from './features/marketing/HalftoneGeneratorPage';
import { TrustCenterPage } from './features/marketing/TrustCenterPage';
import { PrivacyPage } from './features/marketing/PrivacyPage';
import { TermsPage } from './features/marketing/TermsPage';

import { LoginPage } from './features/auth/LoginPage';
import { RegisterPage } from './features/auth/RegisterPage';
import { ForgotPasswordPage } from './features/auth/ForgotPasswordPage';
import { ResetPasswordPage } from './features/auth/ResetPasswordPage';
import { OnboardingPage } from './features/auth/OnboardingPage';

import { DashboardPage } from './features/dashboard/DashboardPage';
import { LeadsPage } from './features/leads/LeadsPage';
import { LeadDetailPage } from './features/leads/LeadDetailPage';
import { ContactsPage } from './features/contacts/ContactsPage';
import { CompaniesPage } from './features/companies/CompaniesPage';
import { DealsPage } from './features/deals/DealsPage';
import { DealDetailPage } from './features/deals/DealDetailPage';
import { TasksPage } from './features/tasks/TasksPage';
import { ActivitiesPage } from './features/activities/ActivitiesPage';
import { CalendarPage } from './features/calendar/CalendarPage';
import { ProductsPage } from './features/products/ProductsPage';
import { InvoicesPage } from './features/invoices/InvoicesPage';
import { PaymentsPage } from './features/payments/PaymentsPage';
import { ReportsPage } from './features/reports/ReportsPage';
import { ForecastPage } from './features/forecast/ForecastPage';
import { WorkflowsPage } from './features/workflows/WorkflowsPage';
import { CustomFieldsPage } from './features/custom-fields/CustomFieldsPage';
import { AuditLogsPage } from './features/audit/AuditLogsPage';
import { FilesPage } from './features/files/FilesPage';
import { SettingsPage } from './features/settings/SettingsPage';
import { AiAssistantPage } from './features/ai-copilot/AiAssistantPage';
import { ApprovalCenterPage } from './features/approvals/ApprovalCenterPage';
import { TicketsPage } from './features/support/TicketsPage';
import { KnowledgePage } from './features/knowledge/KnowledgePage';
import CustomersPage from './pages/Customers';
import CommandPalette from './components/CommandPalette';
import AiCopilotDrawer from './components/AiCopilotDrawer';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default function App() {
  const { darkMode } = useTenantStore();
  const [commandPaletteOpen, setCommandPaletteOpen] = React.useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Marketing Website Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/product" element={<ProductPage />} />
          <Route path="/features" element={<ProductPage />} />
          <Route path="/solutions" element={<MarketingCustomersPage />} />
          <Route path="/customers" element={<MarketingCustomersPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/download" element={<DownloadPage />} />
          <Route path="/security" element={<TrustCenterPage />} />
          <Route path="/trust" element={<TrustCenterPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/why" element={<WhyPage />} />
          <Route path="/why-twenty" element={<WhyPage />} />
          <Route path="/why-nexus" element={<WhyPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/partners" element={<PartnersPage />} />
          <Route path="/resources" element={<ResourcesPage />} />
          <Route path="/apps" element={<ResourcesPage />} />
          <Route path="/docs" element={<UserGuidePage />} />
          <Route path="/user-guide" element={<UserGuidePage />} />
          <Route path="/developers" element={<DevelopersPage />} />
          <Route path="/releases" element={<ReleasesPage />} />
          <Route path="/halftone" element={<HalftoneGeneratorPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
        </Route>

        {/* Authentication Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />

        {/* Protected CRM Application Routes */}
        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="customers" element={<CustomersPage />} />
          <Route path="leads" element={<LeadsPage />} />
          <Route path="leads/:id" element={<LeadDetailPage />} />
          <Route path="contacts" element={<ContactsPage />} />
          <Route path="companies" element={<CompaniesPage />} />
          <Route path="deals" element={<DealsPage />} />
          <Route path="deals/:id" element={<DealDetailPage />} />
          <Route path="tasks" element={<TasksPage />} />
          <Route path="activities" element={<ActivitiesPage />} />
          <Route path="calendar" element={<CalendarPage />} />
          <Route path="tickets" element={<TicketsPage />} />
          <Route path="knowledge" element={<KnowledgePage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="invoices" element={<InvoicesPage />} />
          <Route path="payments" element={<PaymentsPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="forecast" element={<ForecastPage />} />
          <Route path="workflows" element={<WorkflowsPage />} />
          <Route path="custom-fields" element={<CustomFieldsPage />} />
          <Route path="audit-logs" element={<AuditLogsPage />} />
          <Route path="files" element={<FilesPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="ai-copilot" element={<AiAssistantPage />} />
          <Route path="approvals" element={<ApprovalCenterPage />} />
        </Route>

        {/* Legacy aliases redirecting to /app */}
        <Route path="/approvals" element={<Navigate to="/app/approvals" replace />} />
        <Route path="/leads/*" element={<Navigate to="/app/leads" replace />} />
        <Route path="/deals/*" element={<Navigate to="/app/deals" replace />} />
        <Route path="/tasks" element={<Navigate to="/app/tasks" replace />} />
        <Route path="/reports" element={<Navigate to="/app/reports" replace />} />
        <Route path="/settings" element={<Navigate to="/app/settings" replace />} />

        {/* Fallback 404 redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Next-Gen Global Accelerators */}
      <CommandPalette isOpen={commandPaletteOpen} onClose={setCommandPaletteOpen} />
      <AiCopilotDrawer />
    </BrowserRouter>
  );
}
