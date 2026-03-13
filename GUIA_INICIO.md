# 🚀 Guía de Inicio Rápido - BeautyCRM

## Acceso a la Demo

### 📍 URLs Principales

1. **Landing Page:** `/` (Home pública)
2. **Login:** `/login`
3. **Dashboard:** `/dashboard`
4. **Servicios:** `/services`
5. **Empleados:** `/employees`
6. **Citas:** `/appointments`
7. **Finanzas:** `/finance`
8. **Configuración:** `/settings`
9. **Reservas Públicas:** `/reservas/salon-premium` o `/reservas/barberia-elite`

### 🔑 Credenciales Demo

Para probar el login, puedes usar cualquiera de estas:

**Salón Premium:**
- Company: `salon-premium`
- Email: `admin@salon.com`
- Password: `demo123`

**Barbería Elite:**
- Company: `barberia-elite`
- Email: `admin@barberia.com`
- Password: `demo123`

*Nota: El login es visual solo - en producción se requiere implementación backend*

## 🛠️ Instalación Local

### 1. Clonar y instalar dependencias
```bash
git clone [repo]
cd beautycRM
pnpm install
# o npm install / yarn install
```

### 2. Ejecutar desarrollo
```bash
pnpm dev
```

El app se abre en `http://localhost:3000`

### 3. Build para producción
```bash
pnpm build
pnpm start
```

## 📋 Estructura de Páginas

### Dashboard
- **Acceso:** `/dashboard`
- **Características:**
  - Resumen de estadísticas del día
  - Citas próximas
  - Servicios más vendidos
  - Gráficos (placeholder para Recharts)
  - Data table interactiva

### Servicios
- **Acceso:** `/services`
- **Características:**
  - Listar todos los servicios
  - Filtrar por categoría
  - Búsqueda por nombre
  - Crear nuevo servicio (modal)
  - Editar/eliminar (botones)
  - Estados activo/inactivo

### Empleados
- **Acceso:** `/employees`
- **Características:**
  - Vista de cards premium
  - Información de contacto
  - Porcentaje de comisión
  - Vista en tabla alternativa
  - Estados activo/inactivo

### Citas
- **Acceso:** `/appointments`
- **Características:**
  - Tabla de citas con detalles
  - Vista de calendario (placeholder)
  - Crear nueva cita
  - Estados: Pendiente, Confirmada, Completada, Cancelada, No asistió
  - Búsqueda por cliente/servicio

### Finanzas
- **Acceso:** `/finance`
- **Características:**
  - Resumen de ingresos/gastos/utilidad
  - Tabla de movimientos
  - Filtrado por tipo
  - Crear movimiento
  - Categorías de gastos

### Configuración
- **Acceso:** `/settings`
- **Características:**
  - Datos de la empresa
  - Personalización (colores, tema)
  - Configuración de reservas públicas
  - Cambio de contraseña
  - URL pública de reservas

### Página Pública de Reservas
- **Acceso:** `/reservas/[slug]`
- **Ejemplo:** `/reservas/salon-premium`
- **Flujo:**
  1. Seleccionar servicio
  2. Elegir empleado (opcional)
  3. Escoger fecha y hora
  4. Ingresar datos (nombre, email, teléfono)
  5. Confirmación final

## 🎨 Personalizaciones Visuales

### Dark Mode
- Click en el botón sol/luna en topbar
- Se guarda la preferencia
- Transiciones suaves entre temas

### Temas de Empresa
En `/settings` → Branding:
- Cambiar color principal
- Cambiar color secundario
- Seleccionar tema (claro/oscuro/automático)

## 💡 Datos Mock

Todos los datos vienen de `lib/mock-data.ts`:

```typescript
// Empresas disponibles
mockCompanies[0] → "Salón Premium"
mockCompanies[1] → "Barbería Elite"

// Datos por empresa
mockServices → 6 servicios
mockEmployees → 3 empleados
mockClients → 3 clientes
mockAppointments → 4 citas
mockTransactions → 5 movimientos
```

Para cambiar los datos, edita este archivo.

## 🔧 Customización

### Cambiar Colores
1. Edita `app/globals.css`
2. Modifica variables CSS `:root` y `.dark`
3. Los cambios se aplican automáticamente

### Cambiar Textos
- Landing: `/app/page.tsx`
- Dashboard: `/app/dashboard/page.tsx`
- Otros módulos en sus respectivos archivos

### Agregar Nuevas Páginas
1. Crea carpeta en `app/`
2. Agrega `page.tsx`
3. Actualiza sidebar en `components/sidebar.tsx`

## 📱 Responsive

Todas las páginas son totalmente responsive:
- **Mobile:** < 640px - Sidebar colapsable
- **Tablet:** 640px - 1024px - Sidebar oculto por defecto
- **Desktop:** > 1024px - Sidebar siempre visible

Prueba redimensionando el navegador o usando modo responsive del navegador.

## 🚀 Componentes Clave

### DataTable
```tsx
<DataTable
  columns={[
    { key: 'name', label: 'Nombre', width: '30%' },
    { key: 'email', label: 'Email', width: '50%' },
  ]}
  data={items}
  searchFields={['name', 'email']}
  onRowClick={(item) => console.log(item)}
/>
```

### Modal
```tsx
<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Título"
  size="lg"
>
  {/* Contenido */}
</Modal>
```

### StatusBadge
```tsx
<StatusBadge status="confirmada" />
// Soporta: pendiente, confirmada, completada, cancelada, no-asistio, activo, inactivo
```

### StatCard
```tsx
<StatCard
  label="Total"
  value="$1,234"
  icon={<DollarSign className="w-6 h-6" />}
  trend="up"
  trendPercent={12}
/>
```

## 🐛 Troubleshooting

### El app no abre en localhost:3000
- Verifica que el puerto 3000 no esté en uso
- Intenta `pnpm dev -- -p 3001`

### Los estilos no se aplican
- Ejecuta `pnpm install` nuevamente
- Limpia caché: elimina carpeta `.next`

### Dark mode no funciona
- Verifica que `next-themes` esté instalado
- Recarga la página

### Las imágenes no cargan
- Los iconos usan Lucide React
- Para imagenes reales, reemplaza con `<Image />` de Next.js

## 📚 Documentación Adicional

- **ARQUITECTURA.md** - Estructura del proyecto
- **FEATURES.md** - Características detalladas
- **tailwind.config.ts** - Configuración de Tailwind
- **lib/mock-data.ts** - Datos de ejemplo

## 🎓 Próximos Pasos

1. **Implementar API** - Reemplazar mock data con endpoints reales
2. **Agregar autenticación** - Implementar login real con Auth.js
3. **Conectar base de datos** - Usar Supabase, Prisma, etc.
4. **Agregar validación** - React Hook Form + Zod
5. **Integrar gráficos** - Recharts para Dashboard
6. **Implementar calendario** - React Calendar para citas
7. **Enviar emails** - Confirmaciones y recordatorios
8. **Sistema de pagos** - Stripe para suscripciones

## 🆘 Soporte

Si tienes preguntas:
1. Revisa ARQUITECTURA.md y FEATURES.md
2. Verifica los componentes en `/components`
3. Busca ejemplos en las páginas ya implementadas
4. Consulta documentación de Next.js, React, Tailwind

---

**¡Listo para empezar!** 🚀
