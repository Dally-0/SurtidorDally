-- ============================================================
-- Datos Seed — Sistema de Gestión de Combustible Dally SRL
-- ============================================================
-- Ejecutar DESPUÉS de crear las tablas (schema.sql) en Supabase.
-- Inserta datos de demostración para todas las tablas.
-- ============================================================

-- 1. SUCURSALES
INSERT INTO sucursales (id, nombre, direccion, ciudad) VALUES
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Estación Central Dally', 'Av. Petrolera 1450, Parque Industrial Sur', 'Santa Cruz de la Sierra'),
  ('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'Estación Norte Dally', 'Av. Banzer km 8', 'Santa Cruz de la Sierra')
ON CONFLICT (id) DO NOTHING;

-- 2. USUARIOS (los IDs deben coincidir con auth.users si se usa auth real)
-- Para demo, insertamos directamente
INSERT INTO usuarios (id, email, nombre, rol, sucursal_id, activo) VALUES
  ('11111111-1111-1111-1111-111111111111', 'admin@dallysrl.bo', 'Carlos Dally', 'superadmin', NULL, true),
  ('22222222-2222-2222-2222-222222222222', 'rmendez@dallysrl.bo', 'R. Méndez', 'operador', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', true),
  ('33333333-3333-3333-3333-333333333333', 'clopez@dallysrl.bo', 'C. López', 'operador', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', true),
  ('44444444-4444-4444-4444-444444444444', 'mtorres@dallysrl.bo', 'M. Torres', 'operador', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', true)
ON CONFLICT (id) DO NOTHING;

-- 3. SURTIDORES
INSERT INTO surtidores (id, numero_bomba, combustible, capacidad_maxima, nivel_actual, sucursal_id) VALUES
  ('aaaa1111-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 1, 'Gasolina Especial', 15000, 8500, 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'),
  ('bbbb2222-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 2, 'Diésel', 20000, 12000, 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'),
  ('cccc3333-cccc-cccc-cccc-cccccccccccc', 3, 'GNV', 8000, 3200, 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'),
  ('dddd4444-dddd-dddd-dddd-dddddddddddd', 4, 'Premium', 10000, 6800, 'a1b2c3d4-e5f6-7890-abcd-ef1234567890')
ON CONFLICT (id) DO NOTHING;

-- 4. VENTAS (con fecha de HOY para que aparezcan en el dashboard)
-- metadata_binaria: 1=facturada, 2=pago digital, 4=subsidio, 8=flota
INSERT INTO ventas (combustible, litros, precio_por_litro, total, surtidor_id, usuario_id, metadata_binaria, fecha) VALUES
  ('Gasolina Especial', 42.5, 9.00, 382.50, 'aaaa1111-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', 1, NOW() - INTERVAL '3 hours'),
  ('Diésel', 80.0, 8.00, 640.00, 'bbbb2222-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '33333333-3333-3333-3333-333333333333', 11, NOW() - INTERVAL '2 hours 30 minutes'),
  ('Premium', 35.2, 11.00, 387.20, 'dddd4444-dddd-dddd-dddd-dddddddddddd', '22222222-2222-2222-2222-222222222222', 5, NOW() - INTERVAL '2 hours'),
  ('Gasolina Especial', 28.0, 9.00, 252.00, 'aaaa1111-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '44444444-4444-4444-4444-444444444444', 0, NOW() - INTERVAL '1 hour 30 minutes'),
  ('GNV', 12.4, 6.00, 74.40, 'cccc3333-cccc-cccc-cccc-cccccccccccc', '33333333-3333-3333-3333-333333333333', 3, NOW() - INTERVAL '1 hour'),
  ('Diésel', 60.0, 8.00, 480.00, 'bbbb2222-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '22222222-2222-2222-2222-222222222222', 13, NOW() - INTERVAL '30 minutes'),
  ('Gasolina Especial', 55.0, 9.00, 495.00, 'aaaa1111-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', 3, NOW() - INTERVAL '10 minutes');

-- Ventas de ayer (para comparación en KPIs)
INSERT INTO ventas (combustible, litros, precio_por_litro, total, surtidor_id, usuario_id, metadata_binaria, fecha) VALUES
  ('Gasolina Especial', 50.0, 9.00, 450.00, 'aaaa1111-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', 1, NOW() - INTERVAL '1 day 4 hours'),
  ('Diésel', 70.0, 8.00, 560.00, 'bbbb2222-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '33333333-3333-3333-3333-333333333333', 3, NOW() - INTERVAL '1 day 3 hours'),
  ('Premium', 30.0, 11.00, 330.00, 'dddd4444-dddd-dddd-dddd-dddddddddddd', '44444444-4444-4444-4444-444444444444', 1, NOW() - INTERVAL '1 day 2 hours'),
  ('Gasolina Especial', 45.0, 9.00, 405.00, 'aaaa1111-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', 2, NOW() - INTERVAL '1 day 1 hour'),
  ('GNV', 15.0, 6.00, 90.00, 'cccc3333-cccc-cccc-cccc-cccccccccccc', '33333333-3333-3333-3333-333333333333', 1, NOW() - INTERVAL '1 day 30 minutes'),
  ('Diésel', 40.0, 8.00, 320.00, 'bbbb2222-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '22222222-2222-2222-2222-222222222222', 9, NOW() - INTERVAL '1 day 15 minutes'),
  ('Gasolina Especial', 38.0, 9.00, 342.00, 'aaaa1111-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '44444444-4444-4444-4444-444444444444', 1, NOW() - INTERVAL '1 day 5 minutes'),
  ('Premium', 25.0, 11.00, 275.00, 'dddd4444-dddd-dddd-dddd-dddddddddddd', '22222222-2222-2222-2222-222222222222', 5, NOW() - INTERVAL '1 day'),
  ('Diésel', 55.0, 8.00, 440.00, 'bbbb2222-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '33333333-3333-3333-3333-333333333333', 11, NOW() - INTERVAL '23 hours');

-- Ventas adicionales de la semana (para el gráfico semanal)
INSERT INTO ventas (combustible, litros, precio_por_litro, total, surtidor_id, usuario_id, metadata_binaria, fecha) VALUES
  ('Gasolina Especial', 120.0, 9.00, 1080.00, 'aaaa1111-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', 1, NOW() - INTERVAL '2 days'),
  ('Diésel', 90.0, 8.00, 720.00, 'bbbb2222-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '33333333-3333-3333-3333-333333333333', 3, NOW() - INTERVAL '2 days'),
  ('Gasolina Especial', 100.0, 9.00, 900.00, 'aaaa1111-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '44444444-4444-4444-4444-444444444444', 1, NOW() - INTERVAL '3 days'),
  ('Diésel', 110.0, 8.00, 880.00, 'bbbb2222-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '22222222-2222-2222-2222-222222222222', 9, NOW() - INTERVAL '3 days'),
  ('Premium', 60.0, 11.00, 660.00, 'dddd4444-dddd-dddd-dddd-dddddddddddd', '33333333-3333-3333-3333-333333333333', 5, NOW() - INTERVAL '4 days'),
  ('Gasolina Especial', 80.0, 9.00, 720.00, 'aaaa1111-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', 1, NOW() - INTERVAL '4 days'),
  ('Diésel', 75.0, 8.00, 600.00, 'bbbb2222-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '44444444-4444-4444-4444-444444444444', 3, NOW() - INTERVAL '5 days'),
  ('GNV', 20.0, 6.00, 120.00, 'cccc3333-cccc-cccc-cccc-cccccccccccc', '33333333-3333-3333-3333-333333333333', 1, NOW() - INTERVAL '5 days'),
  ('Gasolina Especial', 95.0, 9.00, 855.00, 'aaaa1111-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', 2, NOW() - INTERVAL '6 days'),
  ('Diésel', 85.0, 8.00, 680.00, 'bbbb2222-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '33333333-3333-3333-3333-333333333333', 11, NOW() - INTERVAL '6 days');

-- 5. ALERTAS
INSERT INTO alertas (surtidor_id, tipo, estado) VALUES
  ('cccc3333-cccc-cccc-cccc-cccccccccccc', 'Nivel Crítico Bajo', 'Pendiente');
