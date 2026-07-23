# ⛽ Sistema de Gestión de Combustible - Dally SRL

Este es un sistema fullstack moderno desarrollado con **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS v4** y **Supabase** (PostgreSQL + Auth), diseñado para la gestión y monitoreo en tiempo real de estaciones de servicio.

## 🚀 Guía Rápida de Uso

### 1. Requisitos Previos
- Node.js 18+ y npm
- Una cuenta y proyecto en [Supabase](https://supabase.com)

### 2. Configuración
1. Clona el repositorio e instala las dependencias:
   ```bash
   cd surtidor-dally
   npm install
   ```
2. Configura las variables de entorno. Crea un archivo `.env` basado en `.env.example`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=tu_anon_key_de_supabase
   ```
3. Ejecuta los scripts SQL ubicados en la carpeta `prisma/` en el SQL Editor de tu proyecto de Supabase:
   - Primero ejecuta `prisma/schema.sql` para crear las tablas.
   - Luego ejecuta `prisma/seed.sql` para cargar los datos de prueba.

### 3. Ejecución
Para iniciar el servidor de desarrollo:
```bash
npm run dev
```
Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

### 4. Navegación
- **Landing Page (`/`)**: Información general de la empresa, métricas estáticas y servicios.
- **Login (`/login`)**: Autenticación integrada con Supabase Auth. Puedes probar registrando un usuario en Supabase o configurando credenciales de prueba (ej: `admin@dallysrl.bo`).
- **Dashboard (`/dashboard`)**: Panel principal operativo (requiere autenticación o mock temporal). Muestra KPIs en tiempo real, gráficos de ventas (área y dona), decodificación binaria de metadata y estado de operadores.

---

## 🏗️ Estructura del Proyecto

El proyecto sigue una arquitectura limpia orientada a componentes y Serverless APIs:

```text
surtidor-dally/
├── src/
│   ├── app/                    # Next.js App Router (Páginas y APIs)
│   │   ├── (auth)/login/       # Página de Login
│   │   ├── api/                # Endpoints Serverless (alertas, dashboard, surtidores, ventas)
│   │   ├── dashboard/          # Panel principal operativo
│   │   ├── globals.css         # Configuración y tokens de Tailwind CSS v4
│   │   ├── layout.tsx          # Root Layout (Fuentes, Metadata, Tema)
│   │   └── page.tsx            # Landing Page
│   ├── components/             # Componentes React reutilizables (UI y Dashboard)
│   ├── core/                   # Lógica de negocio core y Patrones de Diseño
│   │   ├── adapters/           # Patrón Adapter (Conexión a BD)
│   │   ├── factories/          # Patrón Factory (Creación de Surtidores)
│   │   ├── observers/          # Patrón Observer (Sistema de Alertas)
│   │   └── utils/              # Utilidades (Aritmética Binaria)
│   ├── lib/                    # Configuración de librerías externas (Supabase Client)
│   └── types/                  # Definiciones de TypeScript e Interfaces globales
├── prisma/                     # Scripts SQL para Supabase (schema y seed)
├── public/                     # Assets estáticos e iconos
└── tailwind.config.ts / css    # Configuración de estilos y colores
```

---

## 🧩 Patrones de Diseño Implementados

Este sistema hace uso extensivo de patrones de diseño clásicos (GoF) para garantizar escalabilidad y mantenimiento:

### 1. Factory Pattern (Creacional)
Ubicado en `src/core/factories/PumpFactory.ts`. Centraliza la lógica de creación y validación de los distintos tipos de surtidores (`GasolinaEspecialPump`, `DieselPump`, etc.). Asegura que las capacidades máximas y reglas de negocio específicas de cada combustible se respeten antes de interactuar con la base de datos.

### 2. Adapter Pattern (Estructural)
Ubicado en `src/core/adapters/DatabaseAdapter.ts`. Define una interfaz común (`IDatabaseAdapter`) que aísla toda la lógica de negocio de la implementación específica de Supabase. Esto permite que el sistema pueda cambiar de proveedor de base de datos en el futuro sin modificar los controladores o la UI. Actualmente implementa el `SupabaseDatabaseAdapter` para consultas SQL reales.

### 3. Observer Pattern (Comportamiento)
Ubicado en `src/core/observers/AlertObserver.ts`. Implementa un sistema reactivo donde un sujeto (`PumpMonitor`) vigila los niveles de combustible de los surtidores. Cuando un nivel cae por debajo de los umbrales seguros definidos en el Factory, notifica automáticamente a los observadores registrados (ej: `DashboardObserver`) para despachar alertas.

---

## ⚙️ Aritmética Binaria (Metadata de Ventas)

Para optimizar el almacenamiento y permitir filtros avanzados rápidos, características específicas de cada venta se almacenan usando **lógica de bits** en un solo campo numérico (`metadata_binaria`).

Ubicado en `src/core/utils/binaryMetadata.ts`.

| Bit | Máscara | Propiedad | Descripción |
| :---: | :---: | :--- | :--- |
| **0** | `0x01` | `Facturada` | Indica si la venta generó factura fiscal. |
| **1** | `0x02` | `Pago Digital` | Indica si el pago fue por QR, Tarjeta, etc. |
| **2** | `0x04` | `Subsidio Estatal`| Aplica para ciertos combustibles regulados. |
| **3** | `0x08` | `Cliente Flota` | Indica si la venta pertenece a una cuenta corporativa. |

**Operaciones utilizadas:**
- `OR` (`|`) y Desplazamiento (`<<`) para codificar.
- `AND` (`&`) para verificar la existencia de un flag.
- El Dashboard (Pestaña "Reportes") incluye un decodificador visual en tiempo real de estas transacciones.

---

## 🎨 Diseño y UI (Tailwind v4)

La interfaz fue construida siguiendo un diseño en Figma para un look moderno e industrial (Dark Mode nativo).
- **Fondo Primario:** `#0D0D0D` (Negro profundo)
- **Acento Primario:** `#F5C518` (Amarillo señalización)
- **Acentos Secundarios:** Cian y Naranja para gráficos y estados.
- Se utiliza la fuente **Inter** para garantizar legibilidad técnica.
- Gráficos renderizados con **Recharts**.
