import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useEnergy, EnergyLevel } from "@/context/EnergyContext";
import { Home } from "lucide-react";
import TopBar from "@/components/TopBar";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { format, subDays, parseISO } from "date-fns";

const levelToNum: Record<EnergyLevel, number> = {
  "very-low": 1,
  low: 2,
  okay: 3,
  good: 4,
  high: 5,
};

const numToLabel: Record<number, string> = {
  1: "Very Low",
  2: "Low",
  3: "Okay",
  4: "Good",
  5: "High",
};

const getLineColor = (value: number) => {
  if (value >= 4) return "hsl(145, 50%, 45%)";
  if (value >= 3) return "hsl(45, 60%, 55%)";
  return "hsl(0, 50%, 55%)";
};

const WeeklyOverview = () => {
  const { entries } = useEnergy();
  const navigate = useNavigate();

  const today = new Date();
  const days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(today, 6 - i);
    const dateStr = format(date, "yyyy-MM-dd");
    const entry = entries.find((e) => e.date === dateStr);
    return {
      day: format(date, "EEE"),
      date: dateStr,
      value: entry ? levelToNum[entry.level] : null,
    };
  });

  const filledDays = days.filter((d) => d.value !== null);
  const avgValue = filledDays.length
    ? Math.round(filledDays.reduce((s, d) => s + (d.value || 0), 0) / filledDays.length)
    : null;

  const hasEnoughData = filledDays.length >= 3;

  return (
    <div className="flex min-h-[100dvh] flex-col bg-background">
      <TopBar title="Weekly Energy" showBack />

      <main className="flex flex-1 flex-col px-6 pt-4">
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6 text-xl font-bold text-foreground"
        >
          Your Weekly Energy
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-soft mb-6 rounded-2xl bg-card p-5"
        >
          {filledDays.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">
              No entries yet this week. Start tracking to see your graph!
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={days}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(80, 15%, 88%)" />
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 12, fill: "hsl(200, 10%, 50%)" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  domain={[1, 5]}
                  ticks={[1, 2, 3, 4, 5]}
                  tickFormatter={(v) => numToLabel[v] || ""}
                  tick={{ fontSize: 10, fill: "hsl(200, 10%, 50%)" }}
                  axisLine={false}
                  tickLine={false}
                  width={50}
                />
                <Tooltip
                  formatter={(value: number) => [numToLabel[value], "Energy"]}
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                    fontSize: "13px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="hsl(145, 35%, 48%)"
                  strokeWidth={3}
                  dot={{ r: 5, fill: "hsl(145, 35%, 48%)", stroke: "white", strokeWidth: 2 }}
                  connectNulls
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </motion.div>

        {hasEnoughData && avgValue && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card-soft rounded-2xl bg-surface-warm p-5"
          >
            <h3 className="mb-2 text-sm font-bold text-accent-foreground">
              Energy Insight
            </h3>
            <p className="text-sm leading-relaxed text-accent-foreground/80">
              {avgValue >= 4
                ? "You've had a great week! Your energy has been consistently high."
                : avgValue >= 3
                ? "You tend to have higher energy on days you rest well."
                : "This week was tough. Remember to prioritize rest and recovery."}
            </p>
          </motion.div>
        )}

        {!hasEnoughData && filledDays.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="card-soft rounded-2xl bg-surface-warm p-5"
          >
            <h3 className="mb-2 text-sm font-bold text-accent-foreground">
              Energy Insight
            </h3>
            <p className="text-sm leading-relaxed text-accent-foreground/80">
              Keep logging for a few more days to unlock personalized insights!
            </p>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default WeeklyOverview;
