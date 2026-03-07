import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useEnergy, EnergyLevel } from "@/context/EnergyContext";
import { Home } from "lucide-react";
import { useTranslation } from "react-i18next";
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
import { format, subDays } from "date-fns";

const levelToNum: Record<EnergyLevel, number> = {
  "very-low": 1,
  low: 2,
  okay: 3,
  good: 4,
  high: 5,
};

const WeeklyOverview = () => {
  const { entries } = useEnergy();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const numToLabel: Record<number, string> = {
    1: t("very_low"),
    2: t("low"),
    3: t("okay"),
    4: t("good"),
    5: t("high"),
  };

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
      <TopBar title={t("weekly_title")} showBack />

      <main className="flex flex-1 flex-col px-6 pt-4">
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6 text-xl font-bold text-foreground"
        >
          {t("your_weekly")}
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-soft mb-6 rounded-2xl bg-card p-5"
        >
          {filledDays.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">
              {t("no_entries")}
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
                  width={60}
                />
                <Tooltip
                  formatter={(value: number) => [numToLabel[value], t("energy")]}
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
              {t("insight")}
            </h3>
            <p className="text-sm leading-relaxed text-accent-foreground/80">
              {avgValue >= 4
                ? t("insight_high")
                : avgValue >= 3
                  ? t("insight_okay")
                  : t("insight_low")}
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
              {t("insight")}
            </h3>
            <p className="text-sm leading-relaxed text-accent-foreground/80">
              {t("insight_more_data")}
            </p>
          </motion.div>
        )}
      </main>

      <div className="sticky bottom-0 px-6 pb-8 pt-4">
        <button
          onClick={() => navigate("/")}
          className="flex w-full items-center justify-center gap-2 rounded-pill bg-primary py-4 text-base font-bold text-primary-foreground transition-all"
        >
          <Home className="h-5 w-5" />
          {t("go_home")}
        </button>
      </div>
    </div>
  );
};

export default WeeklyOverview;
