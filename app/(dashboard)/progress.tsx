import { View, Text, ActivityIndicator, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { getCompletedHabits } from "@/services/habitService";
import Logo from "@/components/logo";
import { CompletedHabit } from "@/types/habit";
import { VictoryBar, VictoryChart, VictoryAxis } from "victory-native";
import { Flame, Calendar, Star } from "lucide-react-native";
import Header from "@/components/header";

// --- Helper Components ---
const StatCard = ({
  title,
  value,
  subtitle,
  icon,
  color,
}: {
  title: string;
  value: string;
  subtitle?: string;
  icon?: React.ReactNode;
  color?: string;
}) => (
  <View className="bg-white rounded-2xl shadow-md p-5 mb-5 flex-row items-center">
    <View
      className="w-12 h-12 rounded-full items-center justify-center mr-4"
      style={{ backgroundColor: color || "#f3f4f6" }}
    >
      {icon}
    </View>
    <View>
      <Text className="text-sm text-gray-500">{title}</Text>
      <Text className="text-2xl font-bold text-gray-900">{value}</Text>
      {subtitle && <Text className="text-gray-400">{subtitle}</Text>}
    </View>
  </View>
);

// --- Date Helpers ---
const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const toYMD = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
const startOfWeekSun = (d: Date) => {
  const copy = new Date(d);
  copy.setDate(copy.getDate() - copy.getDay());
  copy.setHours(0, 0, 0, 0);
  return copy;
};
const endOfWeekSun = (d: Date) => {
  const start = startOfWeekSun(d);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  return end;
};

const Progress = () => {
  const [loading, setLoading] = useState(true);
  const [streak, setStreak] = useState(0);
  const [monthlyCompleted, setMonthlyCompleted] = useState(0);
  const [weeklyData, setWeeklyData] = useState<
    { day: string; count: number }[]
  >([]);
  const [last4WeeksData, setLast4WeeksData] = useState<
    { week: string; count: number }[]
  >([]);
  const [bestDay, setBestDay] = useState<{ day: string; count: number } | null>(
    null
  );

  useEffect(() => {
    const run = async () => {
      try {
        const raw = await getCompletedHabits();

        const list: CompletedHabit[] = raw
          .map((h) => ({
            ...h,
            completedAt:
              (h as any)?.completedAt?.toDate?.() ??
              (h.completedAt instanceof Date
                ? h.completedAt
                : new Date(h.completedAt as any)),
          }))
          .filter((h) => !isNaN(h.completedAt.getTime()));

        setStreak(calcStreak(list));

        const now = new Date();
        const monthCount = list.filter(
          (h) =>
            h.completedAt.getFullYear() === now.getFullYear() &&
            h.completedAt.getMonth() === now.getMonth()
        ).length;
        setMonthlyCompleted(monthCount);

        const wdata = calcWeeklyData(list);
        setWeeklyData(wdata);

        if (wdata.length) {
          const max = wdata.reduce(
            (m, x) => (x.count > m.count ? x : m),
            wdata[0]
          );
          setBestDay(max.count > 0 ? max : null);
        } else {
          setBestDay(null);
        }

        setLast4WeeksData(calcLast4Weeks(list));
      } catch (e) {
        console.error("Progress load failed:", e);
      } finally {
        setLoading(false);
      }
    };

    run();
  }, []);

  const calcStreak = (list: CompletedHabit[]) => {
    const days = new Set(list.map((h) => toYMD(new Date(h.completedAt))));
    let count = 0;
    const cursor = new Date();
    cursor.setHours(0, 0, 0, 0);

    while (days.has(toYMD(cursor))) {
      count++;
      cursor.setDate(cursor.getDate() - 1);
    }
    return count;
  };

  const calcWeeklyData = (list: CompletedHabit[]) => {
    const now = new Date();
    const start = startOfWeekSun(now);
    const end = endOfWeekSun(now);

    const counts: Record<string, number> = {
      Sun: 0,
      Mon: 0,
      Tue: 0,
      Wed: 0,
      Thu: 0,
      Fri: 0,
      Sat: 0,
    };

    for (const h of list) {
      const d = h.completedAt;
      if (d >= start && d <= end) {
        counts[dayNames[d.getDay()]]++;
      }
    }

    return dayNames.map((name) => ({ day: name, count: counts[name] }));
  };

  const calcLast4Weeks = (list: CompletedHabit[]) => {
    const now = new Date();
    const result: { week: string; count: number }[] = [];

    for (let i = 3; i >= 0; i--) {
      const ref = new Date(now);
      ref.setDate(ref.getDate() - i * 7);
      const start = startOfWeekSun(ref);
      const end = endOfWeekSun(ref);

      const count = list.reduce((acc, h) => {
        const d = h.completedAt;
        return acc + (d >= start && d <= end ? 1 : 0);
      }, 0);

      result.push({ week: i === 0 ? "This Wk" : `W-${i}`, count });
    }

    return result;
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="px-6 pt-12 pb-4 justify-center items-center shadow-md">
        <Logo />
      </View>
      <View className="p-5">
        {/* Stats */}
        <StatCard
          title="Streak"
          value={`${streak} days`}
          subtitle="Keep it up!"
          icon={<Flame size={24} color="#ef4444" />}
          color="#fee2e2"
        />
        <StatCard
          title="This Month"
          value={`${monthlyCompleted}`}
          subtitle="Habits completed"
          icon={<Calendar size={24} color="#22c55e" />}
          color="#dcfce7"
        />
        {bestDay && (
          <StatCard
            title="Best Day"
            value={bestDay.day}
            subtitle={`${bestDay.count} habits`}
            icon={<Star size={24} color="#eab308" />}
            color="#fef9c3"
          />
        )}

        {/* Weekly Chart */}
        <View className="bg-white rounded-2xl shadow-md p-5 mb-6">
          <Text className="text-lg font-semibold text-gray-800 mb-3 text-center">
            📊 This Week
          </Text>
          <VictoryChart domainPadding={{ x: 20 }} height={220}>
            <VictoryAxis
              tickValues={weeklyData.map((d) => d.day)}
              style={{ tickLabels: { fontSize: 12, angle: -20, padding: 5 } }}
            />
            <VictoryAxis dependentAxis />
            <VictoryBar
              data={weeklyData}
              x="day"
              y="count"
              style={{ data: { fill: "#3b82f6", borderRadius: 6, width: 25 } }}
            />
          </VictoryChart>
        </View>

        {/* Last 4 Weeks */}
        <View className="bg-white rounded-2xl shadow-md p-5 mb-6">
          <Text className="text-lg font-semibold text-gray-800 mb-3 text-center">
            📈 Last 4 Weeks
          </Text>
          <VictoryChart domainPadding={{ x: 25 }} height={220}>
            <VictoryAxis
              tickValues={last4WeeksData.map((d) => d.week)}
              style={{ tickLabels: { fontSize: 12 } }}
            />
            <VictoryAxis dependentAxis />
            <VictoryBar
              data={last4WeeksData}
              x="week"
              y="count"
              style={{ data: { fill: "#9333ea", borderRadius: 6, width: 28 } }}
            />
          </VictoryChart>
        </View>
      </View>
    </ScrollView>
  );
};

export default Progress;
