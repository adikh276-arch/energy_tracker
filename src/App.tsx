import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { EnergyProvider } from "@/context/EnergyContext";
import EnergyCheckIn from "./pages/EnergyCheckIn";
import EnergyFactors from "./pages/EnergyFactors";
import TodaySummary from "./pages/TodaySummary";
import WeeklyOverview from "./pages/WeeklyOverview";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <EnergyProvider>
          <div className="mx-auto min-h-[100dvh] max-w-md">
            <Routes>
              <Route path="/" element={<EnergyCheckIn />} />
              <Route path="/factors" element={<EnergyFactors />} />
              <Route path="/summary" element={<TodaySummary />} />
              <Route path="/weekly" element={<WeeklyOverview />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </EnergyProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
