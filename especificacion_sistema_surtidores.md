# Especificación de Requerimientos: Sistema de Gestión de Combustible para Estaciones de Servicio (Surtidores)

Este documento contiene las especificaciones detalladas para la creación del sistema de gestión de combustible. El agente de desarrollo debe seguir rigurosamente el stack tecnológico, la arquitectura, los patrones de diseño y las pautas visuales de Figma aquí indicados.

## 🚀 Stack Tecnológico Obligatorio
*   **Framework Fullstack:** Next.js (App Router, TypeScript)
*   **Base de Datos:** Supabase (PostgreSQL)
*   **ORM / Conector:** Drizzle ORM o Prisma
*   **Despliegue:** Vercel (Optimizado para Serverless y Edge Functions)
*   **Testing / Calidad:** Vitest o Jest, preparado para integración con SonarQube

---

## 🎨 Diseño de Interfaz y UI (Figma)
El agente de desarrollo debe replicar fielmente la experiencia de usuario, distribución de componentes, paleta de colores y flujos establecidos en el prototipo de UI.

*   **Enlace Oficial del Prototipo:** https://www.figma.com/make/P8pLJqqrx7amaaoDQWuyM9/Sistema-web-para-surtidor?t=v8k2GLlkeSlaN5ma-1
*   **Instrucción de Maquetación:** Se deben inspeccionar los componentes de este archivo de Figma para extraer la disposición del Dashboard, Gestión de Surtidores, Registro de Ventas, Panel de Alertas y Reportes. En caso de que se proporcionen screenshots complementarios en el prompt, utilizarlos a través de capacidades de visión artificial (VLM) para asegurar la máxima precisión visual de los componentes en la interfaz final basada en Tailwind CSS u otra librería estilizada.

---

## 📐 Patrones de Diseño a Implementar (Obligatorio)

1.  **Patrón Creacional (Factory):** Implementar una fábrica de Surtidores (`PumpFactory`) para instanciar dinámicamente objetos de tipo surtidor según el tipo de combustible (Gasolina Especial, Diésel, GNV, Premium) y validar sus capacidades y niveles mínimos de seguridad de forma centralizada.
2.  **Patrón Estructural (Adapter):** Crear una interfaz genérica `DatabaseAdapter` que aísle la lógica de negocio de la persistencia directa de Supabase. Toda consulta o mutación de datos de Ventas, Alertas o Surtidores debe realizarse a través del Adapter.
3.  **Patrón de Comportamiento (Observer):** Diseñar un sistema de notificaciones/alertas reactivo. El dashboard principal debe actuar como un observador suscrito a los cambios de estado de los surtidores (ej. niveles críticos). Integrar esto con el mecanismo **Realtime de Supabase** para suscripciones en tiempo real.

---

## 🗄️ Diseño del Modelo Relacional (Base de Datos en Supabase)

El sistema debe soportar un modelo multi-sucursal y control de acceso basado en roles (RBAC). A continuación, se detalla el script SQL estructurado para ejecutar en el editor de Supabase.

```sql
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

---

## 🛠️ Reglas de Negocio Específicas para Desarrollo

### Aritmética Binaria en Ventas
El campo `metadata_binaria` de la tabla `ventas` se utilizará para almacenar banderas (*flags*) empaquetadas mediante operaciones a nivel de bits (Bitwise). El agente de desarrollo debe definir una enumeración o máscara binaria para procesar estos datos en los reportes:
*   `0x01` (Bit 0): Venta Facturada (Sí/No)
*   `0x02` (Bit 1): Método de pago (0: Efectivo, 1: Tarjeta/Digital)
*   `0x04` (Bit 2): Subsidio Estatal Aplicado (Sí/No)
*   `0x08` (Bit 3): Cliente Institucional / Flota (Sí/No)

### Decodificadores para Reportes
El sistema debe implementar módulos de decodificación eficientes que realicen operaciones lógicas (`AND`, `OR`, `SHIFT`) sobre el campo `metadata_binaria` para renderizar filtros avanzados en el panel de reportes sin sobrecargar la base de datos con múltiples columnas booleanas.

---

## 📁 Estructura del Proyecto Sugerida (Arquitectura Limpia / MVC Adaptado a Next.js)

```text
src/
├── app/                  # App Router de Next.js (Controladores y Vistas)
│   ├── (auth)/           # Rutas de autenticación
│   ├── dashboard/        # Pantalla principal (Métricas generales)
│   ├── surtidores/       # Gestión de surtidores
│   ├── ventas/           # Registro y control de ventas
│   └── alertas/          # Panel de alertas en tiempo real
├── components/           # Componentes UI reutilizables
├── core/                 # Lógica de Negocio Pura (Modelos y Patrones)
│   ├── factories/        # PumpFactory e implementaciones
│   ├── adapters/         # DatabaseAdapter e implementación Supabase
│   └── observers/        # Estructura del patrón Observer para alertas
├── lib/                  # Inicialización de clientes (Supabase, Drizzle)
└── types/                # Definición de tipos globales e interfaces de TypeScript
```

## 📋 Instrucciones para el Agente Antigravity
1.  Generar el scaffolding completo del proyecto utilizando Next.js 14+ con TypeScript.
2.  Configurar la conexión con Supabase e implementar el esquema SQL provisto.
3.  Desarrollar el core lógico con los tres patrones de diseño estipulados de forma explícita en código TypeScript.
4.  Crear la interfaz de usuario moderna (Dashboard con gráficos, CRUD de Ventas y Surtidores, Panel de Alertas en Tiempo Real).
5.  Garantizar que toda la lógica de backend sea compatible con el despliegue Serverless en Vercel.
