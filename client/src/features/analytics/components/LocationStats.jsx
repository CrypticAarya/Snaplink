import { MapPin } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { EmptyState } from "@/components/common/EmptyState";
import { ACCENT_HEX } from "@/constants/theme";

export default function LocationStats({ stats = [] }) {
  const cityCount = stats.reduce((acc, item) => {
    acc[item.city] = (acc[item.city] || 0) + 1;
    return acc;
  }, {});

  const cities = Object.entries(cityCount)
    .map(([city, count]) => ({ city, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  if (!cities.length) {
    return (
      <EmptyState
        size="compact"
        icon={MapPin}
        title="No location data yet"
        description="Top cities will appear here after your SnapLink gets its first visits."
      />
    );
  }

  return (
    <div className="w-full h-[220px] sm:h-[260px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={cities} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 18%)" vertical={false} />
          <XAxis
            dataKey="city"
            tick={{ fill: "hsl(0 0% 55%)", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fill: "hsl(0 0% 55%)", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            cursor={{ fill: "hsl(0 72% 46% / 0.08)" }}
            contentStyle={{
              background: "hsl(0 0% 5%)",
              border: "1px solid hsl(0 0% 20%)",
              borderRadius: "8px",
              fontSize: "12px",
            }}
          />
          <Bar dataKey="count" fill={ACCENT_HEX} radius={[4, 4, 0, 0]} maxBarSize={40} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
