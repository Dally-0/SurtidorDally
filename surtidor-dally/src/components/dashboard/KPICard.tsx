'use client';

import { DollarSign, Droplets, BarChart3, AlertTriangle } from 'lucide-react';
import type { ReactNode } from 'react';

interface KPICardProps {
  label: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: 'money' | 'fuel' | 'chart' | 'alert';
}

const iconMap: Record<string, ReactNode> = {
  money: <DollarSign className="w-5 h-5" />,
  fuel: <Droplets className="w-5 h-5" />,
  chart: <BarChart3 className="w-5 h-5" />,
  alert: <AlertTriangle className="w-5 h-5" />,
};

export default function KPICard({ label, value, change, changeType, icon }: KPICardProps) {
  const changeColor =
    changeType === 'positive'
      ? 'text-success'
      : changeType === 'negative'
      ? 'text-danger'
      : 'text-text-muted';

  return (
    <div className="bg-surface border border-border rounded-xl p-6 card-hover" id={`kpi-${icon}`}>
      <div className="flex items-start justify-between mb-4">
        <span className="text-xs tracking-figma-wide text-text-muted">{label}</span>
        <div className="text-text-muted">{iconMap[icon]}</div>
      </div>
      <div className="text-2xl md:text-3xl font-black text-text-primary mb-2">
        {value}
      </div>
      <div className={`text-sm ${changeColor} flex items-center gap-1`}>
        <span className="text-base">↗</span>
        {change}
      </div>
    </div>
  );
}
