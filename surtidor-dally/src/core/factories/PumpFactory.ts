// ============================================================
// Patrón Creacional: Factory — PumpFactory
// ============================================================
// Fábrica de Surtidores que instancia objetos de tipo surtidor
// según el tipo de combustible, validando capacidades y niveles
// mínimos de seguridad de forma centralizada.
// ============================================================

import { FuelType, Surtidor, PumpConfig, PumpValidation } from '@/types';

/**
 * Niveles mínimos de seguridad por tipo de combustible (en litros).
 * Cuando el nivel actual cae por debajo de este umbral, se genera una alerta.
 */
const SAFETY_THRESHOLDS: Record<FuelType, number> = {
  [FuelType.GASOLINA_ESPECIAL]: 500,
  [FuelType.DIESEL]: 400,
  [FuelType.GNV]: 200,
  [FuelType.PREMIUM]: 300,
};

/**
 * Capacidades máximas permitidas por tipo de combustible (en litros).
 */
const MAX_CAPACITIES: Record<FuelType, number> = {
  [FuelType.GASOLINA_ESPECIAL]: 20000,
  [FuelType.DIESEL]: 25000,
  [FuelType.GNV]: 10000,
  [FuelType.PREMIUM]: 15000,
};

/**
 * Capacidades mínimas permitidas por tipo de combustible (en litros).
 */
const MIN_CAPACITIES: Record<FuelType, number> = {
  [FuelType.GASOLINA_ESPECIAL]: 1000,
  [FuelType.DIESEL]: 1000,
  [FuelType.GNV]: 500,
  [FuelType.PREMIUM]: 800,
};

/**
 * Clase abstracta base para todos los tipos de surtidor.
 * Define la interfaz común y comportamiento compartido.
 */
abstract class BasePump {
  readonly fuelType: FuelType;
  readonly numero_bomba: number;
  readonly capacidad_maxima: number;
  readonly sucursal_id: string;
  nivel_actual: number;

  constructor(fuelType: FuelType, config: PumpConfig) {
    this.fuelType = fuelType;
    this.numero_bomba = config.numero_bomba;
    this.capacidad_maxima = config.capacidad_maxima;
    this.nivel_actual = config.nivel_actual;
    this.sucursal_id = config.sucursal_id;
  }

  /**
   * Verifica si el nivel actual está por debajo del umbral de seguridad.
   */
  isCritical(): boolean {
    return this.nivel_actual < SAFETY_THRESHOLDS[this.fuelType];
  }

  /**
   * Retorna el porcentaje de llenado del surtidor.
   */
  getFillPercentage(): number {
    return (this.nivel_actual / this.capacidad_maxima) * 100;
  }

  /**
   * Obtiene el umbral de seguridad para este tipo de combustible.
   */
  getSafetyThreshold(): number {
    return SAFETY_THRESHOLDS[this.fuelType];
  }

  /**
   * Convierte a un objeto Surtidor para persistencia.
   */
  toEntity(id?: string): Surtidor {
    return {
      id: id || crypto.randomUUID(),
      numero_bomba: this.numero_bomba,
      combustible: this.fuelType,
      capacidad_maxima: this.capacidad_maxima,
      nivel_actual: this.nivel_actual,
      sucursal_id: this.sucursal_id,
      creado_en: new Date().toISOString(),
    };
  }
}

// --- Implementaciones concretas por tipo de combustible ---

class GasolinaEspecialPump extends BasePump {
  constructor(config: PumpConfig) {
    super(FuelType.GASOLINA_ESPECIAL, config);
  }
}

class DieselPump extends BasePump {
  constructor(config: PumpConfig) {
    super(FuelType.DIESEL, config);
  }
}

class GNVPump extends BasePump {
  constructor(config: PumpConfig) {
    super(FuelType.GNV, config);
  }
}

class PremiumPump extends BasePump {
  constructor(config: PumpConfig) {
    super(FuelType.PREMIUM, config);
  }
}

// --- Fábrica principal ---

/**
 * PumpFactory — Patrón Factory
 * 
 * Instancia dinámicamente objetos de tipo surtidor según el tipo de
 * combustible y valida sus capacidades y niveles mínimos de seguridad
 * de forma centralizada.
 */
export class PumpFactory {
  /**
   * Valida la configuración de un surtidor antes de crearlo.
   * Verifica capacidades permitidas y niveles coherentes.
   */
  static validate(fuelType: FuelType, config: PumpConfig): PumpValidation {
    const errors: string[] = [];

    // Validar que la capacidad esté dentro del rango permitido
    if (config.capacidad_maxima < MIN_CAPACITIES[fuelType]) {
      errors.push(
        `Capacidad mínima para ${fuelType}: ${MIN_CAPACITIES[fuelType]}L. ` +
        `Valor recibido: ${config.capacidad_maxima}L`
      );
    }

    if (config.capacidad_maxima > MAX_CAPACITIES[fuelType]) {
      errors.push(
        `Capacidad máxima para ${fuelType}: ${MAX_CAPACITIES[fuelType]}L. ` +
        `Valor recibido: ${config.capacidad_maxima}L`
      );
    }

    // Validar que el nivel actual no supere la capacidad
    if (config.nivel_actual > config.capacidad_maxima) {
      errors.push(
        `El nivel actual (${config.nivel_actual}L) no puede superar la ` +
        `capacidad máxima (${config.capacidad_maxima}L)`
      );
    }

    // Validar que el nivel actual no sea negativo
    if (config.nivel_actual < 0) {
      errors.push('El nivel actual no puede ser negativo');
    }

    // Validar número de bomba
    if (config.numero_bomba < 1) {
      errors.push('El número de bomba debe ser mayor a 0');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Crea una instancia de surtidor según el tipo de combustible.
   * Valida la configuración y lanza un error si no es válida.
   */
  static create(fuelType: FuelType, config: PumpConfig): BasePump {
    // Validar antes de crear
    const validation = PumpFactory.validate(fuelType, config);
    if (!validation.isValid) {
      throw new Error(
        `Error al crear surtidor de ${fuelType}: ${validation.errors.join('; ')}`
      );
    }

    // Instanciar según tipo
    switch (fuelType) {
      case FuelType.GASOLINA_ESPECIAL:
        return new GasolinaEspecialPump(config);
      case FuelType.DIESEL:
        return new DieselPump(config);
      case FuelType.GNV:
        return new GNVPump(config);
      case FuelType.PREMIUM:
        return new PremiumPump(config);
      default:
        throw new Error(`Tipo de combustible no soportado: ${fuelType}`);
    }
  }

  /**
   * Retorna los umbrales de seguridad para todos los tipos.
   */
  static getSafetyThresholds(): Record<FuelType, number> {
    return { ...SAFETY_THRESHOLDS };
  }

  /**
   * Retorna las capacidades máximas para todos los tipos.
   */
  static getMaxCapacities(): Record<FuelType, number> {
    return { ...MAX_CAPACITIES };
  }
}

export { BasePump };
