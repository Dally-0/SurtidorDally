// ============================================================
// API Route: Dashboard Data — GET
// ============================================================
// Endpoint centralizado que obtiene todos los datos necesarios
// para el dashboard desde Supabase: ventas, alertas, usuarios,
// y calcula los KPIs en el servidor.
// ============================================================

import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Fetch all data in parallel from Supabase
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayISO = todayStart.toISOString();

    const yesterdayStart = new Date(todayStart);
    yesterdayStart.setDate(yesterdayStart.getDate() - 1);
    const yesterdayEnd = new Date(todayStart);
    const yesterdayISO = yesterdayStart.toISOString();
    const yesterdayEndISO = yesterdayEnd.toISOString();

    // Get the start of the current week (Monday)
    const weekStart = new Date(todayStart);
    const dayOfWeek = weekStart.getDay();
    const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    weekStart.setDate(weekStart.getDate() - diff);
    const weekStartISO = weekStart.toISOString();

    const [
      ventasHoyRes,
      ventasAyerRes,
      ventasSemanaRes,
      alertasRes,
      usuariosRes,
      surtidoresRes,
    ] = await Promise.all([
      // Ventas de hoy
      supabase
        .from('ventas')
        .select('*')
        .gte('fecha', todayISO)
        .order('fecha', { ascending: true }),
      // Ventas de ayer (para comparación)
      supabase
        .from('ventas')
        .select('id, total, litros')
        .gte('fecha', yesterdayISO)
        .lt('fecha', yesterdayEndISO),
      // Ventas de la semana (para gráfico)
      supabase
        .from('ventas')
        .select('*')
        .gte('fecha', weekStartISO)
        .order('fecha', { ascending: true }),
      // Alertas pendientes
      supabase
        .from('alertas')
        .select('*')
        .in('estado', ['Pendiente', 'En Revisión'])
        .order('fecha', { ascending: false }),
      // Usuarios (operadores)
      supabase
        .from('usuarios')
        .select('*')
        .eq('activo', true)
        .order('nombre', { ascending: true }),
      // Surtidores
      supabase
        .from('surtidores')
        .select('*')
        .order('numero_bomba', { ascending: true }),
    ]);

    const ventasHoy = ventasHoyRes.data || [];
    const ventasAyer = ventasAyerRes.data || [];
    const ventasSemana = ventasSemanaRes.data || [];
    const alertas = alertasRes.data || [];
    const usuarios = usuariosRes.data || [];
    const surtidores = surtidoresRes.data || [];

    // --- Calculate KPIs ---
    const totalVentasHoy = ventasHoy.reduce((sum: number, v: { total: number }) => sum + Number(v.total), 0);
    const totalLitrosHoy = ventasHoy.reduce((sum: number, v: { litros: number }) => sum + Number(v.litros), 0);
    const totalVentasAyer = ventasAyer.reduce((sum: number, v: { total: number }) => sum + Number(v.total), 0);
    const totalLitrosAyer = ventasAyer.reduce((sum: number, v: { litros: number }) => sum + Number(v.litros), 0);

    const ventasChangePercent = totalVentasAyer > 0
      ? (((totalVentasHoy - totalVentasAyer) / totalVentasAyer) * 100).toFixed(1)
      : '0';
    const litrosChangePercent = totalLitrosAyer > 0
      ? (((totalLitrosHoy - totalLitrosAyer) / totalLitrosAyer) * 100).toFixed(1)
      : '0';
    const transaccionesDiff = ventasHoy.length - ventasAyer.length;

    // --- Build transactions for table ---
    const transactions = ventasHoy.map((v: {
      id: string;
      fecha: string;
      combustible: string;
      litros: number;
      total: number;
      usuario_id: string;
      metadata_binaria: number;
    }) => {
      const hora = new Date(v.fecha).toLocaleTimeString('es-BO', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
      const operador = usuarios.find((u: { id: string }) => u.id === v.usuario_id);
      return {
        id: v.id.substring(0, 8).toUpperCase(),
        hora,
        tipo: v.combustible,
        litros: Number(v.litros),
        monto: Number(v.total),
        operador: operador ? operador.nombre : 'N/A',
        estado: 'OK' as const,
        metadata_binaria: v.metadata_binaria,
      };
    });

    // --- Build weekly sales chart data ---
    const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const salesByDay: Record<string, { gasolina: number; diesel: number }> = {};
    dayNames.forEach(d => { salesByDay[d] = { gasolina: 0, diesel: 0 }; });

    ventasSemana.forEach((v: { fecha: string; combustible: string; total: number }) => {
      const dayName = dayNames[new Date(v.fecha).getDay()];
      const combustibleLower = v.combustible.toLowerCase();
      if (combustibleLower.includes('gasolina') || combustibleLower.includes('premium')) {
        salesByDay[dayName].gasolina += Number(v.total);
      } else if (combustibleLower.includes('diesel') || combustibleLower.includes('diésel')) {
        salesByDay[dayName].diesel += Number(v.total);
      } else {
        salesByDay[dayName].gasolina += Number(v.total);
      }
    });

    const salesChartData = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(day => ({
      day,
      gasolina: Math.round(salesByDay[day].gasolina),
      diesel: Math.round(salesByDay[day].diesel),
    }));

    // --- Build fuel mix data ---
    const fuelTotals: Record<string, number> = {};
    ventasHoy.forEach((v: { combustible: string; total: number }) => {
      const key = v.combustible;
      fuelTotals[key] = (fuelTotals[key] || 0) + Number(v.total);
    });

    const fuelColors: Record<string, string> = {
      'Gasolina Especial': '#F5C518',
      'Gasolina 91': '#F5C518',
      'Premium': '#F97316',
      'Premium 95': '#F97316',
      'Diésel': '#3B82F6',
      'Diesel': '#3B82F6',
      'GNV': '#22C55E',
    };

    const totalFuel = Object.values(fuelTotals).reduce((a, b) => a + b, 0);
    const fuelMixData = Object.entries(fuelTotals).map(([name, value]) => ({
      name,
      value: totalFuel > 0 ? Math.round((value / totalFuel) * 100) : 0,
      color: fuelColors[name] || '#8B5CF6',
    }));

    // --- Build operadores with today's sales count ---
    const operadores = usuarios
      .filter((u: { rol: string }) => u.rol === 'operador')
      .map((u: { id: string; nombre: string; email: string; rol: string; activo: boolean }) => ({
        nombre: u.nombre,
        email: u.email,
        rol: 'Operador',
        ventas: ventasHoy.filter((v: { usuario_id: string }) => v.usuario_id === u.id).length,
        estado: u.activo,
      }));

    // --- Build reportes (binary decoded) ---
    const reportesData = ventasHoy.map((v: { id: string; metadata_binaria: number }) => ({
      id: v.id.substring(0, 8).toUpperCase(),
      meta: v.metadata_binaria || 0,
    }));

    return NextResponse.json({
      success: true,
      kpis: {
        ventasHoy: totalVentasHoy,
        litrosHoy: totalLitrosHoy,
        transacciones: ventasHoy.length,
        alertasActivas: alertas.length,
        ventasChange: ventasChangePercent,
        litrosChange: litrosChangePercent,
        transaccionesDiff,
      },
      transactions,
      salesChartData,
      fuelMixData,
      alertas,
      operadores,
      surtidores,
      reportesData,
    });
  } catch (error) {
    console.error('Dashboard data error:', error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
