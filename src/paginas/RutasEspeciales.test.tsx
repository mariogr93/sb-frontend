import { screen } from '@testing-library/react'
import { vi } from 'vitest'
import { rutas } from '../rutas'
import { renderizarRutas } from '../pruebas/utilidades'
import { ErrorInesperado } from './ErrorInesperado'

test('UnaUrlQueNoExisteMuestraPaginaNoEncontradaDentroDelLayout', async () => {
  renderizarRutas(rutas, { rol: 'Usuario', ruta: '/no-existe' })

  expect(await screen.findByRole('heading', { name: 'Página no encontrada' })).toBeInTheDocument()
  expect(screen.getByRole('link', { name: 'Volver al inicio' })).toHaveAttribute('href', '/')
  expect(screen.getByRole('link', { name: 'Consulta' })).toBeInTheDocument()
})

test('UnaUrlQueNoExisteSinSesionLlevaAlLogin', () => {
  const enrutador = renderizarRutas(rutas, { ruta: '/no-existe' })

  expect(enrutador.state.location.pathname).toBe('/iniciar-sesion')
})

test('UnErrorDeRenderizadoMuestraLaPantallaEnEspanolEnLugarDeLaDelRouter', () => {
  vi.spyOn(console, 'error').mockImplementation(() => {})
  const Bomba = () => {
    throw new Error('fallo de renderizado')
  }

  renderizarRutas([{ path: '/', element: <Bomba />, errorElement: <ErrorInesperado /> }], { rol: 'Admin' })

  expect(screen.getByRole('heading', { name: 'Ocurrió un error inesperado' })).toBeInTheDocument()
  expect(screen.getByRole('link', { name: 'Ir al inicio' })).toBeInTheDocument()
})
