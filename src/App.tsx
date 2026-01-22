import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { EditorProvider } from "@/contexts/EditorContext";
import Overview from "./pages/Overview";
import SiteEditor from "./pages/SiteEditor";
import Services from "./pages/Services";
import Therapists from "./pages/Therapists";
import Gallery from "./pages/Gallery";
import Booking from "./pages/Booking";
import Reviews from "./pages/Reviews";
import Pricing from "./pages/Pricing";
import Learning from "./pages/Learning";
import SEO from "./pages/SEO";
import Publish from "./pages/Publish";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import Staff from "./pages/Staff";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <EditorProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<DashboardLayout><Overview /></DashboardLayout>} />
            <Route path="/editor" element={<DashboardLayout><SiteEditor /></DashboardLayout>} />
            <Route path="/services" element={<DashboardLayout><Services /></DashboardLayout>} />
            <Route path="/therapists" element={<DashboardLayout><Therapists /></DashboardLayout>} />
            <Route path="/gallery" element={<DashboardLayout><Gallery /></DashboardLayout>} />
            <Route path="/booking" element={<DashboardLayout><Booking /></DashboardLayout>} />
            <Route path="/reviews" element={<DashboardLayout><Reviews /></DashboardLayout>} />
            <Route path="/pricing" element={<DashboardLayout><Pricing /></DashboardLayout>} />
            <Route path="/learning" element={<DashboardLayout><Learning /></DashboardLayout>} />
            <Route path="/seo" element={<DashboardLayout><SEO /></DashboardLayout>} />
            <Route path="/publish" element={<DashboardLayout><Publish /></DashboardLayout>} />
            <Route path="/analytics" element={<DashboardLayout><Analytics /></DashboardLayout>} />
            <Route path="/staff" element={<DashboardLayout><Staff /></DashboardLayout>} />
            <Route path="/settings" element={<DashboardLayout><Settings /></DashboardLayout>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </EditorProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
