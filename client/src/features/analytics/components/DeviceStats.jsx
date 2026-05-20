import { Monitor } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { EmptyState } from "@/components/common/EmptyState";
import { CHART_COLORS } from "@/constants/theme";

export default function DeviceStats({ stats = [] }) {
  const deviceCount = stats.reduce((acc, item) => {
    acc[item.device] = (acc[item.device] || 0) + 1;
    return acc;
  }, {});

  const result = Object.keys(deviceCount).map((device) => ({
    device,
    count: deviceCount[device],
  }));

  if (!result.length) {
    return (
      <EmptyState
        size="compact"
        icon={Monitor}
        title="No device data yet"
        description="Device breakdowns appear once people start clicking your link."
      />
    );
  }

  return (
    <div className="w-full h-[220px] sm:h-[260px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={result}
            dataKey="count"
            nameKey="device"
            cx="50%"
            cy="50%"
            innerRadius={48}
            outerRadius={72}
            paddingAngle={2}
            label={({ device, percent }) =>
              `${device} ${(percent * 100).toFixed(0)}%`
            }
            labelLine={false}
          >
            {result.map((entry, index) => (
              <Cell
                key={entry.device}
                fill={CHART_COLORS[index % CHART_COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: "hsl(0 0% 5%)",
              border: "1px solid hsl(0 0% 20%)",
              borderRadius: "8px",
              fontSize: "12px",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
