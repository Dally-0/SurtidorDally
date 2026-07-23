// ============================================================
// API Route: Surtidores — GET / POST
// ============================================================
// Usa el DatabaseAdapter (Patrón Adapter) y PumpFactory (Patrón Factory)
// para gestionar surtidores de forma desacoplada de Supabase.
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { getAdapter } from '@/core/adapters/DatabaseAdapter';
import { PumpFactory } from '@/core/factories/PumpFactory';
import { FuelType } from '@/types';

/**
 * GET /api/surtidores
 * Lista todos los surtidores. Opcionalmente filtra por sucursal.
 */
export async function GET(request: NextRequest) {
  try {
    const adapter = getAdapter();
    const { searchParams } = new URL(request.url);
    const sucursalId = searchParams.get('sucursal_id') || undefined;

    const surtidores = await adapter.getSurtidores(sucursalId);

    return NextResponse.json({
      success: true,
      data: surtidores,
      count: surtidores.length,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/surtidores
 * Crea un nuevo surtidor usando PumpFactory para validar y instanciar.
 */
export async function POST(request: NextRequest) {
  try {
    const adapter = getAdapter();
    const body = await request.json();

    const { combustible, numero_bomba, capacidad_maxima, nivel_actual, sucursal_id } = body;

    // Validar tipo de combustible
    if (!Object.values(FuelType).includes(combustible)) {
      return NextResponse.json(
        { success: false, error: `Tipo de combustible inválido: ${combustible}` },
        { status: 400 }
      );
    }

    // Usar PumpFactory para validar y crear
    const validation = PumpFactory.validate(combustible as FuelType, {
      numero_bomba,
      capacidad_maxima,
      nivel_actual,
      sucursal_id,
    });

    if (!validation.isValid) {
      return NextResponse.json(
        { success: false, errors: validation.errors },
        { status: 400 }
      );
    }

    // Crear vía Factory y persistir vía Adapter
    const pump = PumpFactory.create(combustible as FuelType, {
      numero_bomba,
      capacidad_maxima,
      nivel_actual,
      sucursal_id,
    });

    const entity = pump.toEntity();
    const created = await adapter.createSurtidor({
      numero_bomba: entity.numero_bomba,
      combustible: entity.combustible,
      capacidad_maxima: entity.capacidad_maxima,
      nivel_actual: entity.nivel_actual,
      sucursal_id: entity.sucursal_id,
    });

    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
