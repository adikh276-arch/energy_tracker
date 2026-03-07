import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { EnergyProvider } from "@/context/EnergyContext";
import { AnimatePresence } from "framer-motion";
import EnergyCheckIn from "./pages/EnergyCheckIn";
import EnergyFactors from "./pages/EnergyFactors";
import TodaySummary from "./pages/TodaySummary";
import WeeklyOverview from "./pages/WeeklyOverview";
import NotFound from "./pages/NotFound";
import PageTransition from "./components/PageTransition";

const queryClient = new QueryClient();

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <PageTransition key={location.pathname}>
        <Routes location={location}>
          <Route path="/" element={<EnergyCheckIn />} />
          <Route path="/factors" element={<EnergyFactors />} />
          <Route path="/summary" element={<TodaySummary />} />
          <Route path="/weekly" element={<WeeklyOverview />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </PageTransition>
    </AnimatePresence>
  );
};

const App = () => (
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

export default App;
