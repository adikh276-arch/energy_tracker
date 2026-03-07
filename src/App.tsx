import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { EnergyProvider } from "@/context/EnergyContext";
import { AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import EnergyCheckIn from "./pages/EnergyCheckIn";
import EnergyFactors from "./pages/EnergyFactors";
import TodaySummary from "./pages/TodaySummary";
import WeeklyOverview from "./pages/WeeklyOverview";
import NotFound from "./pages/NotFound";
import PageTransition from "./components/PageTransition";
import AuthGuard from "./components/AuthGuard";
import Handshake from "./components/Handshake";

const queryClient = new QueryClient();

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <PageTransition key={location.pathname}>
        <Routes location={location}>
          <Route path="/" element={<AuthGuard><EnergyCheckIn /></AuthGuard>} />
          <Route path="/factors" element={<AuthGuard><EnergyFactors /></AuthGuard>} />
          <Route path="/summary" element={<AuthGuard><TodaySummary /></AuthGuard>} />
          <Route path="/weekly" element={<AuthGuard><WeeklyOverview /></AuthGuard>} />
          <Route path="*" element={<AuthGuard><NotFound /></AuthGuard>} />
        </Routes>
      </PageTransition>
    </AnimatePresence>
  );
};

const App = () => {
  const [isAuthResolved, setIsAuthResolved] = useState(false);

  useEffect(() => {
    // Phase 9: session_id check - userId already exists
    const userId = sessionStorage.getItem("user_id");
    if (userId) {
      setIsAuthResolved(true);
    }
  }, []);

  // Phase 8: UI Blocking During Handshake
  if (!isAuthResolved) {
    return <Handshake onSuccess={() => setIsAuthResolved(true)} />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter basename="/energy_tracker">
          <EnergyProvider>
            <div className="mx-auto min-h-[100dvh] max-w-md">
              <AnimatedRoutes />
            </div>
          </EnergyProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
