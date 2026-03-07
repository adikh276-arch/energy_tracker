import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from "react";
import axios from "axios";

export type EnergyLevel = "very-low" | "low" | "okay" | "good" | "high";

export interface EnergyEntry {
  date: string;
  level: EnergyLevel;
  factors: string[];
  note: string;
}

interface EnergyContextType {
  currentLevel: EnergyLevel | null;
  setCurrentLevel: (level: EnergyLevel | null) => void;
  currentFactors: string[];
  setCurrentFactors: (factors: string[]) => void;
  currentNote: string;
  setCurrentNote: (note: string) => void;
  entries: EnergyEntry[];
  saveEntry: () => void;
  refreshHistory: () => Promise<void>;
  isLoading: boolean;
}

const EnergyContext = createContext<EnergyContextType | undefined>(undefined);

export const useEnergy = () => {
  const ctx = useContext(EnergyContext);
  if (!ctx) throw new Error("useEnergy must be used within EnergyProvider");
  return ctx;
};

// Subpath hosting API URL helper
const getApiUrl = (path: string) => {
  // In local development, the server might be on 3001
  // In production, it's proxied through /consumption_tracker/api/
  const baseUrl = import.meta.env.DEV ? 'http://localhost:3001/api' : '/energy_tracker/api';
  return `${baseUrl}${path}`;
};

export const EnergyProvider = ({ children }: { children: ReactNode }) => {
  const [currentLevel, setCurrentLevel] = useState<EnergyLevel | null>(null);
  const [currentFactors, setCurrentFactors] = useState<string[]>([]);
  const [currentNote, setCurrentNote] = useState("");
  const [entries, setEntries] = useState<EnergyEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const userId = sessionStorage.getItem("user_id");

  const refreshHistory = useCallback(async () => {
    if (!userId) return;
    setIsLoading(true);
    try {
      const resp = await axios.get(getApiUrl('/history'), {
        params: { user_id: userId }
      });
      setEntries(resp.data);
    } catch (err) {
      console.error("Error refreshing energy history:", err);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  // Phase 11: Initialize user in DB on startup
  useEffect(() => {
    if (!userId) return;

    const initUser = async () => {
      try {
        await axios.post(getApiUrl('/init-user'), { user_id: userId });
        await refreshHistory();
      } catch (err) {
        console.error("User initialization failed:", err);
      }
    };

    initUser();
  }, [userId, refreshHistory]);

  const saveEntry = async () => {
    if (!currentLevel || !userId) return;
    const entry: EnergyEntry = {
      date: new Date().toISOString().split("T")[0],
      level: currentLevel,
      factors: currentFactors,
      note: currentNote,
    };

    setIsLoading(true);
    try {
      await axios.post(getApiUrl('/save-checkin'), {
        user_id: userId,
        entry
      });

      // Update local state by adding the new entry and filtering duplicates of same date
      const updated = [entry, ...entries.filter((e) => e.date !== entry.date)];
      setEntries(updated);

      // Clear current form state
      setCurrentLevel(null);
      setCurrentFactors([]);
      setCurrentNote("");
    } catch (err) {
      console.error("Saving entry failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <EnergyContext.Provider
      value={{
        currentLevel,
        setCurrentLevel,
        currentFactors,
        setCurrentFactors,
        currentNote,
        setCurrentNote,
        entries,
        saveEntry,
        refreshHistory,
        isLoading,
      }}
    >
      {children}
    </EnergyContext.Provider>
  );
};
