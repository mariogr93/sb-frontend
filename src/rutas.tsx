import { createBrowserRouter, type RouteObject } from 'react-router-dom'
import { RutaProtegida } from './autenticacion/RutaProtegida'
import { Layout } from './componentes/diseno/Layout'
import { InicioSesion } from './paginas/InicioSesion/InicioSesion'
import { Pendiente } from './paginas/Pendiente'

// Placeholders: cada paso del plan reemplaza una página por la real.
const paginasParaTodos: RouteObject[] = [
  { path: '/', element: <Pendiente />, handle: { titulo: 'Inicio' } },
  { path: '/empleados', element: <Pendiente />, handle: { titulo: 'Consulta de empleados' } },
  { path: '/empleados/:id', element: <Pendiente />, handle: { titulo: 'Detalle del empleado' } },
  { path: '/reporte-semanal', element: <Pendiente />, handle: { titulo: 'Reporte semanal' } },
  { path: '/nominas', element: <Pendiente />, handle: { titulo: 'Nóminas' } },
  { path: '/nominas/:id', element: <Pendiente />, handle: { titulo: 'Detalle de nómina' } },
  { path: '/entidades-gubernamentales', element: <Pendiente />, handle: { titulo: 'Entidades gubernamentales' } },
  { path: '/departamentos', element: <Pendiente />, handle: { titulo: 'Departamentos' } },
]

const paginasSoloAdministrador: RouteObject[] = [
  { path: '/empleados/nuevo', element: <Pendiente />, handle: { titulo: 'Crear registro' } },
  { path: '/empleados/:id/editar', element: <Pendiente />, handle: { titulo: 'Editar empleado' } },
  { path: '/usuarios', element: <Pendiente />, handle: { titulo: 'Usuarios' } },
]

export const rutas: RouteObject[] = [
  { path: '/iniciar-sesion', element: <InicioSesion /> },
  {
    element: <RutaProtegida />,
    children: [
      {
        element: <Layout />,
        children: [
          ...paginasParaTodos,
          { element: <RutaProtegida soloAdministrador />, children: paginasSoloAdministrador },
        ],
      },
    ],
  },
]

export const enrutador = createBrowserRouter(rutas)
