// ============================================================
// Datos Mock para Demo — Sistema Dally SRL
// ============================================================

import {
  Sucursal, Usuario, Surtidor, Venta, Alerta,
  FuelType, UserRole, AlertType, AlertStatus,
  TransactionRow, SalesChartData, FuelMixData,
} from '@/types';
import { encodeFlags } from '@/core/utils/binaryMetadata';

// --- Sucursales ---

export const mockSucursales: Sucursal[] = [
  {
    id: 'suc-001',
    nombre: 'Estación Central Dally',
    direccion: 'Av. Petrolera 1450, Parque Industrial Sur',
    ciudad: 'Santa Cruz de la Sierra',
    creado_en: '2024-01-15T10:00:00Z',
  },
  {
    id: 'suc-002',
    nombre: 'Estación Norte Dally',
    direccion: 'Av. Banzer km 8',
    ciudad: 'Santa Cruz de la Sierra',
    creado_en: '2024-03-20T10:00:00Z',
  },
];

// --- Usuarios ---

export const mockUsuarios: Usuario[] = [
  {
    id: 'usr-001',
    email: 'admin@dallysrl.bo',
    nombre: 'Carlos Dally',
    rol: UserRole.SUPERADMIN,
    sucursal_id: null,
    activo: true,
    creado_en: '2024-01-15T10:00:00Z',
  },
  {
    id: 'usr-002',
    email: 'rmendez@dallysrl.bo',
    nombre: 'R. Méndez',
    rol: UserRole.OPERADOR,
    sucursal_id: 'suc-001',
    activo: true,
    creado_en: '2024-02-01T10:00:00Z',
  },
  {
    id: 'usr-003',
    email: 'clopez@dallysrl.bo',
    nombre: 'C. López',
    rol: UserRole.OPERADOR,
    sucursal_id: 'suc-001',
    activo: true,
    creado_en: '2024-02-15T10:00:00Z',
  },
  {
    id: 'usr-004',
    email: 'mtorres@dallysrl.bo',
    nombre: 'M. Torres',
    rol: UserRole.OPERADOR,
    sucursal_id: 'suc-001',
    activo: true,
    creado_en: '2024-03-01T10:00:00Z',
  },
];

// --- Surtidores ---

export const mockSurtidores: Surtidor[] = [
  {
    id: 'sur-001',
    numero_bomba: 1,
    combustible: FuelType.GASOLINA_ESPECIAL,
    capacidad_maxima: 15000,
    nivel_actual: 8500,
    sucursal_id: 'suc-001',
    creado_en: '2024-01-15T10:00:00Z',
  },
  {
    id: 'sur-002',
    numero_bomba: 2,
    combustible: FuelType.DIESEL,
    capacidad_maxima: 20000,
    nivel_actual: 12000,
    sucursal_id: 'suc-001',
    creado_en: '2024-01-15T10:00:00Z',
  },
  {
    id: 'sur-003',
    numero_bomba: 3,
    combustible: FuelType.GNV,
    capacidad_maxima: 8000,
    nivel_actual: 3200,
    sucursal_id: 'suc-001',
    creado_en: '2024-01-15T10:00:00Z',
  },
  {
    id: 'sur-004',
    numero_bomba: 4,
    combustible: FuelType.PREMIUM,
    capacidad_maxima: 10000,
    nivel_actual: 6800,
    sucursal_id: 'suc-001',
    creado_en: '2024-01-15T10:00:00Z',
  },
];

// --- Ventas (con metadata binaria) ---

export const mockVentas: Venta[] = [
  {
    id: 'TXN-4821',
    fecha: '2026-07-23T08:14:00Z',
    combustible: 'Gasolina 91',
    litros: 42.5,
    precio_por_litro: 9.00,
    total: 382.50,
    surtidor_id: 'sur-001',
    usuario_id: 'usr-002',
    metadata_binaria: encodeFlags({ facturada: true, pagoDigital: false, subsidioAplicado: false, clienteFlota: false }),
  },
  {
    id: 'TXN-4822',
    fecha: '2026-07-23T08:31:00Z',
    combustible: 'Diesel',
    litros: 80.0,
    precio_por_litro: 8.00,
    total: 640.00,
    surtidor_id: 'sur-002',
    usuario_id: 'usr-003',
    metadata_binaria: encodeFlags({ facturada: true, pagoDigital: true, subsidioAplicado: false, clienteFlota: true }),
  },
  {
    id: 'TXN-4823',
    fecha: '2026-07-23T08:47:00Z',
    combustible: 'Premium 95',
    litros: 35.2,
    precio_por_litro: 11.00,
    total: 387.20,
    surtidor_id: 'sur-004',
    usuario_id: 'usr-002',
    metadata_binaria: encodeFlags({ facturada: true, pagoDigital: false, subsidioAplicado: true, clienteFlota: false }),
  },
  {
    id: 'TXN-4824',
    fecha: '2026-07-23T09:05:00Z',
    combustible: 'Gasolina 91',
    litros: 28.0,
    precio_por_litro: 9.00,
    total: 252.00,
    surtidor_id: 'sur-001',
    usuario_id: 'usr-004',
    metadata_binaria: encodeFlags({ facturada: false, pagoDigital: false, subsidioAplicado: false, clienteFlota: false }),
  },
  {
    id: 'TXN-4825',
    fecha: '2026-07-23T09:22:00Z',
    combustible: 'GNV',
    litros: 12.4,
    precio_por_litro: 6.00,
    total: 74.40,
    surtidor_id: 'sur-003',
    usuario_id: 'usr-003',
    metadata_binaria: encodeFlags({ facturada: true, pagoDigital: true, subsidioAplicado: false, clienteFlota: false }),
  },
  {
    id: 'TXN-4826',
    fecha: '2026-07-23T09:38:00Z',
    combustible: 'Diesel',
    litros: 60.0,
    precio_por_litro: 8.00,
    total: 480.00,
    surtidor_id: 'sur-002',
    usuario_id: 'usr-002',
    metadata_binaria: encodeFlags({ facturada: true, pagoDigital: false, subsidioAplicado: true, clienteFlota: true }),
  },
  {
    id: 'TXN-4827',
    fecha: '2026-07-23T09:55:00Z',
    combustible: 'Gasolina 91',
    litros: 55.0,
    precio_por_litro: 9.00,
    total: 495.00,
    surtidor_id: 'sur-001',
    usuario_id: 'usr-002',
    metadata_binaria: encodeFlags({ facturada: true, pagoDigital: true, subsidioAplicado: false, clienteFlota: false }),
  },
];

// --- Alertas ---

export const mockAlertas: Alerta[] = [
  {
    id: 'alt-001',
    surtidor_id: 'sur-003',
    tipo: AlertType.NIVEL_CRITICO,
    estado: AlertStatus.PENDIENTE,
    fecha: '2026-07-23T09:30:00Z',
    resuelto_en: null,
  },
];

// --- Datos para gráficos del Dashboard ---

export const mockTransactions: TransactionRow[] = [
  { id: 'TXN-4821', hora: '08:14', tipo: 'Gasolina 91', litros: 42.5, monto: 382.50, operador: 'R. Méndez', estado: 'OK' },
  { id: 'TXN-4822', hora: '08:31', tipo: 'Diesel', litros: 80.0, monto: 640.00, operador: 'C. López', estado: 'OK' },
  { id: 'TXN-4823', hora: '08:47', tipo: 'Premium 95', litros: 35.2, monto: 387.20, operador: 'R. Méndez', estado: 'OK' },
  { id: 'TXN-4824', hora: '09:05', tipo: 'Gasolina 91', litros: 28.0, monto: 252.00, operador: 'M. Torres', estado: 'Revisar' },
  { id: 'TXN-4825', hora: '09:22', tipo: 'GNV', litros: 12.4, monto: 74.40, operador: 'C. López', estado: 'OK' },
  { id: 'TXN-4826', hora: '09:38', tipo: 'Diesel', litros: 60.0, monto: 480.00, operador: 'R. Méndez', estado: 'OK' },
  { id: 'TXN-4827', hora: '09:55', tipo: 'Gasolina 91', litros: 55.0, monto: 495.00, operador: 'R. Méndez', estado: 'OK' },
];

export const mockSalesChartData: SalesChartData[] = [
  { day: 'Lun', gasolina: 3200, diesel: 2800 },
  { day: 'Mar', gasolina: 3500, diesel: 3100 },
  { day: 'Mié', gasolina: 5100, diesel: 2600 },
  { day: 'Jue', gasolina: 4200, diesel: 3800 },
  { day: 'Vie', gasolina: 4800, diesel: 4200 },
  { day: 'Sáb', gasolina: 5500, diesel: 4800 },
  { day: 'Dom', gasolina: 6200, diesel: 5400 },
];

export const mockFuelMixData: FuelMixData[] = [
  { name: 'Gasolina 91', value: 45, color: '#F5C518' },
  { name: 'Diesel', value: 32, color: '#3B82F6' },
  { name: 'Premium 95', value: 15, color: '#F97316' },
  { name: 'GNV', value: 8, color: '#22C55E' },
];
