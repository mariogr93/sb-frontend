import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { rutas } from '../../rutas'
import { renderizarRutas } from '../../pruebas/utilidades'
import { simularApisVacias } from '../../pruebas/simularApis'

vi.mock('../../api/departamentosApi', () => ({ departamentosApi: { listar: vi.fn() } }))
vi.mock('../../api/empleadosApi', () => ({ empleadosApi: { listar: vi.fn() } }))
vi.mock('../../api/entidadesApi', () => ({ entidadesApi: { listar: vi.fn() } }))
vi.mock('../../api/nominasApi', () => ({ nominasApi: { reporteSemanal: vi.fn(), listar: vi.fn() } }))
vi.mock('../../api/usuariosApi', () => ({ usuariosApi: { listar: vi.fn() } }))

beforeEach(simularApisVacias)

test('MuestraMenuYTituloDeLaRuta', async () => {
  renderizarRutas(rutas, { rol: 'Admin', ruta: '/empleados' })

  expect(await screen.findByRole('heading', { name: 'Consulta de empleados' })).toBeInTheDocument()
  expect(screen.getByRole('link', { name: 'Inicio' })).toBeInTheDocument()
  expect(screen.getByRole('link', { name: 'Crear registro' })).toBeInTheDocument()
})

test('BotonDeMenuAbreYElegirUnaOpcionLoCierra', async () => {
  renderizarRutas(rutas, { rol: 'Admin', ruta: '/' })
  const botonMenu = screen.getByRole('button', { name: 'Abrir menú' })
  expect(botonMenu).toHaveAttribute('aria-expanded', 'false')

  await userEvent.click(botonMenu)
  expect(botonMenu).toHaveAttribute('aria-expanded', 'true')

  await userEvent.click(screen.getByRole('link', { name: 'Departamentos' }))
  expect(screen.getByRole('button', { name: 'Abrir menú' })).toHaveAttribute('aria-expanded', 'false')
})

test('EscapeCierraElMenuYDevuelveElFocoAlBoton', async () => {
  renderizarRutas(rutas, { rol: 'Admin', ruta: '/' })
  const botonMenu = screen.getByRole('button', { name: 'Abrir menú' })
  await userEvent.click(botonMenu)

  await userEvent.keyboard('{Escape}')

  expect(botonMenu).toHaveAttribute('aria-expanded', 'false')
  expect(botonMenu).toHaveFocus()
})

test('UsuarioNoVeOpcionesDeAdministrador', async () => {
  renderizarRutas(rutas, { rol: 'Usuario', ruta: '/' })

  expect(await screen.findByRole('link', { name: 'Consulta' })).toBeInTheDocument()
  expect(screen.queryByRole('link', { name: 'Crear registro' })).not.toBeInTheDocument()
  expect(screen.queryByRole('link', { name: 'Usuarios' })).not.toBeInTheDocument()
})
