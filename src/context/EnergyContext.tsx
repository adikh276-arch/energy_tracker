import React, { createContext, useContext, useState, ReactNode } from "react";

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
}

const EnergyContext = createContext<EnergyContextType | undefined>(undefined);

export const useEnergy = () => {
  const ctx = useContext(EnergyContext);
  if (!ctx) throw new Error("useEnergy must be used within EnergyProvider");
  return ctx;
};

const STORAGE_KEY = "mantracare-energy-entries";

const loadEntries = (): EnergyEntry[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const EnergyProvider = ({ children }: { children: ReactNode }) => {
  const [currentLevel, setCurrentLevel] = useState<EnergyLevel | null>(null);
  const [currentFactors, setCurrentFactors] = useState<string[]>([]);
  const [currentNote, setCurrentNote] = useState("");
  const [entries, setEntries] = useState<EnergyEntry[]>(loadEntries);

  const saveEntry = () => {
    if (!currentLevel) return;
    const entry: EnergyEntry = {
      date: new Date().toISOString().split("T")[0],
      level: currentLevel,
      factors: currentFactors,
      note: currentNote,
    };
    const updated = [entry, ...entries.filter((e) => e.date !== entry.date)];
    setEntries(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
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
      }}
    >
      {children}
    </EnergyContext.Provider>
  );
};
