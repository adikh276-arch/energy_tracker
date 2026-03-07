import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useEnergy } from "@/context/EnergyContext";
import { Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import TopBar from "@/components/TopBar";

const EnergyFactors = () => {
  const { currentFactors, setCurrentFactors, currentNote, setCurrentNote, saveEntry } = useEnergy();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const factors = [
    { id: "Sleep", label: t("sleep") },
    { id: "Work / Study", label: t("work_study") },
    { id: "Stress", label: t("stress") },
    { id: "Exercise", label: t("exercise") },
    { id: "Socializing", label: t("socializing") },
    { id: "Screen Time", label: t("screen_time") },
    { id: "Health", label: t("health") },
    { id: "Rest", label: t("rest") },
    { id: "Mood", label: t("mood") },
    { id: "Anxiety", label: t("anxiety") },
  ];

  const toggleFactor = (fId: string) => {
    setCurrentFactors(
      currentFactors.includes(fId)
        ? currentFactors.filter((x) => x !== fId)
        : [...currentFactors, fId]
    );
  };

  const handleSave = () => {
    saveEntry();
    navigate("/summary");
  };

  return (
    <div className="flex min-h-[100dvh] flex-col bg-background">
      <TopBar title={t("factors_title")} showBack />

      <main className="flex flex-1 flex-col px-6 pt-4">
        <h2 className="mb-1 text-xl font-bold text-foreground">
          {t("what_affected")}
        </h2>
        <p className="mb-6 text-sm text-muted-foreground">{t("optional")}</p>

        <div className="mb-6 grid grid-cols-2 gap-3">
          {factors.map((f, i) => {
            const selected = currentFactors.includes(f.id);
            return (
              <motion.button
                key={f.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => toggleFactor(f.id)}
                className={`flex items-center gap-2 rounded-pill px-4 py-3 text-sm font-semibold transition-all ${selected
                    ? "border border-chip-border-selected bg-chip-selected text-primary"
                    : "border border-transparent bg-chip text-secondary-foreground"
                  }`}
              >
                {selected && <Check className="h-4 w-4" />}
                {f.label}
              </motion.button>
            );
          })}
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-foreground">
            {t("add_note")} <span className="font-normal text-muted-foreground">({t("optional").toLowerCase()})</span>
          </label>
          <textarea
            value={currentNote}
            onChange={(e) => setCurrentNote(e.target.value.slice(0, 120))}
            placeholder={t("note_placeholder")}
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
          {t("save_checkin")}
        </button>
      </div>
    </div>
  );
};

export default EnergyFactors;
