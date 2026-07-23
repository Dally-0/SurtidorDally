// ============================================================
// Utilidades de Aritmética Binaria — Metadata de Ventas
// ============================================================
// Implementa operaciones bitwise (AND, OR, SHIFT) para
// codificar/decodificar flags empaquetados en metadata_binaria
// ============================================================

import { SaleFlags, DecodedSaleMetadata } from '@/types';

/**
 * Verifica si un flag específico está activo en el valor de metadata.
 * Usa operación AND a nivel de bits.
 */
export function hasFlag(metadata: number, flag: SaleFlags): boolean {
  return (metadata & flag) !== 0;
}

/**
 * Activa un flag específico en el valor de metadata.
 * Usa operación OR a nivel de bits.
 */
export function setFlag(metadata: number, flag: SaleFlags): number {
  return metadata | flag;
}

/**
 * Desactiva un flag específico en el valor de metadata.
 * Usa operaciones AND y NOT a nivel de bits.
 */
export function clearFlag(metadata: number, flag: SaleFlags): number {
  return metadata & ~flag;
}

/**
 * Alterna (toggle) un flag específico en el valor de metadata.
 * Usa operación XOR a nivel de bits.
 */
export function toggleFlag(metadata: number, flag: SaleFlags): number {
  return metadata ^ flag;
}

/**
 * Codifica un objeto de flags en un valor numérico empaquetado.
 * Construye el valor bit a bit usando OR y SHIFT.
 */
export function encodeFlags(flags: Partial<DecodedSaleMetadata>): number {
  let result = 0;

  if (flags.facturada) {
    result = result | (1 << 0); // Bit 0: 0x01
  }
  if (flags.pagoDigital) {
    result = result | (1 << 1); // Bit 1: 0x02
  }
  if (flags.subsidioAplicado) {
    result = result | (1 << 2); // Bit 2: 0x04
  }
  if (flags.clienteFlota) {
    result = result | (1 << 3); // Bit 3: 0x08
  }

  return result;
}

/**
 * Decodifica un valor numérico empaquetado en un objeto de flags legible.
 * Extrae cada flag usando AND y SHIFT hacia la derecha.
 */
export function decodeFlags(metadata: number): DecodedSaleMetadata {
  return {
    facturada: ((metadata >> 0) & 1) === 1,        // Extraer bit 0
    pagoDigital: ((metadata >> 1) & 1) === 1,       // Extraer bit 1
    subsidioAplicado: ((metadata >> 2) & 1) === 1,  // Extraer bit 2
    clienteFlota: ((metadata >> 3) & 1) === 1,      // Extraer bit 3
  };
}

/**
 * Retorna una descripción legible de los flags activos.
 * Útil para renderizar en la UI de reportes.
 */
export function describeFlagsHuman(metadata: number): string[] {
  const descriptions: string[] = [];

  if (hasFlag(metadata, SaleFlags.INVOICED)) {
    descriptions.push('Facturada');
  }
  if (hasFlag(metadata, SaleFlags.DIGITAL_PAYMENT)) {
    descriptions.push('Pago Digital');
  } else {
    descriptions.push('Efectivo');
  }
  if (hasFlag(metadata, SaleFlags.SUBSIDY_APPLIED)) {
    descriptions.push('Subsidio Estatal');
  }
  if (hasFlag(metadata, SaleFlags.FLEET_CLIENT)) {
    descriptions.push('Cliente Flota');
  }

  return descriptions;
}

/**
 * Filtra un arreglo de ventas usando operaciones lógicas sobre metadata_binaria.
 * Permite filtros avanzados sin columnas booleanas adicionales en la BD.
 */
export function filterSalesByFlags(
  sales: { metadata_binaria: number }[],
  requiredFlags: SaleFlags[],
  mode: 'AND' | 'OR' = 'AND'
): typeof sales {
  if (requiredFlags.length === 0) return sales;

  if (mode === 'AND') {
    // Todos los flags deben estar activos (AND lógico entre flags)
    const combinedMask = requiredFlags.reduce((mask, flag) => mask | flag, 0);
    return sales.filter(sale => (sale.metadata_binaria & combinedMask) === combinedMask);
  } else {
    // Al menos uno de los flags debe estar activo (OR lógico entre flags)
    const combinedMask = requiredFlags.reduce((mask, flag) => mask | flag, 0);
    return sales.filter(sale => (sale.metadata_binaria & combinedMask) !== 0);
  }
}
