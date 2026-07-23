// ============================================================
// Tipos globales e interfaces — Sistema de Gestión Dally SRL
// ============================================================

// --- Enums ---

export enum FuelType {
  GASOLINA_ESPECIAL = 'Gasolina Especial',
  DIESEL = 'Diésel',
  GNV = 'GNV',
  PREMIUM = 'Premium',
}

export enum UserRole {
  SUPERADMIN = 'superadmin',
  ADMIN_SUCURSAL = 'admin_sucursal',
  OPERADOR = 'operador',
}

export enum AlertType {
  NIVEL_CRITICO = 'Nivel Crítico Bajo',
  FALLA_CONEXION = 'Falla de Conexión',
  SOBRECARGA = 'Sobrecarga',
  MANTENIMIENTO = 'Mantenimiento',
}

export enum AlertStatus {
  PENDIENTE = 'Pendiente',
  EN_REVISION = 'En Revisión',
  RESUELTA = 'Resuelta',
}

// --- Aritmética Binaria: Flags de Ventas ---

export enum SaleFlags {
  INVOICED = 0x01,         // Bit 0: Venta Facturada (Sí/No)
  DIGITAL_PAYMENT = 0x02,  // Bit 1: Método de pago (0: Efectivo, 1: Tarjeta/Digital)
  SUBSIDY_APPLIED = 0x04,  // Bit 2: Subsidio Estatal Aplicado (Sí/No)
  FLEET_CLIENT = 0x08,     // Bit 3: Cliente Institucional / Flota (Sí/No)
}

// --- Interfaces de Entidades ---

export interface Sucursal {
  id: string;
  nombre: string;
  direccion: string;
  ciudad: string;
  creado_en: string;
}

export interface Usuario {
  id: string;
  email: string;
  nombre: string;
  rol: UserRole;
  sucursal_id: string | null;
  activo: boolean;
  creado_en: string;
}

export interface Surtidor {
  id: string;
  numero_bomba: number;
  combustible: FuelType;
  capacidad_maxima: number;
  nivel_actual: number;
  sucursal_id: string;
  creado_en: string;
}

export interface Venta {
  id: string;
  fecha: string;
  combustible: string;
  litros: number;
  precio_por_litro: number;
  total: number;
  surtidor_id: string;
  usuario_id: string;
  metadata_binaria: number;
}

export interface Alerta {
  id: string;
  surtidor_id: string;
  tipo: AlertType;
  estado: AlertStatus;
  fecha: string;
  resuelto_en: string | null;
}

// --- Tipos Auxiliares para UI ---

export interface KPIData {
  label: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: string;
}

export interface TransactionRow {
  id: string;
  hora: string;
  tipo: string;
  litros: number;
  monto: number;
  operador: string;
  estado: 'OK' | 'Revisar';
}

export interface SalesChartData {
  day: string;
  gasolina: number;
  diesel: number;
}

export interface FuelMixData {
  name: string;
  value: number;
  color: string;
}

// --- Configuración del Surtidor (para Factory) ---

export interface PumpConfig {
  numero_bomba: number;
  capacidad_maxima: number;
  nivel_actual: number;
  sucursal_id: string;
}

export interface PumpValidation {
  isValid: boolean;
  errors: string[];
}

// --- Decoded Sale Metadata ---

export interface DecodedSaleMetadata {
  facturada: boolean;
  pagoDigital: boolean;
  subsidioAplicado: boolean;
  clienteFlota: boolean;
}
