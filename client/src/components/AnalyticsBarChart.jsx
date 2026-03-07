import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function AnalyticsBarChart({
  title,
  data,
  xKey,
  barKey = "clicks",
}) {
  return (
    <div className="stats-panel chart-panel">
      <h3>{title}</h3>

      {!data?.length ? (
        <p>No data yet.</p>
      ) : (
        <div className="chart-wrap">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={xKey} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey={barKey} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}