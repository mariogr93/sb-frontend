import { screen } from '@testing-library/react'
import { vi } from 'vitest'
import { rutas } from '../rutas'
import { renderizarRutas } from '../pruebas/utilidades'
import { simularApisVacias } from '../pruebas/simularApis'

vi.mock('../api/departamentosApi', () => ({ departamentosApi: { listar: vi.fn() } }))
vi.mock('../api/empleadosApi', () => ({ empleadosApi: { listar: vi.fn() } }))
vi.mock('../api/entidadesApi', () => ({ entidadesApi: { listar: vi.fn() } }))
vi.mock('../api/nominasApi', () => ({ nominasApi: { reporteSemanal: vi.fn(), listar: vi.fn() } }))
vi.mock('../api/usuariosApi', () => ({ usuariosApi: { listar: vi.fn() } }))

beforeEach(simularApisVacias)

test('SinSesionRedirigeAlInicioDeSesion', () => {
  const enrutador = renderizarRutas(rutas, { ruta: '/empleados' })

  expect(enrutador.state.location.pathname).toBe('/iniciar-sesion')
  expect(screen.getByRole('heading', { name: 'Iniciar sesión' })).toBeInTheDocument()
})

test('UsuarioEnRutaDeAdministradorVuelveAlInicio', async () => {
  const enrutador = renderizarRutas(rutas, { rol: 'Usuario', ruta: '/usuarios' })

  expect(enrutador.state.location.pathname).toBe('/')
  expect(await screen.findByText('Empleados activos')).toBeInTheDocument()
})

test('AdministradorEntraARutaDeAdministrador', async () => {
  const enrutador = renderizarRutas(rutas, { rol: 'Admin', ruta: '/usuarios' })

  expect(enrutador.state.location.pathname).toBe('/usuarios')
  expect(await screen.findByRole('button', { name: 'Nuevo usuario' })).toBeInTheDocument()
})
