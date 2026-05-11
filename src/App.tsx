import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { EditorProvider } from "@/contexts/EditorContext";
import { ClinicProvider } from "@/contexts/ClinicContext";
import Overview from "./pages/Overview";
import SiteEditorShell from "./pages/SiteEditorShell";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import Staff from "./pages/Staff";
import TherapistDashboard from "./pages/TherapistDashboard";
import Appointments from "./pages/Appointments";
import Patients from "./pages/Patients";
import PatientLogs from "./pages/PatientLogs";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <EditorProvider>
        <ClinicProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<DashboardLayout><Overview /></DashboardLayout>} />
              <Route path="/editor" element={<DashboardLayout><SiteEditorShell /></DashboardLayout>} />
              {/* Legacy site-section routes redirect into the consolidated editor */}
              <Route path="/services"   element={<Navigate to="/editor?tab=services" replace />} />
              <Route path="/therapists" element={<Navigate to="/editor?tab=therapists" replace />} />
              <Route path="/gallery"    element={<Navigate to="/editor?tab=gallery" replace />} />
              <Route path="/booking"    element={<Navigate to="/editor?tab=booking" replace />} />
              <Route path="/reviews"    element={<Navigate to="/editor?tab=reviews" replace />} />
              <Route path="/pricing"    element={<Navigate to="/editor?tab=pricing" replace />} />
              <Route path="/learning"   element={<Navigate to="/editor?tab=learning" replace />} />
              <Route path="/seo"        element={<Navigate to="/editor?tab=seo" replace />} />
              <Route path="/publish"    element={<Navigate to="/editor?tab=publish" replace />} />
              {/* Clinic */}
              <Route path="/therapist-dashboard" element={<DashboardLayout><TherapistDashboard /></DashboardLayout>} />
              <Route path="/appointments" element={<DashboardLayout><Appointments /></DashboardLayout>} />
              <Route path="/patients" element={<DashboardLayout><Patients /></DashboardLayout>} />
              <Route path="/patient-logs" element={<DashboardLayout><PatientLogs /></DashboardLayout>} />
              {/* Other */}
              <Route path="/analytics" element={<DashboardLayout><Analytics /></DashboardLayout>} />
              <Route path="/staff" element={<DashboardLayout><Staff /></DashboardLayout>} />
              <Route path="/settings" element={<DashboardLayout><Settings /></DashboardLayout>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </ClinicProvider>
      </EditorProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
