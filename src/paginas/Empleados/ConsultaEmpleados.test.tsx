import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AxiosError, type AxiosResponse } from 'axios'
import { vi } from 'vitest'
import { departamentosApi } from '../../api/departamentosApi'
import { empleadosApi } from '../../api/empleadosApi'
import { crearEmpleado } from '../../pruebas/datos'
import { renderizarConProveedores } from '../../pruebas/utilidades'
import type { ResultadoPaginado } from '../../tipos/comun'
import type { Empleado } from '../../tipos/empleados'
import { ConsultaEmpleados } from './ConsultaEmpleados'

vi.mock('../../api/departamentosApi', () => ({ departamentosApi: { listar: vi.fn() } }))
vi.mock('../../api/empleadosApi', () => ({ empleadosApi: { listar: vi.fn(), desactivar: vi.fn(), activar: vi.fn() } }))

const listar = vi.mocked(empleadosApi.listar)
const desactivar = vi.mocked(empleadosApi.desactivar)
const activar = vi.mocked(empleadosApi.activar)

const pagina = (elementos: Empleado[], extra: Partial<ResultadoPaginado<Empleado>> = {}): ResultadoPaginado<Empleado> => ({
  elementos,
  pagina: 1,
  tamanoPagina: 20,
  totalElementos: elementos.length,
  totalPaginas: 1,
  ...extra,
})

const errorServidor = (estado: number, detalle: string) =>
  new AxiosError('fallo', undefined, undefined, undefined, { status: estado, data: { title: 'Error.', detail: detalle } } as AxiosResponse)

const ultimoFiltro = () => listar.mock.calls.at(-1)![0]

beforeEach(() => {
  vi.mocked(departamentosApi.listar).mockResolvedValue([{ id: 'd1', nombre: 'Ventas', estaActivo: true }])
  listar.mockResolvedValue(pagina([crearEmpleado()]))
  desactivar.mockResolvedValue(undefined)
  activar.mockResolvedValue(undefined)
})

test('MuestraEmpleadosConSuPagoSemanal', async () => {
  renderizarConProveedores(<ConsultaEmpleados />, { rol: 'Usuario' })

  expect(await screen.findByText('Ana Pérez')).toBeInTheDocument()
  expect(screen.getByText(/23,750\.00/)).toBeInTheDocument()
})

test('UsuarioNoVeAccionesDeEscritura', async () => {
  renderizarConProveedores(<ConsultaEmpleados />, { rol: 'Usuario' })

  await screen.findByText('Ana Pérez')

  expect(screen.queryByRole('link', { name: 'Editar' })).not.toBeInTheDocument()
  expect(screen.queryByRole('button', { name: 'Desactivar' })).not.toBeInTheDocument()
  expect(screen.queryByRole('button', { name: 'Crear registro' })).not.toBeInTheDocument()
})

test('AdministradorVeEditarDesactivarYCrear', async () => {
  renderizarConProveedores(<ConsultaEmpleados />, { rol: 'Admin' })

  await screen.findByText('Ana Pérez')

  expect(screen.getByRole('link', { name: 'Editar' })).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'Desactivar' })).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'Crear registro' })).toBeInTheDocument()
})

test('UnEmpleadoInactivoNoOfreceDesactivar', async () => {
  listar.mockResolvedValue(pagina([crearEmpleado({ estado: 'Inactivo' })]))
  renderizarConProveedores(<ConsultaEmpleados />, { rol: 'Admin' })

  await screen.findByText('Ana Pérez')

  expect(screen.getByRole('link', { name: 'Editar' })).toBeInTheDocument()
  expect(screen.queryByRole('button', { name: 'Desactivar' })).not.toBeInTheDocument()
})

test('AdministradorReactivaUnEmpleadoInactivoYSeRefrescaLaLista', async () => {
  listar.mockResolvedValue(pagina([crearEmpleado({ estado: 'Inactivo' })]))
  renderizarConProveedores(<ConsultaEmpleados />, { rol: 'Admin' })
  const botonReactivar = await screen.findByRole('button', { name: 'Reactivar' })
  listar.mockClear()

  await userEvent.click(botonReactivar)

  await waitFor(() => expect(activar).toHaveBeenCalledTimes(1))
  expect(activar.mock.calls[0][0]).toBe('e1')
  await waitFor(() => expect(listar).toHaveBeenCalled())
})

test('UnEmpleadoActivoNoOfreceReactivar', async () => {
  renderizarConProveedores(<ConsultaEmpleados />, { rol: 'Admin' })

  await screen.findByText('Ana Pérez')

  expect(screen.queryByRole('button', { name: 'Reactivar' })).not.toBeInTheDocument()
})

test('UsuarioNoVeReactivarEnUnEmpleadoInactivo', async () => {
  listar.mockResolvedValue(pagina([crearEmpleado({ estado: 'Inactivo' })]))
  renderizarConProveedores(<ConsultaEmpleados />, { rol: 'Usuario' })

  await screen.findByText('Ana Pérez')

  expect(screen.queryByRole('button', { name: 'Reactivar' })).not.toBeInTheDocument()
})

test('SiReactivarFallaPorDepartamentoInactivoMuestraElMensajeDelServidor', async () => {
  listar.mockResolvedValue(pagina([crearEmpleado({ estado: 'Inactivo' })]))
  activar.mockRejectedValue(errorServidor(422, 'No se puede reactivar un empleado cuyo departamento está inactivo.'))
  renderizarConProveedores(<ConsultaEmpleados />, { rol: 'Admin' })

  await userEvent.click(await screen.findByRole('button', { name: 'Reactivar' }))

  expect(await screen.findByRole('alert')).toHaveTextContent('cuyo departamento está inactivo')
})

test('SinResultadosMuestraMensaje', async () => {
  listar.mockResolvedValue(pagina([], { totalPaginas: 0 }))
  renderizarConProveedores(<ConsultaEmpleados />, { rol: 'Admin' })

  expect(await screen.findByText('No hay empleados con esos filtros.')).toBeInTheDocument()
})

test('MuestraCargandoYLuegoElErrorDelServidor', async () => {
  listar.mockRejectedValue(errorServidor(500, 'Servicio caído.'))
  renderizarConProveedores(<ConsultaEmpleados />, { rol: 'Admin' })

  expect(screen.getByRole('status')).toHaveTextContent('Cargando')
  expect(await screen.findByRole('alert')).toHaveTextContent('Servicio caído.')
})

test('FiltrarPorNombreLlamaALaApiConElTextoYVuelveALaPaginaUno', async () => {
  renderizarConProveedores(<ConsultaEmpleados />, { rol: 'Admin', ruta: '/?pagina=3' })
  await screen.findByText('Ana Pérez')

  await userEvent.type(screen.getByLabelText('Buscar por nombre'), 'ana')

  // Espera el retardo de la búsqueda (300 ms).
  await waitFor(() => expect(ultimoFiltro()).toMatchObject({ nombre: 'ana', pagina: 1 }))
})

test.each([
  ['Estado', 'Inactivo', { estado: 'Inactivo' }],
  ['Tipo', 'PorHoras', { tipo: 'PorHoras' }],
  ['Departamento', 'd1', { departamentoId: 'd1' }],
])('ElegirEn%s_%s_filtraLaConsulta', async (etiqueta, valor, esperado) => {
  renderizarConProveedores(<ConsultaEmpleados />, { rol: 'Admin' })
  await screen.findByText('Ana Pérez')
  await screen.findByRole('option', { name: 'Ventas' })

  await userEvent.selectOptions(screen.getByLabelText(etiqueta), valor)

  await waitFor(() => expect(ultimoFiltro()).toMatchObject(esperado))
})

test('SiguienteYAnteriorCambianDePagina', async () => {
  listar.mockImplementation(async (filtro) => pagina([crearEmpleado()], { pagina: filtro.pagina, totalElementos: 40, totalPaginas: 2 }))
  renderizarConProveedores(<ConsultaEmpleados />, { rol: 'Admin' })
  await screen.findByText('Ana Pérez')
  expect(screen.getByRole('button', { name: 'Anterior' })).toBeDisabled()

  await userEvent.click(screen.getByRole('button', { name: 'Siguiente' }))

  await waitFor(() => expect(ultimoFiltro().pagina).toBe(2))
  await waitFor(() => expect(screen.getByRole('button', { name: 'Siguiente' })).toBeDisabled())

  await userEvent.click(screen.getByRole('button', { name: 'Anterior' }))
  await waitFor(() => expect(ultimoFiltro().pagina).toBe(1))
})

test('SiLaPaginaPedidaYaNoExisteVuelveALaUltimaConDatos', async () => {
  listar.mockImplementation(async (filtro) =>
    filtro.pagina === 2
      ? pagina([], { pagina: 2, totalElementos: 20, totalPaginas: 1 })
      : pagina([crearEmpleado()], { pagina: 1, totalElementos: 20, totalPaginas: 1 }),
  )
  renderizarConProveedores(<ConsultaEmpleados />, { rol: 'Admin', ruta: '/?pagina=2' })

  expect(await screen.findByText('Ana Pérez')).toBeInTheDocument()
  expect(ultimoFiltro().pagina).toBe(1)
  expect(screen.queryByText('No hay empleados con esos filtros.')).not.toBeInTheDocument()
})

test('CancelarLaConfirmacionNoDesactivaYDevuelveElFoco', async () => {
  renderizarConProveedores(<ConsultaEmpleados />, { rol: 'Admin' })
  const botonDesactivar = await screen.findByRole('button', { name: 'Desactivar' })

  await userEvent.click(botonDesactivar)
  const dialogo = screen.getByRole('dialog', { name: 'Desactivar empleado' })
  expect(within(dialogo).getByRole('button', { name: 'Cancelar' })).toHaveFocus()

  await userEvent.click(within(dialogo).getByRole('button', { name: 'Cancelar' }))

  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  expect(desactivar).not.toHaveBeenCalled()
  expect(botonDesactivar).toHaveFocus()
})

test('ConfirmarDesactivaElEmpleadoElegidoYRefrescaLaLista', async () => {
  renderizarConProveedores(<ConsultaEmpleados />, { rol: 'Admin' })
  await userEvent.click(await screen.findByRole('button', { name: 'Desactivar' }))
  listar.mockClear()

  await userEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Desactivar' }))

  await waitFor(() => expect(desactivar).toHaveBeenCalledTimes(1))
  expect(desactivar.mock.calls[0][0]).toBe('e1')
  await waitFor(() => expect(listar).toHaveBeenCalled())
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
})

test('SiDesactivarFallaMuestraElMensajeDelServidor', async () => {
  desactivar.mockRejectedValue(errorServidor(422, 'No se puede desactivar.'))
  renderizarConProveedores(<ConsultaEmpleados />, { rol: 'Admin' })
  await userEvent.click(await screen.findByRole('button', { name: 'Desactivar' }))

  await userEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Desactivar' }))

  expect(await screen.findByRole('alert')).toHaveTextContent('No se puede desactivar.')
})
