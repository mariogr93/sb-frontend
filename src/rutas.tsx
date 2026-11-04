import { createBrowserRouter, type RouteObject } from 'react-router-dom'
import { RutaProtegida } from './autenticacion/RutaProtegida'
import { Layout } from './componentes/diseno/Layout'
import { Departamentos } from './paginas/Departamentos/Departamentos'
import { ConsultaEmpleados } from './paginas/Empleados/ConsultaEmpleados'
import { DetalleEmpleado } from './paginas/Empleados/DetalleEmpleado'
import { FormularioEmpleado } from './paginas/Empleados/FormularioEmpleado'
import { EntidadesGubernamentales } from './paginas/EntidadesGubernamentales/EntidadesGubernamentales'
import { ErrorInesperado } from './paginas/ErrorInesperado'
import { Inicio } from './paginas/Inicio/Inicio'
import { InicioSesion } from './paginas/InicioSesion/InicioSesion'
import { NoEncontrado } from './paginas/NoEncontrado'
import { DetalleNomina } from './paginas/Nominas/DetalleNomina'
import { Nominas } from './paginas/Nominas/Nominas'
import { ReporteSemanal } from './paginas/Nominas/ReporteSemanal'
import { Usuarios } from './paginas/Usuarios/Usuarios'

const paginasParaTodos: RouteObject[] = [
  { path: '/', element: <Inicio />, handle: { titulo: 'Inicio' } },
  { path: '/empleados', element: <ConsultaEmpleados />, handle: { titulo: 'Consulta de empleados' } },
  { path: '/empleados/:id', element: <DetalleEmpleado />, handle: { titulo: 'Detalle del empleado' } },
  { path: '/reporte-semanal', element: <ReporteSemanal />, handle: { titulo: 'Reporte semanal' } },
  { path: '/nominas', element: <Nominas />, handle: { titulo: 'Nóminas' } },
  { path: '/nominas/:id', element: <DetalleNomina />, handle: { titulo: 'Detalle de nómina' } },
  { path: '/entidades-gubernamentales', element: <EntidadesGubernamentales />, handle: { titulo: 'Entidades gubernamentales' } },
  { path: '/departamentos', element: <Departamentos />, handle: { titulo: 'Departamentos' } },
]

const paginasSoloAdministrador: RouteObject[] = [
  { path: '/empleados/nuevo', element: <FormularioEmpleado />, handle: { titulo: 'Crear registro' } },
  { path: '/empleados/:id/editar', element: <FormularioEmpleado />, handle: { titulo: 'Editar empleado' } },
  { path: '/usuarios', element: <Usuarios />, handle: { titulo: 'Usuarios' } },
]

export const rutas: RouteObject[] = [
  { path: '/iniciar-sesion', element: <InicioSesion />, errorElement: <ErrorInesperado /> },
  {
    element: <RutaProtegida />,
    errorElement: <ErrorInesperado />,
    children: [
      {
        element: <Layout />,
        children: [
          ...paginasParaTodos,
          { element: <RutaProtegida soloAdministrador />, children: paginasSoloAdministrador },
          { path: '*', element: <NoEncontrado />, handle: { titulo: 'Página no encontrada' } },
        ],
      },
    ],
  },
]

export const enrutador = createBrowserRouter(rutas)
