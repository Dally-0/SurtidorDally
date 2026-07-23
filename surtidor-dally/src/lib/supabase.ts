// ============================================================
// Cliente Supabase — Inicialización
// ============================================================
// Configuración del cliente para browser y server.
// En modo demo, se usan valores placeholder.
// ============================================================

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://demo.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'demo-anon-key';

/**
 * Cliente Supabase para uso en el browser (componentes client-side).
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Verifica si estamos usando credenciales reales de Supabase.
 */
export function isSupabaseConfigured(): boolean {
  return (
    supabaseUrl !== 'https://demo.supabase.co' &&
    supabaseAnonKey !== 'demo-anon-key'
  );
}
