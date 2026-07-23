'use client';

import { Download, CheckCircle, AlertTriangle } from 'lucide-react';

interface Transaction {
  id: string;
  hora: string;
  tipo: string;
  litros: number;
  monto: number;
  operador: string;
  estado: 'OK' | 'Revisar';
}

interface TransactionsTableProps {
  data: Transaction[];
}

export default function TransactionsTable({ data }: TransactionsTableProps) {
  return (
    <div
      className="bg-surface border border-border rounded-xl p-6"
      id="transactions-table-container"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <span className="text-xs tracking-figma-wide text-text-muted block mb-1">
            TRANSACCIONES — HOY
          </span>
          <h3 className="text-lg font-bold text-text-primary">
            Registro de despachos
          </h3>
        </div>
        <button
          className="text-xs tracking-figma border border-border rounded-lg px-4 py-2 text-text-secondary hover:text-text-primary hover:border-text-muted transition-colors flex items-center gap-2"
          id="transactions-export"
        >
          <Download className="w-3.5 h-3.5" />
          Exportar
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {data.length > 0 ? (
          <table className="w-full" id="transactions-table">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-xs tracking-figma-wide text-text-muted py-3 pr-4">
                  ID TRANSACCIÓN
                </th>
                <th className="text-left text-xs tracking-figma-wide text-text-muted py-3 pr-4">
                  HORA
                </th>
                <th className="text-left text-xs tracking-figma-wide text-text-muted py-3 pr-4">
                  TIPO
                </th>
                <th className="text-right text-xs tracking-figma-wide text-text-muted py-3 pr-4">
                  LITROS
                </th>
                <th className="text-right text-xs tracking-figma-wide text-text-muted py-3 pr-4">
                  MONTO (BS.)
                </th>
                <th className="text-left text-xs tracking-figma-wide text-text-muted py-3 pr-4">
                  OPERADOR
                </th>
                <th className="text-center text-xs tracking-figma-wide text-text-muted py-3">
                  ESTADO
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((tx, i) => (
                <tr
                  key={tx.id}
                  className={`border-b border-border/50 hover:bg-surface-hover transition-colors ${
                    i % 2 === 0 ? '' : 'bg-surface-alt/30'
                  }`}
                >
                  <td className="py-4 pr-4">
                    <span className="text-sm font-semibold text-accent">
                      {tx.id}
                    </span>
                  </td>
                  <td className="py-4 pr-4">
                    <span className="text-sm text-text-secondary font-mono">
                      {tx.hora}
                    </span>
                  </td>
                  <td className="py-4 pr-4">
                    <span className="text-sm text-text-primary font-medium">
                      {tx.tipo}
                    </span>
                  </td>
                  <td className="py-4 pr-4 text-right">
                    <span className="text-sm text-text-secondary">
                      {tx.litros.toFixed(1)}
                    </span>
                  </td>
                  <td className="py-4 pr-4 text-right">
                    <span className="text-sm text-text-primary font-semibold">
                      {tx.monto.toFixed(2)}
                    </span>
                  </td>
                  <td className="py-4 pr-4">
                    <span className="text-sm text-text-secondary">
                      {tx.operador}
                    </span>
                  </td>
                  <td className="py-4 text-center">
                    {tx.estado === 'OK' ? (
                      <span className="inline-flex items-center gap-1.5 text-success text-sm">
                        <CheckCircle className="w-4 h-4" />
                        OK
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-warning text-sm">
                        <AlertTriangle className="w-4 h-4" />
                        Revisar
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-12 text-text-muted text-sm">
            No hay transacciones registradas hoy
          </div>
        )}
      </div>
    </div>
  );
}
