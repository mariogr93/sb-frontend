# SB Frontend

Cliente web de [SB.SistemaNomina](https://github.com/mariogr93/sb-backend-api) (API .NET 8): gestión de empleados, cálculo y reporte de pagos semanales, nóminas guardadas, entidades gubernamentales, departamentos y usuarios.

## Tecnologías

React 19 + TypeScript (estricto) + Vite · React Router 7 · TanStack Query 5 · React Hook Form + Zod · Axios. Pruebas: Vitest + Testing Library.

## Requisitos

- Node.js 22.22.2 o superior (o 24). Node 20 no sirve: Vitest 5 y jsdom 30 no lo soportan.
- La API en ejecución. Desde el repositorio [`sb-backend-api`](https://github.com/mariogr93/sb-backend-api):

  ```bash
  dotnet run --project src/SB.SistemaNomina.API --launch-profile http
  ```

  Queda en `http://localhost:5297` (Swagger en `/swagger`). Para tener datos de ejemplo, agregue `-- --DatosIniciales:IncluirEmpleadosDemostracion=true`.

## Ejecución

```bash
cp .env.example .env
npm install
npm run dev
```

Abra http://localhost:5173 (origen permitido por el CORS de la API).

| Variable (`.env`) | Descripción |
|---|---|
| `VITE_URL_API` | URL base de la API. Por defecto `http://localhost:5297/api`. No es un secreto; `.env` no se versiona. |

## Usuarios de prueba

Los crea la API al arrancar en desarrollo; las contraseñas están en `src/SB.SistemaNomina.API/appsettings.Development.json` del repositorio del backend.

| Usuario | Rol | Puede |
|---|---|---|
| `admin` | Admin | Todo: crear, editar y desactivar empleados, departamentos, entidades y usuarios; guardar nóminas. |
| `consulta` | Usuario | Solo lectura: consulta, filtros y reportes. Ve la cédula enmascarada (`***-****567-1`). |

## Pantallas

| Menú | Ruta | Contenido |
|---|---|---|
| Inicio | `/` | Empleados activos, pago semanal total y totales por tipo. |
| Consulta | `/empleados` | Lista con filtros (nombre, departamento, estado, tipo), paginación, pago semanal, ver, editar y desactivar. |
| Crear registro (Admin) | `/empleados/nuevo` | Formulario cuyos campos cambian según el tipo: asalariado, por horas, por comisión o asalariado por comisión. |
| — | `/empleados/:id` | Datos del empleado y desglose del cálculo de su pago. |
| Reporte semanal | `/reporte-semanal` | Pago de cada empleado activo con su desglose, totales por tipo, filtro por departamento e impresión. |
| Nóminas | `/nominas` | Guardar la nómina de una semana (Admin, una por semana), historial y detalle. |
| Entidades gubernamentales | `/entidades-gubernamentales` | Las 181 entidades: filtros, paginación y mantenimiento (Admin). |
| Departamentos | `/departamentos` | Catálogo y mantenimiento (Admin). |
| Usuarios (Admin) | `/usuarios` | Crear, editar, cambiar contraseña y desactivar. |

Diseño según la maqueta: barra lateral azul `rgba(13, 48, 72, .9)`, área gris `rgba(237, 240, 247)`, tarjeta blanca redondeada, logo y icono de inicio de la Superintendencia de Bancos. En pantallas menores a 768 px la barra lateral es un menú deslizable.

## Estructura

```
src/
├── api/             Módulos HTTP (uno por recurso), cliente axios y manejo de errores
├── autenticacion/   Sesión, proveedor, guarda de rutas por rol
├── componentes/     diseno/ (layout, barra lateral) y comunes/ (tabla, paginación, modal, campos)
├── paginas/         Una carpeta por área; cada una con sus consultas (TanStack Query) y formularios
├── tipos/           Tipos que reflejan los contratos de la API
├── utilidades/      Formato de moneda y fechas, validaciones compartidas
└── pruebas/         Utilidades de prueba (proveedores, datos, APIs simuladas)
```

Flujo: página → hook de consulta (`consultas*.ts`) → módulo `api/*` → `clienteHttp`. Los componentes nunca llaman a axios directamente. El pago semanal lo calcula la API; el cliente solo lo muestra.

## Seguridad en el cliente

- El token JWT se guarda en `sessionStorage` (termina al cerrar la pestaña) y se envía solo a la API.
- Un 401 en una solicitud protegida, o el vencimiento del token, cierra la sesión y lleva al inicio de sesión.
- Las guardas y el menú por rol son solo comodidad: la API aplica los permisos en cada solicitud.
- Los errores del servidor (400 por campo, 409, 422, 429) se muestran en español junto al campo o en una alerta.

## Pruebas

```bash
npm test
```

95 pruebas: formularios (campos por tipo, límites, errores del servidor bajo el campo correcto, creación y edición con carga exacta), consulta (filtros, paginación, desactivación con confirmación), guardas por rol, sesión (vencimiento, cierre, interceptor 401), nóminas, departamentos, usuarios, formato de moneda y fechas. Las APIs se simulan en el límite de `src/api/*`; las fechas se prueban en la zona de la República Dominicana.

## Scripts

| Comando | Acción |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Compilación de producción (`dist/`) |
| `npm run lint` | ESLint |
| `npm test` | Pruebas (Vitest) |

## Supuestos

- La identificación del empleado es la cédula dominicana (`###-#######-#`), no el número de seguro social del enunciado.
- Los límites de validación del cliente (nombres, montos, horas, tarifa, decimales, contraseñas) copian los del servidor, que valida de nuevo.
- Tipo de empleado nuevo: se agrega a `TIPOS_EMPLEADO`, `CAMPOS_POR_TIPO` y las etiquetas de `src/tipos/empleados.ts`, junto con su subclase en la API.
