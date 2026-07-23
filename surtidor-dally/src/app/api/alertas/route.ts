// ============================================================
// API Route: Alertas — GET / POST / PATCH
// ============================================================
// Gestión del historial de alertas e incidentes.
// Integrado con el patrón Observer (PumpMonitor).
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { getAdapter } from '@/core/adapters/DatabaseAdapter';
import { AlertStatus } from '@/types';

/**
 * GET /api/alertas
 * Lista alertas con filtros opcionales.
 */
export async function GET(request: NextRequest) {
  try {
    const adapter = getAdapter();
    const { searchParams } = new URL(request.url);

    const filters = {
      surtidorId: searchParams.get('surtidor_id') || undefined,
      estado: (searchParams.get('estado') as AlertStatus) || undefined,
      tipo: searchParams.get('tipo') || undefined,
    };

    const alertas = await adapter.getAlertas(filters);

    return NextResponse.json({
      success: true,
      data: alertas,
      count: alertas.length,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/alertas
 * Crea una nueva alerta manualmente.
 */
export async function POST(request: NextRequest) {
  try {
    const adapter = getAdapter();
    const body = await request.json();

    const { surtidor_id, tipo, estado } = body;

    const alerta = await adapter.createAlerta({
      surtidor_id,
      tipo,
      estado: estado || AlertStatus.PENDIENTE,
    });

    return NextResponse.json({ success: true, data: alerta }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/alertas
 * Actualiza el estado de una alerta existente.
 */
export async function PATCH(request: NextRequest) {
  try {
    const adapter = getAdapter();
    const body = await request.json();

    const { id, estado } = body;

    if (!id || !estado) {
      return NextResponse.json(
        { success: false, error: 'Se requieren id y estado' },
        { status: 400 }
      );
    }

    if (!Object.values(AlertStatus).includes(estado)) {
      return NextResponse.json(
        { success: false, error: `Estado inválido: ${estado}` },
        { status: 400 }
      );
    }

    const alerta = await adapter.updateAlertaEstado(id, estado);

    return NextResponse.json({ success: true, data: alerta });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
