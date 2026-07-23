// ============================================================
// Patrón Estructural: Adapter — DatabaseAdapter
// ============================================================
// Interfaz genérica que aísla la lógica de negocio de la
// persistencia directa de Supabase. Toda consulta o mutación
// de datos pasa a través del Adapter.
// ============================================================

import { Surtidor, Venta, Alerta, AlertStatus, Sucursal, Usuario } from '@/types';
import { supabase } from '@/lib/supabase';

/**
 * IDatabaseAdapter — Interfaz genérica del Adapter
 */
export interface IDatabaseAdapter {
  // --- Sucursales ---
  getSucursales(): Promise<Sucursal[]>;
  getSucursalById(id: string): Promise<Sucursal | null>;

  // --- Usuarios ---
  getUsuarios(): Promise<Usuario[]>;
  getUsuarioById(id: string): Promise<Usuario | null>;

  // --- Surtidores ---
  getSurtidores(sucursalId?: string): Promise<Surtidor[]>;
  getSurtidorById(id: string): Promise<Surtidor | null>;
  createSurtidor(surtidor: Omit<Surtidor, 'id' | 'creado_en'>): Promise<Surtidor>;
  updateSurtidor(id: string, data: Partial<Surtidor>): Promise<Surtidor>;
  deleteSurtidor(id: string): Promise<void>;

  // --- Ventas ---
  getVentas(filters?: VentaFilters): Promise<Venta[]>;
  getVentaById(id: string): Promise<Venta | null>;
  createVenta(venta: Omit<Venta, 'id' | 'fecha'>): Promise<Venta>;

  // --- Alertas ---
  getAlertas(filters?: AlertaFilters): Promise<Alerta[]>;
  createAlerta(alerta: Omit<Alerta, 'id' | 'fecha' | 'resuelto_en'>): Promise<Alerta>;
  updateAlertaEstado(id: string, estado: AlertStatus): Promise<Alerta>;
}

export interface VentaFilters {
  surtidorId?: string;
  fechaDesde?: string;
  fechaHasta?: string;
  combustible?: string;
}

export interface AlertaFilters {
  surtidorId?: string;
  estado?: AlertStatus;
  tipo?: string;
}

// ============================================================
// Implementación REAL: SupabaseDatabaseAdapter
// ============================================================
// Usa @supabase/supabase-js para todas las operaciones CRUD
// contra la base de datos PostgreSQL de Supabase.
// ============================================================

export class SupabaseDatabaseAdapter implements IDatabaseAdapter {

  // --- Sucursales ---
  async getSucursales(): Promise<Sucursal[]> {
    const { data, error } = await supabase
      .from('sucursales')
      .select('*')
      .order('creado_en', { ascending: false });
    if (error) throw new Error(`Error al obtener sucursales: ${error.message}`);
    return data || [];
  }

  async getSucursalById(id: string): Promise<Sucursal | null> {
    const { data, error } = await supabase
      .from('sucursales')
      .select('*')
      .eq('id', id)
      .single();
    if (error && error.code !== 'PGRST116') throw new Error(`Error: ${error.message}`);
    return data || null;
  }

  // --- Usuarios ---
  async getUsuarios(): Promise<Usuario[]> {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .order('nombre', { ascending: true });
    if (error) throw new Error(`Error al obtener usuarios: ${error.message}`);
    return data || [];
  }

  async getUsuarioById(id: string): Promise<Usuario | null> {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('id', id)
      .single();
    if (error && error.code !== 'PGRST116') throw new Error(`Error: ${error.message}`);
    return data || null;
  }

  // --- Surtidores ---
  async getSurtidores(sucursalId?: string): Promise<Surtidor[]> {
    let query = supabase
      .from('surtidores')
      .select('*')
      .order('numero_bomba', { ascending: true });

    if (sucursalId) {
      query = query.eq('sucursal_id', sucursalId);
    }

    const { data, error } = await query;
    if (error) throw new Error(`Error al obtener surtidores: ${error.message}`);
    return data || [];
  }

  async getSurtidorById(id: string): Promise<Surtidor | null> {
    const { data, error } = await supabase
      .from('surtidores')
      .select('*')
      .eq('id', id)
      .single();
    if (error && error.code !== 'PGRST116') throw new Error(`Error: ${error.message}`);
    return data || null;
  }

  async createSurtidor(surtidorData: Omit<Surtidor, 'id' | 'creado_en'>): Promise<Surtidor> {
    const { data, error } = await supabase
      .from('surtidores')
      .insert(surtidorData)
      .select()
      .single();
    if (error) throw new Error(`Error al crear surtidor: ${error.message}`);
    return data;
  }

  async updateSurtidor(id: string, updateData: Partial<Surtidor>): Promise<Surtidor> {
    const { data, error } = await supabase
      .from('surtidores')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    if (error) throw new Error(`Error al actualizar surtidor: ${error.message}`);
    return data;
  }

  async deleteSurtidor(id: string): Promise<void> {
    const { error } = await supabase
      .from('surtidores')
      .delete()
      .eq('id', id);
    if (error) throw new Error(`Error al eliminar surtidor: ${error.message}`);
  }

  // --- Ventas ---
  async getVentas(filters?: VentaFilters): Promise<Venta[]> {
    let query = supabase
      .from('ventas')
      .select('*')
      .order('fecha', { ascending: false });

    if (filters?.surtidorId) {
      query = query.eq('surtidor_id', filters.surtidorId);
    }
    if (filters?.combustible) {
      query = query.eq('combustible', filters.combustible);
    }
    if (filters?.fechaDesde) {
      query = query.gte('fecha', filters.fechaDesde);
    }
    if (filters?.fechaHasta) {
      query = query.lte('fecha', filters.fechaHasta);
    }

    const { data, error } = await query;
    if (error) throw new Error(`Error al obtener ventas: ${error.message}`);
    return data || [];
  }

  async getVentaById(id: string): Promise<Venta | null> {
    const { data, error } = await supabase
      .from('ventas')
      .select('*')
      .eq('id', id)
      .single();
    if (error && error.code !== 'PGRST116') throw new Error(`Error: ${error.message}`);
    return data || null;
  }

  async createVenta(ventaData: Omit<Venta, 'id' | 'fecha'>): Promise<Venta> {
    const { data, error } = await supabase
      .from('ventas')
      .insert(ventaData)
      .select()
      .single();
    if (error) throw new Error(`Error al crear venta: ${error.message}`);
    return data;
  }

  // --- Alertas ---
  async getAlertas(filters?: AlertaFilters): Promise<Alerta[]> {
    let query = supabase
      .from('alertas')
      .select('*')
      .order('fecha', { ascending: false });

    if (filters?.surtidorId) {
      query = query.eq('surtidor_id', filters.surtidorId);
    }
    if (filters?.estado) {
      query = query.eq('estado', filters.estado);
    }
    if (filters?.tipo) {
      query = query.eq('tipo', filters.tipo);
    }

    const { data, error } = await query;
    if (error) throw new Error(`Error al obtener alertas: ${error.message}`);
    return data || [];
  }

  async createAlerta(alertaData: Omit<Alerta, 'id' | 'fecha' | 'resuelto_en'>): Promise<Alerta> {
    const { data, error } = await supabase
      .from('alertas')
      .insert(alertaData)
      .select()
      .single();
    if (error) throw new Error(`Error al crear alerta: ${error.message}`);
    return data;
  }

  async updateAlertaEstado(id: string, estado: AlertStatus): Promise<Alerta> {
    const updateData: Record<string, unknown> = { estado };
    if (estado === AlertStatus.RESUELTA) {
      updateData.resuelto_en = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from('alertas')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    if (error) throw new Error(`Error al actualizar alerta: ${error.message}`);
    return data;
  }
}

// ============================================================
// Singleton — usa siempre SupabaseDatabaseAdapter
// ============================================================

let adapterInstance: IDatabaseAdapter | null = null;

export function getAdapter(): IDatabaseAdapter {
  if (!adapterInstance) {
    adapterInstance = new SupabaseDatabaseAdapter();
  }
  return adapterInstance;
}
