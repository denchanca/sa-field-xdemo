"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { ChartSpec } from "@/lib/analysis/report-schema";

/** Palette drawn from the Ledgerly design tokens in app/globals.css. */
const PALETTE = [
  "var(--indigo)",
  "var(--indigo-500)",
  "var(--success)",
  "var(--warning)",
  "var(--danger)",
  "var(--ink-soft)",
];

function formatValue(value: number, unit?: string) {
  const rounded = Math.abs(value) >= 1000 ? Math.round(value).toLocaleString("en-US") : String(value);
  if (unit === "$") return `$${rounded}`;
  if (unit === "%") return `${rounded}%`;
  return rounded;
}

export function ReportChart({ spec }: { spec: ChartSpec }) {
  const { type, data, xKey, series, stacked, unit } = spec;
  const axisTick = { fontSize: 12, fill: "var(--ink-soft)" };
  const tooltipStyle = {
    borderRadius: 10,
    border: "1px solid var(--line)",
    background: "var(--paper-elevated)",
    fontSize: 12,
  };
  const format = (value: number) => formatValue(value, unit);

  if (type === "pie") {
    const valueKey = series[0];
    return (
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={data}
            dataKey={valueKey}
            nameKey={xKey}
            innerRadius={55}
            outerRadius={95}
            paddingAngle={2}
            stroke="var(--paper-elevated)"
          >
            {data.map((_, i) => (
              <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
            ))}
          </Pie>
          <Tooltip contentStyle={tooltipStyle} formatter={(v) => format(Number(v))} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
        </PieChart>
      </ResponsiveContainer>
    );
  }

  if (type === "line") {
    return (
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data} margin={{ top: 8, right: 12, left: 4, bottom: 0 }}>
          <CartesianGrid stroke="var(--line)" vertical={false} />
          <XAxis dataKey={xKey} tick={axisTick} tickLine={false} axisLine={{ stroke: "var(--line)" }} />
          <YAxis tick={axisTick} tickLine={false} axisLine={false} tickFormatter={format} width={70} />
          <Tooltip contentStyle={tooltipStyle} formatter={(v) => format(Number(v))} />
          {series.length > 1 ? <Legend wrapperStyle={{ fontSize: 12 }} /> : null}
          {series.map((key, i) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              stroke={PALETTE[i % PALETTE.length]}
              strokeWidth={2}
              dot={{ r: 2.5 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    );
  }

  if (type === "scatter") {
    const yKey = series[0];
    return (
      <ResponsiveContainer width="100%" height={260}>
        <ScatterChart margin={{ top: 8, right: 12, left: 4, bottom: 0 }}>
          <CartesianGrid stroke="var(--line)" />
          <XAxis dataKey={xKey} tick={axisTick} type="number" name={xKey} axisLine={{ stroke: "var(--line)" }} />
          <YAxis dataKey={yKey} tick={axisTick} type="number" name={yKey} tickFormatter={format} width={70} />
          <Tooltip contentStyle={tooltipStyle} formatter={(v) => format(Number(v))} />
          <Scatter data={data} fill="var(--indigo)" />
        </ScatterChart>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 8, right: 12, left: 4, bottom: 0 }}>
        <CartesianGrid stroke="var(--line)" vertical={false} />
        <XAxis dataKey={xKey} tick={axisTick} tickLine={false} axisLine={{ stroke: "var(--line)" }} />
        <YAxis tick={axisTick} tickLine={false} axisLine={false} tickFormatter={format} width={70} />
        <Tooltip contentStyle={tooltipStyle} formatter={(v) => format(Number(v))} cursor={{ fill: "var(--indigo-soft)", opacity: 0.5 }} />
        {series.length > 1 ? <Legend wrapperStyle={{ fontSize: 12 }} /> : null}
        {series.map((key, i) => (
          <Bar
            key={key}
            dataKey={key}
            stackId={stacked ? "stack" : undefined}
            fill={PALETTE[i % PALETTE.length]}
            radius={stacked ? 0 : [4, 4, 0, 0]}
            maxBarSize={48}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
