import { createBrowserRouter, type RouteObject } from 'react-router-dom'
import { Layout } from './componentes/diseno/Layout'
import { Pendiente } from './paginas/Pendiente'

// Placeholders: cada paso del plan reemplaza una página por la real.
const paginasLayout: RouteObject[] = [
  { path: '/', element: <Pendiente />, handle: { titulo: 'Inicio' } },
  { path: '/empleados', element: <Pendiente />, handle: { titulo: 'Consulta de empleados' } },
  { path: '/empleados/nuevo', element: <Pendiente />, handle: { titulo: 'Crear registro' } },
  { path: '/empleados/:id', element: <Pendiente />, handle: { titulo: 'Detalle del empleado' } },
  { path: '/empleados/:id/editar', element: <Pendiente />, handle: { titulo: 'Editar empleado' } },
  { path: '/reporte-semanal', element: <Pendiente />, handle: { titulo: 'Reporte semanal' } },
  { path: '/nominas', element: <Pendiente />, handle: { titulo: 'Nóminas' } },
  { path: '/nominas/:id', element: <Pendiente />, handle: { titulo: 'Detalle de nómina' } },
  { path: '/entidades-gubernamentales', element: <Pendiente />, handle: { titulo: 'Entidades gubernamentales' } },
  { path: '/departamentos', element: <Pendiente />, handle: { titulo: 'Departamentos' } },
  { path: '/usuarios', element: <Pendiente />, handle: { titulo: 'Usuarios' } },
]

export const rutas: RouteObject[] = [{ element: <Layout />, children: paginasLayout }]

export const enrutador = createBrowserRouter(rutas)
