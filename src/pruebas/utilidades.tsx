import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render } from '@testing-library/react'
import type { ReactElement, ReactNode } from 'react'
import { MemoryRouter, RouterProvider, createMemoryRouter, type RouteObject } from 'react-router-dom'
import { almacenSesion } from '../autenticacion/almacenSesion'
import { ProveedorAutenticacion } from '../autenticacion/ProveedorAutenticacion'
import type { Rol } from '../tipos/usuarios'

const UNA_HORA_EN_MILISEGUNDOS = 60 * 60 * 1000

export function sembrarSesion(rol: Rol, vigenciaMilisegundos = UNA_HORA_EN_MILISEGUNDOS) {
  almacenSesion.guardar({
    token: 'token-de-prueba',
    fechaExpiracion: new Date(Date.now() + vigenciaMilisegundos).toISOString(),
    nombreUsuario: rol === 'Admin' ? 'admin' : 'consulta',
    nombreCompleto: rol === 'Admin' ? 'Administrador' : 'Usuario de consulta',
    rol,
  })
}

type Opciones = { rol?: Rol; ruta?: string; cliente?: QueryClient; vigenciaMilisegundos?: number }

export const crearClienteDePrueba = () => new QueryClient({ defaultOptions: { queries: { retry: false } } })

function envolver(hijos: ReactNode, cliente: QueryClient) {
  return (
    <QueryClientProvider client={cliente}>
      <ProveedorAutenticacion>{hijos}</ProveedorAutenticacion>
    </QueryClientProvider>
  )
}

/** Renderiza un componente con consultas, sesión (si se indica `rol`) y router en memoria. */
export function renderizarConProveedores(
  ui: ReactElement,
  { rol, ruta = '/', cliente = crearClienteDePrueba(), vigenciaMilisegundos }: Opciones = {},
) {
  if (rol) sembrarSesion(rol, vigenciaMilisegundos)
  return render(envolver(<MemoryRouter initialEntries={[ruta]}>{ui}</MemoryRouter>, cliente))
}

/** Renderiza una tabla de rutas completa (guardas, layout) en memoria. */
export function renderizarRutas(
  rutas: RouteObject[],
  { rol, ruta = '/', cliente = crearClienteDePrueba(), vigenciaMilisegundos }: Opciones = {},
) {
  if (rol) sembrarSesion(rol, vigenciaMilisegundos)
  const enrutador = createMemoryRouter(rutas, { initialEntries: [ruta] })
  render(envolver(<RouterProvider router={enrutador} />, cliente))
  return enrutador
}
