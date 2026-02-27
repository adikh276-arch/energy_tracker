import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useEnergy, EnergyLevel } from "@/context/EnergyContext";
import { Droplets, Footprints, Coffee } from "lucide-react";
import TopBar from "@/components/TopBar";

const emojiMap: Record<EnergyLevel, string> = {
  "very-low": "😴",
  low: "😔",
  okay: "😐",
  good: "🙂",
  high: "⚡",
};

const labelMap: Record<EnergyLevel, string> = {
  "very-low": "Very Low",
  low: "Low",
  okay: "Okay",
  good: "Good",
  high: "High",
};

const messages: Record<EnergyLevel, string> = {
  "very-low": "It's okay to rest. Take it slow and be gentle with yourself today.",
  low: "Be kind to yourself. Small steps count too.",
  okay: "Your energy is stable today. Be kind to yourself and move at your own pace.",
  good: "You're doing well! Keep nurturing what feels right.",
  high: "Amazing energy today! Channel it into something meaningful.",
};

const suggestions = [
  { icon: Coffee, text: "Take short breaks" },
  { icon: Droplets, text: "Stay hydrated" },
  { icon: Footprints, text: "Do light movement" },
];

const TodaySummary = () => {
  const { currentLevel } = useEnergy();
  const navigate = useNavigate();
  const level = currentLevel || "okay";

  return (
    <div className="flex min-h-[100dvh] flex-col bg-background">
      <TopBar title="Today's Summary" />

      <main className="flex flex-1 flex-col items-center px-6 pt-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card-soft mb-8 w-full max-w-sm rounded-2xl bg-card p-8 text-center"
        >
          <span className="mb-2 block text-5xl">{emojiMap[level]}</span>
          <h2 className="mb-1 text-lg font-bold text-foreground">
            Today's Energy: {labelMap[level]}
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
          View Weekly Energy
        </button>
      </div>
    </div>
  );
};

export default TodaySummary;
