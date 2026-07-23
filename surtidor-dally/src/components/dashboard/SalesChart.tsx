'use client';

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

interface SalesChartProps {
  data: { day: string; gasolina: number; diesel: number }[];
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload) return null;

  return (
    <div className="bg-surface border border-border rounded-lg p-3 shadow-xl">
      <p className="text-xs tracking-figma text-text-muted mb-2">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} className="text-sm" style={{ color: entry.color }}>
          {entry.name === 'gasolina' ? 'Gasolina' : 'Diesel'} :{' '}
          <span className="font-bold">{entry.value.toLocaleString()}</span>
        </p>
      ))}
    </div>
  );
}

export default function SalesChart({ data }: SalesChartProps) {
  return (
    <div
      className="bg-surface border border-border rounded-xl p-6"
      id="sales-chart-container"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <span className="text-xs tracking-figma-wide text-text-muted block mb-1">
            VENTAS POR TIPO — SEMANA ACTUAL
          </span>
          <h3 className="text-lg font-bold text-text-primary">
            Desglose diario (Bs.)
          </h3>
        </div>
        <button
          className="text-xs tracking-figma border border-border rounded-lg px-4 py-2 text-text-secondary hover:text-text-primary hover:border-text-muted transition-colors flex items-center gap-2"
          id="sales-chart-filter"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
          </svg>
          Filtrar
        </button>
      </div>

      {/* Chart */}
      <div className="h-72">
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="gradGasolina" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F5C518" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#F5C518" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradDiesel" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22D3EE" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#22D3EE" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#333"
                vertical={true}
              />
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#666', fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#666', fontSize: 12 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="gasolina"
                stroke="#F5C518"
                strokeWidth={2}
                fill="url(#gradGasolina)"
                dot={false}
                activeDot={{ r: 5, fill: '#F5C518', stroke: '#0D0D0D', strokeWidth: 2 }}
              />
              <Area
                type="monotone"
                dataKey="diesel"
                stroke="#22D3EE"
                strokeWidth={2}
                fill="url(#gradDiesel)"
                dot={false}
                activeDot={{ r: 5, fill: '#22D3EE', stroke: '#0D0D0D', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full text-text-muted text-sm">
            Sin datos de ventas esta semana
          </div>
        )}
      </div>
    </div>
  );
}
