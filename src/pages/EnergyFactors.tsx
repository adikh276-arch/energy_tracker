import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useEnergy } from "@/context/EnergyContext";
import { Check } from "lucide-react";
import TopBar from "@/components/TopBar";

const factors = [
  "Sleep", "Work / Study", "Stress", "Exercise",
  "Socializing", "Screen Time", "Health", "Rest",
  "Mood", "Anxiety",
];

const EnergyFactors = () => {
  const { currentFactors, setCurrentFactors, currentNote, setCurrentNote, saveEntry } = useEnergy();
  const navigate = useNavigate();

  const toggleFactor = (f: string) => {
    setCurrentFactors(
      currentFactors.includes(f)
        ? currentFactors.filter((x) => x !== f)
        : [...currentFactors, f]
    );
  };

  const handleSave = () => {
    saveEntry();
    navigate("/summary");
  };

  return (
    <div className="flex min-h-[100dvh] flex-col bg-background">
      <TopBar title="Energy Factors" showBack />

      <main className="flex flex-1 flex-col px-6 pt-4">
        <h2 className="mb-1 text-xl font-bold text-foreground">
          What affected your energy today?
        </h2>
        <p className="mb-6 text-sm text-muted-foreground">Optional</p>

        <div className="mb-6 grid grid-cols-2 gap-3">
          {factors.map((f, i) => {
            const selected = currentFactors.includes(f);
            return (
              <motion.button
                key={f}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => toggleFactor(f)}
                className={`flex items-center gap-2 rounded-pill px-4 py-3 text-sm font-semibold transition-all ${
                  selected
                    ? "border border-chip-border-selected bg-chip-selected text-primary"
                    : "border border-transparent bg-chip text-secondary-foreground"
                }`}
              >
                {selected && <Check className="h-4 w-4" />}
                {f}
              </motion.button>
            );
          })}
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-foreground">
            Add a quick note <span className="font-normal text-muted-foreground">(optional)</span>
          </label>
          <textarea
            value={currentNote}
            onChange={(e) => setCurrentNote(e.target.value.slice(0, 120))}
            placeholder="Anything you want to remember about today?"
            maxLength={120}
            rows={3}
            className="w-full resize-none rounded-lg border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <p className="mt-1 text-right text-xs text-muted-foreground">{currentNote.length}/120</p>
        </div>
      </main>

      <div className="sticky bottom-0 px-6 pb-8 pt-4">
        <button
          onClick={handleSave}
          className="w-full rounded-pill bg-primary py-4 text-base font-bold text-primary-foreground transition-all"
        >
          Save Check-In
        </button>
      </div>
    </div>
  );
};

export default EnergyFactors;
