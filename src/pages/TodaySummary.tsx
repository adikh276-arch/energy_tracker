import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useEnergy, EnergyLevel } from "@/context/EnergyContext";
import { Droplets, Footprints, Coffee } from "lucide-react";
import { useTranslation } from "react-i18next";
import TopBar from "@/components/TopBar";

const emojiMap: Record<EnergyLevel, string> = {
  "very-low": "😴",
  low: "😔",
  okay: "😐",
  good: "🙂",
  high: "⚡",
};

const TodaySummary = () => {
  const { currentLevel, entries } = useEnergy();
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const todayStr = new Date().toISOString().split('T')[0];
  const todayEntry = entries.find(e => e.date === todayStr);
  const level = currentLevel || todayEntry?.level || "okay";

  const labelMap: Record<EnergyLevel, string> = {
    "very-low": t("very_low"),
    low: t("low"),
    okay: t("okay"),
    good: t("good"),
    high: t("high"),
  };

  const messages: Record<EnergyLevel, string> = {
    "very-low": t("msg_very_low"),
    low: t("msg_low"),
    okay: t("msg_okay"),
    good: t("msg_good"),
    high: t("msg_high"),
  };

  const suggestions = [
    { icon: Coffee, text: t("breaks") },
    { icon: Droplets, text: t("hydrated") },
    { icon: Footprints, text: t("movement") },
  ];

  return (
    <div className="flex min-h-[100dvh] flex-col bg-background">
      <TopBar title={t("summary_title")} />

      <main className="flex flex-1 flex-col items-center px-6 pt-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card-soft mb-8 w-full max-w-sm rounded-2xl bg-card p-8 text-center"
        >
          <span className="mb-2 block text-5xl">{emojiMap[level]}</span>
          <h2 className="mb-1 text-lg font-bold text-foreground">
            {t("today_energy", { label: labelMap[level] })}
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {messages[level]}
          </p>
        </motion.div>

        <div className="w-full max-w-sm space-y-3">
          {suggestions.map((s, i) => (
            <motion.div
              key={s.text}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.08 }}
              className="flex items-center gap-4 rounded-xl bg-surface-warm px-5 py-4"
            >
              <s.icon className="h-5 w-5 text-accent-foreground" />
              <span className="text-sm font-semibold text-accent-foreground">{s.text}</span>
            </motion.div>
          ))}
        </div>
      </main>

      <div className="sticky bottom-0 px-6 pb-8 pt-4">
        <button
          onClick={() => navigate("/weekly")}
          className="w-full rounded-pill bg-primary py-4 text-base font-bold text-primary-foreground transition-all"
        >
          {t("view_weekly")}
        </button>
      </div>
    </div>
  );
};

export default TodaySummary;
