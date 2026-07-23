// ============================================================
// API Route: Ventas — GET / POST
// ============================================================
// Incluye decodificación de metadata binaria (aritmética de bits)
// en las respuestas GET para filtros avanzados de reportes.
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { getAdapter } from '@/core/adapters/DatabaseAdapter';
import { decodeFlags, encodeFlags } from '@/core/utils/binaryMetadata';
import { PumpMonitor } from '@/core/observers/AlertObserver';
import { PumpFactory } from '@/core/factories/PumpFactory';
import { FuelType } from '@/types';

/**
 * GET /api/ventas
 * Lista ventas con metadata binaria decodificada.
 * Soporta filtros por combustible, fecha, surtidor.
 */
export async function GET(request: NextRequest) {
  try {
    const adapter = getAdapter();
    const { searchParams } = new URL(request.url);

    const filters = {
      surtidorId: searchParams.get('surtidor_id') || undefined,
      combustible: searchParams.get('combustible') || undefined,
      fechaDesde: searchParams.get('fecha_desde') || undefined,
      fechaHasta: searchParams.get('fecha_hasta') || undefined,
    };

    const ventas = await adapter.getVentas(filters);

    // Decodificar metadata binaria de cada venta
    const ventasConMetadata = ventas.map(venta => ({
      ...venta,
      metadata_decoded: decodeFlags(venta.metadata_binaria),
    }));

    return NextResponse.json({
      success: true,
      data: ventasConMetadata,
      count: ventasConMetadata.length,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/ventas
 * Registra una nueva venta. Codifica los flags de metadata
 * y evalúa niveles de surtidor vía Observer pattern.
 */
export async function POST(request: NextRequest) {
  try {
    const adapter = getAdapter();
    const body = await request.json();

    const {
      combustible,
      litros,
      precio_por_litro,
      surtidor_id,
      usuario_id,
      facturada = false,
      pagoDigital = false,
      subsidioAplicado = false,
      clienteFlota = false,
    } = body;

    // Codificar flags de metadata con aritmética binaria
    const metadata_binaria = encodeFlags({
      facturada,
      pagoDigital,
      subsidioAplicado,
      clienteFlota,
    });

    const total = litros * precio_por_litro;

    const venta = await adapter.createVenta({
      combustible,
      litros,
      precio_por_litro,
      total,
      surtidor_id,
      usuario_id,
      metadata_binaria,
    });

    // Actualizar nivel del surtidor y verificar con Observer
    const surtidor = await adapter.getSurtidorById(surtidor_id);
    if (surtidor) {
      const nuevoNivel = surtidor.nivel_actual - litros;
      await adapter.updateSurtidor(surtidor_id, { nivel_actual: Math.max(0, nuevoNivel) });

      // Notificar al PumpMonitor (Observer pattern)
      const monitor = PumpMonitor.getInstance();
      const updatedSurtidor = { ...surtidor, nivel_actual: Math.max(0, nuevoNivel) };
      const threshold = PumpFactory.getSafetyThresholds()[surtidor.combustible as FuelType] || 500;
      monitor.checkPumpStatus(updatedSurtidor, threshold);
    }

    return NextResponse.json({
      success: true,
      data: {
        ...venta,
        metadata_decoded: decodeFlags(metadata_binaria),
      },
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
