# BeautyCRM - Arquitectura y Estructura

## 🏗️ Estructura del Proyecto

```
app/
├── layout.tsx              # Layout raíz con tema y providers
├── globals.css            # Variables de diseño y estilos globales
├── page.tsx               # Landing page
├── login/
│   └── page.tsx          # Página de login multiempresa
├── dashboard/
│   └── page.tsx          # Dashboard principal
├── services/
│   └── page.tsx          # Gestión de servicios
├── employees/
│   └── page.tsx          # Gestión de empleados
├── appointments/
│   └── page.tsx          # Gestión de citas
├── finance/
│   └── page.tsx          # Módulo financiero
├── settings/
│   └── page.tsx          # Configuración de empresa
└── reservas/
    └── [slug]/page.tsx   # Página pública de reservas

components/
├── sidebar.tsx           # Navegación lateral
├── topbar.tsx            # Barra superior
├── stat-card.tsx         # Card de estadísticas
├── page-header.tsx       # Header con título y acciones
├── data-table.tsx        # Tabla reutilizable con búsqueda y sort
├── status-badge.tsx      # Badge de estados
├── modal.tsx             # Modal reutilizable
├── theme-provider.tsx    # Proveedor de tema
└── ui/                   # Componentes shadcn/ui

lib/
├── utils.ts             # Utilidades (cn para clases)
└── mock-data.ts         # Datos de ejemplo para desarrollo

tailwind.config.ts        # Configuración de Tailwind
```

## 🎨 Diseño Visual Premium

### Paleta de colores
- **Primary:** Indigo-600 (#4F46E5) - Acciones principales
- **Neutrals:** Slate 50-950 - Backgrounds y bordes
- **Success:** Green-600 - Estados positivos
- **Warning:** Yellow-600 - Estados pendientes
- **Error:** Red-600 - Estados negativos

### Componentes visuales
- **Cards:** Bordes sutiles, sombras suaves, hover elegante
- **Tablas:** Headers destacados, filas con hover, dividers claros
- **Formularios:** Campos con bordes sutiles, labels claros
- **Modales:** Backdrop oscuro, animaciones suaves
- **Badaes:** Colores contextuales con backgrounds sutiles

## 📊 Módulos Principales

### 1. Dashboard
- Estadísticas de hoy (citas, ingresos, empleados)
- Gráficos de ingresos (placeholder para Recharts)
- Servicios más vendidos
- Próximas citas

### 2. Servicios
- CRUD completo de servicios
- Filtrado por categoría
- Búsqueda por nombre/descripción
- Estados activo/inactivo

### 3. Empleados
- Vista en tarjetas (cards premium)
- Vista en tabla con resumen
- Información completa (email, teléfono, comisión)
- Estados activo/inactivo

### 4. Citas
- Tabla de citas
- Vista de calendario (placeholder)
- Creación de citas manuales
- Estados: Pendiente, Confirmada, Completada, Cancelada, No asistió

### 5. Finanzas
- Estadísticas de ingresos y gastos
- Tabla de movimientos
- Filtrado por tipo de transacción
- Gráficos comparativos (placeholder)

### 6. Configuración
- Datos de empresa
- Branding (colores, tema)
- Página pública de reservas
- Seguridad de cuenta

## 🔑 Características Clave

### Multiempresa (SaaS)
- Login con ID de compañía
- Aislamiento de datos por company_id
- URL pública única por empresa (/reservas/[slug])

### Interface Premium
- Sidebar colapsable con navegación clara
- Topbar con tema e iconos
- Modales elegantes para crear/editar
- Tablas con búsqueda, ordenamiento y paginación
- Cards con estadísticas visuales

### Responsive Design
- Diseño mobile-first
- Breakpoints: sm, md, lg
- Sidebar colapsable en mobile
- Tablas adaptables

### Dark Mode
- Soporte completo para dark mode
- Variables de color consistentes
- Transiciones suaves entre temas

## 🛠️ Tecnologías

- **Framework:** Next.js 16 con App Router
- **UI:** React 19
- **Estilos:** Tailwind CSS puro (sin CSS global personalizado)
- **Componentes:** shadcn/ui
- **Datos:** Mock data para desarrollo
- **Tema:** next-themes para dark mode

## 📱 Datos Mock

El archivo `lib/mock-data.ts` contiene:
- `mockCompanies` - 2 empresas ejemplo (Salón Premium, Barbería Elite)
- `mockServices` - 6 servicios
- `mockEmployees` - 3 empleados
- `mockClients` - 3 clientes
- `mockAppointments` - 4 citas
- `mockTransactions` - 5 movimientos financieros
- `mockUsers` - 3 usuarios

## 🚀 Próximos Pasos

1. **Backend:** Implementar API con base de datos
2. **Autenticación:** Sistema real de auth
3. **Gráficos:** Integrar Recharts para Dashboard y Finanzas
4. **Calendario:** Implementar React Calendar para citas
5. **Email:** Confirmaciones y recordatorios automáticos
6. **Pagos:** Integración con sistema de suscripción

## 📝 Notas de Desarrollo

- Todos los estilos usan Tailwind puro
- No hay CSS global personalizado
- Variables de color definidas en globals.css
- Componentes reutilizables y bien separados
- Data binding con componentes mock (reemplazar con API real)
- Modal y DataTable son componentes genéricos reutilizables
