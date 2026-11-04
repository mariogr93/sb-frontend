import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { entidadesApi } from '../../api/entidadesApi'
import { renderizarConProveedores } from '../../pruebas/utilidades'
import type { EntidadGubernamental } from '../../tipos/catalogos'
import { EntidadesGubernamentales } from './EntidadesGubernamentales'

vi.mock('../../api/entidadesApi', () => ({
  entidadesApi: { listar: vi.fn(), desactivar: vi.fn(), activar: vi.fn(), crear: vi.fn(), actualizar: vi.fn() },
}))

const listar = vi.mocked(entidadesApi.listar)

const entidad = (cambios: Partial<EntidadGubernamental> = {}): EntidadGubernamental => ({
  id: 'n1',
  nombre: 'Ministerio de Prueba',
  categoria: 'Ministerios',
  poderDelEstado: 'Ejecutivo',
  sector: 'Salud',
  estaActiva: true,
  ...cambios,
})

const pagina = (elementos: EntidadGubernamental[]) => ({
  elementos,
  pagina: 1,
  tamanoPagina: 20,
  totalElementos: elementos.length,
  totalPaginas: elementos.length > 0 ? 1 : 0,
})

beforeEach(() => {
  listar.mockResolvedValue(pagina([entidad()]))
  vi.mocked(entidadesApi.desactivar).mockResolvedValue(undefined)
  vi.mocked(entidadesApi.activar).mockResolvedValue(undefined)
})

test('UsuarioSoloLeeSinAccionesDeEscritura', async () => {
  renderizarConProveedores(<EntidadesGubernamentales />, { rol: 'Usuario' })

  expect(await screen.findByText('Ministerio de Prueba')).toBeInTheDocument()
  expect(screen.queryByRole('button', { name: 'Nueva entidad' })).not.toBeInTheDocument()
  expect(screen.queryByRole('button', { name: 'Desactivar' })).not.toBeInTheDocument()
  expect(screen.queryByRole('button', { name: 'Reactivar' })).not.toBeInTheDocument()
})

test('BuscarEnviaTodosLosFiltrosYVuelveALaPaginaUno', async () => {
  renderizarConProveedores(<EntidadesGubernamentales />, { rol: 'Usuario' })
  await screen.findByText('Ministerio de Prueba')

  await userEvent.type(screen.getByLabelText('Nombre'), ' Ministerio ')
  await userEvent.type(screen.getByLabelText('Sector'), 'Salud')
  await userEvent.type(screen.getByLabelText('Poder del Estado'), 'Ejecutivo')
  await userEvent.click(screen.getByRole('checkbox', { name: 'Incluir inactivas' }))
  await userEvent.click(screen.getByRole('button', { name: 'Buscar' }))

  await waitFor(() =>
    expect(listar.mock.calls.at(-1)![0]).toEqual({
      nombre: 'Ministerio',
      sector: 'Salud',
      poderDelEstado: 'Ejecutivo',
      incluirInactivas: true,
      pagina: 1,
      tamanoPagina: 20,
    }),
  )
})

test('ConfirmarDesactivaLaEntidadElegida', async () => {
  renderizarConProveedores(<EntidadesGubernamentales />, { rol: 'Admin' })
  await userEvent.click(await screen.findByRole('button', { name: 'Desactivar' }))

  await userEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Desactivar' }))

  await waitFor(() => expect(entidadesApi.desactivar).toHaveBeenCalledTimes(1))
  expect(vi.mocked(entidadesApi.desactivar).mock.calls[0][0]).toBe('n1')
})

test('AdministradorReactivaUnaEntidadInactiva', async () => {
  listar.mockResolvedValue(pagina([entidad({ estaActiva: false })]))
  renderizarConProveedores(<EntidadesGubernamentales />, { rol: 'Admin' })

  await userEvent.click(await screen.findByRole('button', { name: 'Reactivar' }))

  await waitFor(() => expect(entidadesApi.activar).toHaveBeenCalledTimes(1))
  expect(vi.mocked(entidadesApi.activar).mock.calls[0][0]).toBe('n1')
  expect(screen.queryByRole('button', { name: 'Desactivar' })).not.toBeInTheDocument()
})

test('SinResultadosMuestraMensaje', async () => {
  listar.mockResolvedValue(pagina([]))
  renderizarConProveedores(<EntidadesGubernamentales />, { rol: 'Admin' })

  expect(await screen.findByText('No hay entidades con esos filtros.')).toBeInTheDocument()
})

test('SiLaPaginaPedidaYaNoExisteVuelveALaUltima', async () => {
  // La página 2 existía (40 registros); al pedirla ya solo quedan 20: llega vacía y debe volver a la 1.
  listar.mockImplementation(async (filtro) =>
    filtro.pagina === 2
      ? { elementos: [], pagina: 2, tamanoPagina: 20, totalElementos: 20, totalPaginas: 1 }
      : { elementos: [entidad()], pagina: 1, tamanoPagina: 20, totalElementos: filtro.pagina === 1 ? 40 : 20, totalPaginas: 2 },
  )
  renderizarConProveedores(<EntidadesGubernamentales />, { rol: 'Admin' })
  await screen.findByText('Ministerio de Prueba')

  await userEvent.click(screen.getByRole('button', { name: 'Siguiente' }))

  await waitFor(() => expect(listar.mock.calls.some(([filtro]) => filtro.pagina === 2)).toBe(true))
  await waitFor(() => expect(listar.mock.calls.at(-1)![0].pagina).toBe(1))
  expect(await screen.findByText('Ministerio de Prueba')).toBeInTheDocument()
  expect(screen.queryByText('No hay entidades con esos filtros.')).not.toBeInTheDocument()
})
