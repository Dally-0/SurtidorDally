'use client';

import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface FuelMixItem {
  name: string;
  value: number;
  color: string;
}

interface FuelMixChartProps {
  data: FuelMixItem[];
}

export default function FuelMixChart({ data }: FuelMixChartProps) {
  return (
    <div
      className="bg-surface border border-border rounded-xl p-6"
      id="fuel-mix-container"
    >
      {/* Header */}
      <div className="mb-6">
        <span className="text-xs tracking-figma-wide text-text-muted block mb-1">
          MIX DE COMBUSTIBLE
        </span>
        <h3 className="text-lg font-bold text-text-primary">Participación %</h3>
      </div>

      {/* Pie Chart */}
      <div className="h-48 mb-6">
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full text-text-muted text-sm">
            Sin datos
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="space-y-3">
        {data.map((item, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm text-text-secondary">{item.name}</span>
            </div>
            <span className="text-sm font-semibold text-text-primary">
              {item.value}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
