
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Index />} />
          <Route path="/risk-analysis" element={<Index />} />
          <Route path="/assessment-gap" element={<Index />} />
          <Route path="/assessment-evidence" element={<Index />} />
          <Route path="/treatment-dashboard" element={<Index />} />
          <Route path="/company-details" element={<Index />} />
          <Route path="/context-org" element={<Index />} />
          <Route path="/context-organization-reports" element={<Index />} />
          <Route path="/leadership" element={<Index />} />
          <Route path="/leadership-reports" element={<Index />} />
          <Route path="/planning" element={<Index />} />
          <Route path="/planning-reports" element={<Index />} />
          <Route path="/support" element={<Index />} />
          <Route path="/support-reports" element={<Index />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
