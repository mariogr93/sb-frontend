import { act, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { crearClienteDePrueba, renderizarConProveedores } from '../pruebas/utilidades'
import { almacenSesion } from './almacenSesion'
import { useAutenticacion } from './useAutenticacion'

function Estado() {
  const { sesion, cerrarSesion } = useAutenticacion()
  return (
    <div>
      <p>{sesion ? 'sesion-activa' : 'sin-sesion'}</p>
      <button type="button" onClick={cerrarSesion}>
        Salir
      </button>
    </div>
  )
}

afterEach(() => {
  vi.useRealTimers()
})

test('LaSesionSeCierraSolaAlVencerElToken', () => {
  vi.useFakeTimers()
  renderizarConProveedores(<Estado />, { rol: 'Admin', vigenciaMilisegundos: 60_000 })
  expect(screen.getByText('sesion-activa')).toBeInTheDocument()

  act(() => {
    vi.advanceTimersByTime(59_000)
  })
  expect(screen.getByText('sesion-activa')).toBeInTheDocument()

  act(() => {
    vi.advanceTimersByTime(2_000)
  })
  expect(screen.getByText('sin-sesion')).toBeInTheDocument()
  expect(almacenSesion.leer()).toBeNull()
})

test('CerrarSesionBorraElAlmacenYLaCacheDeConsultas', async () => {
  const cliente = crearClienteDePrueba()
  cliente.setQueryData(['empleados'], { dato: 1 })
  renderizarConProveedores(<Estado />, { rol: 'Admin', cliente })

  await userEvent.click(screen.getByRole('button', { name: 'Salir' }))

  expect(screen.getByText('sin-sesion')).toBeInTheDocument()
  expect(almacenSesion.leer()).toBeNull()
  expect(cliente.getQueryData(['empleados'])).toBeUndefined()
})

test('SesionVencidaGuardadaNoSeRestaura', () => {
  renderizarConProveedores(<Estado />, { rol: 'Admin', vigenciaMilisegundos: -1000 })

  expect(screen.getByText('sin-sesion')).toBeInTheDocument()
})

test('AlmacenConDatosCorruptosEquivaleASinSesion', () => {
  sessionStorage.setItem('sb-sesion', '{no es json')

  expect(almacenSesion.leer()).toBeNull()
})
