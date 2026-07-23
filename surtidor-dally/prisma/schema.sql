-- ============================================================
-- Esquema SQL — Sistema de Gestión de Combustible Dally SRL
-- ============================================================
-- Ejecutar en el editor SQL de Supabase para crear las tablas.
-- ============================================================

-- Habilitar la extensión para UUIDs si no está activa
create extension if not exists "uuid-ossp";

-- 1. TABLA: SUCURSALES
create table sucursales (
    id uuid default gen_random_uuid() primary key,
    nombre varchar(100) not null,
    direccion varchar(255) not null,
    ciudad varchar(100) not null,
    creado_en timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. TABLA: USUARIOS (Admins, Operadores)
-- Nota: Se vincula conceptualmente o mediante triggers con auth.users de Supabase
create table usuarios (
    id uuid primary key, -- Debe coincidir con auth.users.id de Supabase
    email varchar(150) unique not null,
    nombre varchar(100) not null,
    rol varchar(50) check (rol in ('superadmin', 'admin_sucursal', 'operador')) not null,
    sucursal_id uuid references sucursales(id) on delete set null,
    activo boolean default true not null,
    creado_en timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. TABLA: SURTIDORES (Múltiples bombas por sucursal y tipo de combustible)
create table surtidores (
    id uuid default gen_random_uuid() primary key,
    numero_bomba integer not null,
    combustible varchar(50) check (combustible in ('Gasolina Especial', 'Diésel', 'GNV', 'Premium')) not null,
    capacidad_maxima numeric(10, 2) not null, -- En litros
    nivel_actual numeric(10, 2) not null, -- En litros
    sucursal_id uuid references sucursales(id) on delete cascade not null,
    creado_en timestamp with time zone default timezone('utc'::text, now()) not null,
    constraint unique_bomba_sucursal unique (sucursal_id, numero_bomba)
);

-- 4. TABLA: VENTAS (Registro transaccional de combustible)
create table ventas (
    id uuid default gen_random_uuid() primary key,
    fecha timestamp with time zone default timezone('utc'::text, now()) not null,
    combustible varchar(50) not null,
    litros numeric(10, 2) not null,
    precio_por_litro numeric(10, 2) not null,
    total numeric(12, 2) not null,
    surtidor_id uuid references surtidores(id) on delete restrict not null,
    usuario_id uuid references usuarios(id) on delete restrict not null, -- Operador que realizó la venta
    metadata_binaria integer default 0 not null -- Campo para lógica de aritmética binaria / flags del sistema
);

-- 5. TABLA: ALERTAS (Historial de incidentes o desabastecimiento)
create table alertas (
    id uuid default gen_random_uuid() primary key,
    surtidor_id uuid references surtidores(id) on delete cascade not null,
    tipo varchar(50) check (tipo in ('Nivel Crítico Bajo', 'Falla de Conexión', 'Sobrecarga', 'Mantenimiento')) not null,
    estado varchar(30) check (estado in ('Pendiente', 'En Revisión', 'Resuelta')) default 'Pendiente' not null,
    fecha timestamp with time zone default timezone('utc'::text, now()) not null,
    resuelto_en timestamp with time zone
);

-- ============================================================
-- Datos de ejemplo (Seed)
-- ============================================================

-- Sucursal de ejemplo
INSERT INTO sucursales (id, nombre, direccion, ciudad) VALUES
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Estación Central Dally', 'Av. Petrolera 1450, Parque Industrial Sur', 'Santa Cruz de la Sierra');

-- Surtidores de ejemplo
INSERT INTO surtidores (numero_bomba, combustible, capacidad_maxima, nivel_actual, sucursal_id) VALUES
  (1, 'Gasolina Especial', 15000, 8500, 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'),
  (2, 'Diésel', 20000, 12000, 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'),
  (3, 'GNV', 8000, 3200, 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'),
  (4, 'Premium', 10000, 6800, 'a1b2c3d4-e5f6-7890-abcd-ef1234567890');
