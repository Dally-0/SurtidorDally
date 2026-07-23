'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Fuel, Bell, Settings, LogOut, RefreshCw, Loader2 } from 'lucide-react';
import KPICard from '@/components/dashboard/KPICard';
import SalesChart from '@/components/dashboard/SalesChart';
import FuelMixChart from '@/components/dashboard/FuelMixChart';
import TransactionsTable from '@/components/dashboard/TransactionsTable';

type TabKey = 'ventas' | 'reportes' | 'operadores';

interface DashboardData {
  kpis: {
    ventasHoy: number;
    litrosHoy: number;
    transacciones: number;
    alertasActivas: number;
    ventasChange: string;
    litrosChange: string;
    transaccionesDiff: number;
  };
  transactions: {
    id: string;
    hora: string;
    tipo: string;
    litros: number;
    monto: number;
    operador: string;
    estado: 'OK' | 'Revisar';
    metadata_binaria: number;
  }[];
  salesChartData: { day: string; gasolina: number; diesel: number }[];
  fuelMixData: { name: string; value: number; color: string }[];
  operadores: { nombre: string; email: string; rol: string; ventas: number; estado: boolean }[];
  reportesData: { id: string; meta: number }[];
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('ventas');
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const today = new Date().toLocaleDateString('es-BO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const tabs: { key: TabKey; label: string }[] = [
    { key: 'ventas', label: 'VERIFICACIÓN DE VENTAS' },
    { key: 'reportes', label: 'REPORTES' },
    { key: 'operadores', label: 'OPERADORES' },
  ];

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/dashboard');
      const json = await res.json();
      if (json.success) {
        setData(json);
      } else {
        setError(json.error || 'Error al cargar datos');
      }
    } catch (err) {
      setError('Error de conexión con el servidor');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <main className="min-h-screen bg-background">
      {/* ===== Dashboard Header ===== */}
      <header
        className="bg-surface border-b border-border sticky top-0 z-40"
        id="dashboard-header"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Title */}
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-accent/15 rounded-lg flex items-center justify-center">
                  <Fuel className="w-4 h-4 text-accent" />
                </div>
                <span className="text-sm font-bold tracking-figma text-text-primary">
                  DALLY SRL
                </span>
              </Link>
              <div className="hidden sm:block w-px h-6 bg-border" />
              <span className="hidden sm:block text-xs tracking-figma-wide text-text-muted">
                DASHBOARD OPERACIONAL
              </span>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-4">
              {/* Status */}
              <div className="hidden md:flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${error ? 'bg-danger' : 'bg-success animate-pulse'}`} />
                <span className="text-xs text-text-muted">{error ? 'Error' : 'En línea'}</span>
                <span className="text-xs text-text-muted ml-2">· {today}</span>
              </div>

              {/* Refresh */}
              <button
                onClick={fetchData}
                disabled={loading}
                className="p-2 text-text-muted hover:text-text-primary transition-colors disabled:opacity-50"
                id="dashboard-refresh"
                aria-label="Refresh data"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>

              {/* Notification Bell */}
              <button
                className="relative p-2 text-text-muted hover:text-text-primary transition-colors"
                id="dashboard-notifications"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {data && data.kpis.alertasActivas > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-danger rounded-full" />
                )}
              </button>

              {/* Settings */}
              <button
                className="p-2 text-text-muted hover:text-text-primary transition-colors"
                id="dashboard-settings"
                aria-label="Settings"
              >
                <Settings className="w-5 h-5" />
              </button>

              {/* Logout */}
              <Link
                href="/login"
                className="flex items-center gap-2 text-xs tracking-figma border border-border rounded-lg px-4 py-2 text-text-secondary hover:text-text-primary hover:border-text-muted transition-colors"
                id="dashboard-logout"
              >
                <LogOut className="w-4 h-4" />
                Salir
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* ===== Tabs ===== */}
      <div className="bg-surface/50 border-b border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex gap-0 overflow-x-auto" id="dashboard-tabs">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`text-xs tracking-figma-wide py-4 px-6 border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.key
                    ? 'border-accent text-accent'
                    : 'border-transparent text-text-muted hover:text-text-secondary'
                }`}
                id={`tab-${tab.key}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ===== Dashboard Content ===== */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {/* Loading State */}
        {loading && !data && (
          <div className="flex items-center justify-center py-32">
            <div className="text-center">
              <Loader2 className="w-8 h-8 text-accent animate-spin mx-auto mb-4" />
              <p className="text-sm text-text-muted tracking-figma">CARGANDO DATOS DE SUPABASE...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !data && (
          <div className="flex items-center justify-center py-32">
            <div className="text-center max-w-md">
              <div className="w-12 h-12 bg-danger/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-danger text-xl">!</span>
              </div>
              <p className="text-sm text-danger mb-2 font-semibold">Error al cargar datos</p>
              <p className="text-xs text-text-muted mb-4">{error}</p>
              <button
                onClick={fetchData}
                className="bg-accent hover:bg-accent-hover text-background text-xs tracking-figma px-6 py-2 rounded-lg transition-colors"
              >
                REINTENTAR
              </button>
            </div>
          </div>
        )}

        {/* Data loaded */}
        {data && (
          <>
            {activeTab === 'ventas' && (
              <div className="animate-fade-in">
                {/* KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  <KPICard
                    label="VENTAS HOY"
                    value={`Bs. ${data.kpis.ventasHoy.toLocaleString('es-BO', { minimumFractionDigits: 2 })}`}
                    change={`${Number(data.kpis.ventasChange) >= 0 ? '+' : ''}${data.kpis.ventasChange}%`}
                    changeType={Number(data.kpis.ventasChange) >= 0 ? 'positive' : 'negative'}
                    icon="money"
                  />
                  <KPICard
                    label="LITROS DESPACHADOS"
                    value={`${data.kpis.litrosHoy.toLocaleString('es-BO', { minimumFractionDigits: 1 })} L`}
                    change={`${Number(data.kpis.litrosChange) >= 0 ? '+' : ''}${data.kpis.litrosChange}%`}
                    changeType={Number(data.kpis.litrosChange) >= 0 ? 'positive' : 'negative'}
                    icon="fuel"
                  />
                  <KPICard
                    label="TRANSACCIONES"
                    value={data.kpis.transacciones.toString()}
                    change={`${data.kpis.transaccionesDiff >= 0 ? '+' : ''}${data.kpis.transaccionesDiff} vs ayer`}
                    changeType={data.kpis.transaccionesDiff >= 0 ? 'positive' : 'negative'}
                    icon="chart"
                  />
                  <KPICard
                    label="ALERTAS ACTIVAS"
                    value={data.kpis.alertasActivas.toString()}
                    change={data.kpis.alertasActivas > 0 ? 'Requiere atención' : 'Sin alertas'}
                    changeType={data.kpis.alertasActivas > 0 ? 'negative' : 'positive'}
                    icon="alert"
                  />
                </div>

                {/* Charts Row */}
                <div className="grid lg:grid-cols-3 gap-6 mb-8">
                  <div className="lg:col-span-2">
                    <SalesChart data={data.salesChartData} />
                  </div>
                  <div>
                    <FuelMixChart data={data.fuelMixData} />
                  </div>
                </div>

                {/* Transactions Table */}
                <TransactionsTable data={data.transactions} />
              </div>
            )}

            {activeTab === 'reportes' && (
              <div className="animate-fade-in">
                <ReportesTab data={data.reportesData} />
              </div>
            )}

            {activeTab === 'operadores' && (
              <div className="animate-fade-in">
                <OperadoresTab operadores={data.operadores} />
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}

// ===== Reportes Tab =====

function ReportesTab({ data }: { data: { id: string; meta: number }[] }) {
  return (
    <div className="space-y-6">
      <div className="bg-surface border border-border rounded-xl p-8">
        <h3 className="text-lg font-bold tracking-figma text-text-primary mb-4">
          REPORTES Y DECODIFICACIÓN BINARIA
        </h3>
        <p className="text-text-secondary text-sm mb-6">
          Filtros avanzados utilizando aritmética binaria sobre el campo{' '}
          <code className="bg-surface-alt px-2 py-0.5 rounded text-accent font-mono text-xs">
            metadata_binaria
          </code>{' '}
          de cada venta. Datos en tiempo real desde Supabase.
        </p>

        {/* Binary Flags Legend */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { bit: '0x01', label: 'Facturada', desc: 'Bit 0' },
            { bit: '0x02', label: 'Pago Digital', desc: 'Bit 1' },
            { bit: '0x04', label: 'Subsidio Estatal', desc: 'Bit 2' },
            { bit: '0x08', label: 'Cliente Flota', desc: 'Bit 3' },
          ].map((flag, i) => (
            <div
              key={i}
              className="bg-surface-alt border border-border rounded-lg p-4"
            >
              <code className="text-accent font-mono text-sm">{flag.bit}</code>
              <div className="text-sm font-semibold text-text-primary mt-1">
                {flag.label}
              </div>
              <div className="text-xs text-text-muted">{flag.desc}</div>
            </div>
          ))}
        </div>

        {/* Decoded Transactions Table */}
        <div className="overflow-x-auto">
          {data.length > 0 ? (
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-xs tracking-figma-wide text-text-muted py-3 pr-4">ID</th>
                  <th className="text-center text-xs tracking-figma-wide text-text-muted py-3 pr-4">BINARIO</th>
                  <th className="text-center text-xs tracking-figma-wide text-text-muted py-3 pr-4">FACTURADA</th>
                  <th className="text-center text-xs tracking-figma-wide text-text-muted py-3 pr-4">PAGO</th>
                  <th className="text-center text-xs tracking-figma-wide text-text-muted py-3 pr-4">SUBSIDIO</th>
                  <th className="text-center text-xs tracking-figma-wide text-text-muted py-3">FLOTA</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row, i) => (
                  <tr
                    key={i}
                    className="border-b border-border/50 hover:bg-surface-hover transition-colors"
                  >
                    <td className="py-3 pr-4">
                      <span className="text-sm font-semibold text-accent">{row.id}</span>
                    </td>
                    <td className="py-3 pr-4 text-center">
                      <code className="text-xs font-mono text-text-secondary bg-surface-alt px-2 py-1 rounded">
                        {row.meta.toString(2).padStart(4, '0')}
                      </code>
                    </td>
                    <td className="py-3 pr-4 text-center">
                      {(row.meta & 0x01) !== 0 ? (
                        <span className="text-success text-sm">✓</span>
                      ) : (
                        <span className="text-text-muted text-sm">✗</span>
                      )}
                    </td>
                    <td className="py-3 pr-4 text-center">
                      <span className="text-xs text-text-secondary">
                        {(row.meta & 0x02) !== 0 ? 'Digital' : 'Efectivo'}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-center">
                      {(row.meta & 0x04) !== 0 ? (
                        <span className="text-success text-sm">✓</span>
                      ) : (
                        <span className="text-text-muted text-sm">✗</span>
                      )}
                    </td>
                    <td className="py-3 text-center">
                      {(row.meta & 0x08) !== 0 ? (
                        <span className="text-success text-sm">✓</span>
                      ) : (
                        <span className="text-text-muted text-sm">✗</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-12 text-text-muted text-sm">
              No hay ventas registradas hoy para decodificar
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ===== Operadores Tab =====

function OperadoresTab({ operadores }: { operadores: { nombre: string; email: string; rol: string; ventas: number; estado: boolean }[] }) {
  return (
    <div className="space-y-6">
      <div className="bg-surface border border-border rounded-xl p-8">
        <h3 className="text-lg font-bold tracking-figma text-text-primary mb-6">
          OPERADORES ACTIVOS
        </h3>
        <div className="overflow-x-auto">
          {operadores.length > 0 ? (
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-xs tracking-figma-wide text-text-muted py-3 pr-4">NOMBRE</th>
                  <th className="text-left text-xs tracking-figma-wide text-text-muted py-3 pr-4">CORREO</th>
                  <th className="text-left text-xs tracking-figma-wide text-text-muted py-3 pr-4">ROL</th>
                  <th className="text-center text-xs tracking-figma-wide text-text-muted py-3 pr-4">VENTAS HOY</th>
                  <th className="text-center text-xs tracking-figma-wide text-text-muted py-3">ESTADO</th>
                </tr>
              </thead>
              <tbody>
                {operadores.map((op, i) => (
                  <tr
                    key={i}
                    className="border-b border-border/50 hover:bg-surface-hover transition-colors"
                  >
                    <td className="py-4 pr-4">
                      <span className="text-sm font-semibold text-text-primary">{op.nombre}</span>
                    </td>
                    <td className="py-4 pr-4">
                      <span className="text-sm text-text-secondary font-mono">{op.email}</span>
                    </td>
                    <td className="py-4 pr-4">
                      <span className="text-xs tracking-figma bg-accent/10 text-accent px-3 py-1 rounded-full">
                        {op.rol}
                      </span>
                    </td>
                    <td className="py-4 pr-4 text-center">
                      <span className="text-sm font-bold text-text-primary">{op.ventas}</span>
                    </td>
                    <td className="py-4 text-center">
                      <span className="inline-flex items-center gap-1.5">
                        <div className={`w-2 h-2 rounded-full ${op.estado ? 'bg-success' : 'bg-danger'}`} />
                        <span className={`text-xs ${op.estado ? 'text-success' : 'text-danger'}`}>
                          {op.estado ? 'Activo' : 'Inactivo'}
                        </span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-12 text-text-muted text-sm">
              No hay operadores registrados
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
