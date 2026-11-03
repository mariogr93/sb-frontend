import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render } from '@testing-library/react'
import type { ReactElement, ReactNode } from 'react'
import { MemoryRouter, RouterProvider, createMemoryRouter, type RouteObject } from 'react-router-dom'
import { almacenSesion } from '../autenticacion/almacenSesion'
import { ProveedorAutenticacion } from '../autenticacion/ProveedorAutenticacion'
import type { Rol } from '../tipos/usuarios'

const UNA_HORA_EN_MILISEGUNDOS = 60 * 60 * 1000

function sembrarSesion(rol: Rol) {
  almacenSesion.guardar({
    token: 'token-de-prueba',
    fechaExpiracion: new Date(Date.now() + UNA_HORA_EN_MILISEGUNDOS).toISOString(),
    nombreUsuario: rol === 'Admin' ? 'admin' : 'consulta',
    nombreCompleto: rol === 'Admin' ? 'Administrador' : 'Usuario de consulta',
    rol,
  })
}

type Opciones = { rol?: Rol; ruta?: string }

function envolver(hijos: ReactNode) {
  const cliente = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return (
    <QueryClientProvider client={cliente}>
      <ProveedorAutenticacion>{hijos}</ProveedorAutenticacion>
    </QueryClientProvider>
  )
}

/** Renderiza un componente con consultas, sesión (si se indica `rol`) y router en memoria. */
export function renderizarConProveedores(ui: ReactElement, { rol, ruta = '/' }: Opciones = {}) {
  if (rol) sembrarSesion(rol)
  return render(envolver(<MemoryRouter initialEntries={[ruta]}>{ui}</MemoryRouter>))
}

/** Renderiza una tabla de rutas completa (guardas, layout) en memoria. */
export function renderizarRutas(rutas: RouteObject[], { rol, ruta = '/' }: Opciones = {}) {
  if (rol) sembrarSesion(rol)
  const enrutador = createMemoryRouter(rutas, { initialEntries: [ruta] })
  render(envolver(<RouterProvider router={enrutador} />))
  return enrutador
}
