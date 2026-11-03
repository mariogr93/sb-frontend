import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AxiosError, type AxiosResponse } from 'axios'
import { vi } from 'vitest'
import { departamentosApi } from '../../api/departamentosApi'
import { empleadosApi } from '../../api/empleadosApi'
import { crearEmpleado } from '../../pruebas/datos'
import { renderizarConProveedores, renderizarRutas } from '../../pruebas/utilidades'
import type { TipoEmpleado } from '../../tipos/empleados'
import { FormularioEmpleado } from './FormularioEmpleado'

vi.mock('../../api/departamentosApi', () => ({ departamentosApi: { listar: vi.fn() } }))
vi.mock('../../api/empleadosApi', () => ({ empleadosApi: { crear: vi.fn(), actualizar: vi.fn(), obtener: vi.fn() } }))

const LEYENDA_REQUERIDO = 'Este campo es obligatorio.'
const TODAS_LAS_ETIQUETAS = ['Salario semanal', 'Sueldo por hora', 'Horas trabajadas', 'Ventas brutas', 'Tarifa de comisión', 'Salario base']

beforeEach(() => {
  vi.mocked(departamentosApi.listar).mockResolvedValue([{ id: 'd1', nombre: 'Ventas', estaActivo: true }])
  vi.mocked(empleadosApi.crear).mockResolvedValue(crearEmpleado())
  vi.mocked(empleadosApi.actualizar).mockResolvedValue(crearEmpleado())
})

// El input y su mensaje de error comparten el contenedor del campo.
const campo = (etiqueta: string) => screen.getByLabelText(etiqueta).closest('div') as HTMLElement

async function abrirFormulario() {
  renderizarConProveedores(<FormularioEmpleado />, { rol: 'Admin' })
  await screen.findByLabelText('Tipo de empleado')
}

async function completarDatosComunes() {
  await userEvent.type(screen.getByLabelText('Primer nombre'), 'Ana')
  await userEvent.type(screen.getByLabelText('Apellido paterno'), 'Pérez')
  await userEvent.type(screen.getByLabelText('Cédula'), '402-0000001-5')
  await userEvent.selectOptions(screen.getByLabelText('Departamento'), 'd1')
}

const elegirTipo = (tipo: TipoEmpleado) => userEvent.selectOptions(screen.getByLabelText('Tipo de empleado'), tipo)
const escribir = (etiqueta: string, valor: string) => userEvent.type(screen.getByLabelText(etiqueta), valor)
const guardar = () => userEvent.click(screen.getByRole('button', { name: 'Guardar' }))

test.each<[TipoEmpleado, string[]]>([
  ['Asalariado', ['Salario semanal']],
  ['PorHoras', ['Sueldo por hora', 'Horas trabajadas']],
  ['PorComision', ['Ventas brutas', 'Tarifa de comisión']],
  ['AsalariadoPorComision', ['Ventas brutas', 'Tarifa de comisión', 'Salario base']],
])('%sMuestraSoloSusCamposDeCompensacion', async (tipo, visibles) => {
  await abrirFormulario()

  await elegirTipo(tipo)

  visibles.forEach((etiqueta) => expect(screen.getByLabelText(etiqueta)).toBeInTheDocument())
  TODAS_LAS_ETIQUETAS.filter((etiqueta) => !visibles.includes(etiqueta)).forEach((etiqueta) =>
    expect(screen.queryByLabelText(etiqueta)).not.toBeInTheDocument(),
  )
})

test('VolverAUnTipoAnteriorEncuentraSusCamposVacios', async () => {
  await abrirFormulario()
  await elegirTipo('PorHoras')
  await escribir('Sueldo por hora', '500')

  await elegirTipo('Asalariado')
  await elegirTipo('PorHoras')

  expect(screen.getByLabelText('Sueldo por hora')).toHaveValue(null)
})

test('FaltarUnCampoDelTipoMarcaEsaCasillaYNoLlamaALaApi', async () => {
  await abrirFormulario()
  await completarDatosComunes()
  await elegirTipo('PorHoras')
  await escribir('Sueldo por hora', '500')

  await guardar()

  expect(await screen.findByText(LEYENDA_REQUERIDO)).toBeInTheDocument()
  expect(campo('Horas trabajadas')).toHaveTextContent(LEYENDA_REQUERIDO)
  expect(campo('Sueldo por hora')).not.toHaveTextContent(LEYENDA_REQUERIDO)
  expect(empleadosApi.crear).not.toHaveBeenCalled()
})

test('ErrorDeCampoDelServidorApareceBajoElInputCorrecto', async () => {
  vi.mocked(empleadosApi.crear).mockRejectedValue(
    new AxiosError('fallo', undefined, undefined, undefined, {
      status: 400,
      data: { errors: { 'Compensacion.SueldoPorHora': ['El sueldo por hora es inválido.'] } },
    } as AxiosResponse),
  )
  await abrirFormulario()
  await completarDatosComunes()
  await elegirTipo('PorHoras')
  await escribir('Sueldo por hora', '500')
  await escribir('Horas trabajadas', '45')

  await guardar()

  await waitFor(() => expect(campo('Sueldo por hora')).toHaveTextContent('El sueldo por hora es inválido.'))
  expect(campo('Horas trabajadas')).not.toHaveTextContent('inválido')
})

test('ErrorSinCampoDelServidorSeMuestraEnUnaAlerta', async () => {
  vi.mocked(empleadosApi.crear).mockRejectedValue(
    new AxiosError('fallo', undefined, undefined, undefined, {
      status: 409,
      data: { title: 'Conflicto.', detail: 'Ya existe un empleado con esa cédula.' },
    } as AxiosResponse),
  )
  await abrirFormulario()
  await completarDatosComunes()
  await escribir('Salario semanal', '1500')

  await guardar()

  expect(await screen.findByRole('alert')).toHaveTextContent('Ya existe un empleado con esa cédula.')
})

test.each([
  ['Primer nombre', 'A'.repeat(101), 'Máximo 100 caracteres.'],
  ['Primer nombre', 'Ana123', 'Solo letras, espacios, apóstrofo, punto o guion.'],
  ['Cédula', '402-12-3456', 'Formato ###-#######-#.'],
])('%sConValor%sMuestra%s', async (etiqueta, valor, mensaje) => {
  await abrirFormulario()
  await completarDatosComunes()
  await userEvent.clear(screen.getByLabelText(etiqueta))
  await escribir(etiqueta, valor)
  await escribir('Salario semanal', '1500')

  await guardar()

  await waitFor(() => expect(campo(etiqueta)).toHaveTextContent(mensaje))
  expect(empleadosApi.crear).not.toHaveBeenCalled()
})

// [tipo, campo de relleno, valor de relleno, campo bajo prueba, valor, mensaje esperado (null = válido)]
test.each<[TipoEmpleado, string, string, string, string, string | null]>([
  ['PorHoras', 'Sueldo por hora', '500', 'Horas trabajadas', '168', null],
  ['PorHoras', 'Sueldo por hora', '500', 'Horas trabajadas', '169', 'Máximo 168 horas.'],
  ['PorHoras', 'Sueldo por hora', '500', 'Horas trabajadas', '-1', 'No puede ser negativo.'],
  ['PorHoras', 'Sueldo por hora', '500', 'Horas trabajadas', '40.1255', 'Máximo 3 decimales.'],
  ['PorHoras', 'Horas trabajadas', '40', 'Sueldo por hora', '500.005', 'Máximo 2 decimales.'],
  ['PorHoras', 'Horas trabajadas', '40', 'Sueldo por hora', '100000000', 'Debe estar entre 0 y 99,999,999.99.'],
  ['PorComision', 'Ventas brutas', '1000', 'Tarifa de comisión', '1', null],
  ['PorComision', 'Ventas brutas', '1000', 'Tarifa de comisión', '1.5', 'Máximo 1 (100 %).'],
  ['PorComision', 'Ventas brutas', '1000', 'Tarifa de comisión', '0', 'Debe ser mayor que 0.'],
  ['PorComision', 'Ventas brutas', '1000', 'Tarifa de comisión', '0.1234567', 'Máximo 6 decimales.'],
])('%s_%s%s_%s=%s_da_%s', async (tipo, campoRelleno, valorRelleno, campoPrueba, valor, mensaje) => {
  await abrirFormulario()
  await completarDatosComunes()
  await elegirTipo(tipo)
  await escribir(campoRelleno, valorRelleno)
  await escribir(campoPrueba, valor)

  await guardar()

  if (mensaje === null) {
    await waitFor(() => expect(empleadosApi.crear).toHaveBeenCalledTimes(1))
    return
  }
  await waitFor(() => expect(campo(campoPrueba)).toHaveTextContent(mensaje))
  expect(empleadosApi.crear).not.toHaveBeenCalled()
})

test('CrearEnviaElPayloadExactoYNavegaAlDetalle', async () => {
  const enrutador = renderizarRutas(
    [
      { path: '/empleados/nuevo', element: <FormularioEmpleado /> },
      { path: '/empleados/:id', element: <p>Detalle del empleado</p> },
    ],
    { rol: 'Admin', ruta: '/empleados/nuevo' },
  )
  await screen.findByLabelText('Tipo de empleado')
  await completarDatosComunes()
  await elegirTipo('PorHoras')
  await escribir('Sueldo por hora', '500')
  await escribir('Horas trabajadas', '45')

  await guardar()

  await waitFor(() => expect(enrutador.state.location.pathname).toBe('/empleados/e1'))
  expect(empleadosApi.crear).toHaveBeenCalledWith({
    primerNombre: 'Ana',
    apellidoPaterno: 'Pérez',
    cedula: '402-0000001-5',
    departamentoId: 'd1',
    tipo: 'PorHoras',
    compensacion: { sueldoPorHora: 500, horasTrabajadas: 45 },
  })
})

test('CambiarDeTipoDescartaElValorInvalidoDelTipoAnterior', async () => {
  await abrirFormulario()
  await completarDatosComunes()
  await elegirTipo('PorHoras')
  await escribir('Horas trabajadas', '169')

  await elegirTipo('Asalariado')
  await escribir('Salario semanal', '1500')
  await guardar()

  await waitFor(() => expect(empleadosApi.crear).toHaveBeenCalledTimes(1))
  expect(vi.mocked(empleadosApi.crear).mock.calls[0][0].compensacion).toEqual({ salarioSemanal: 1500 })
})

test('EditarCargaLosDatosYActualizaPorIdSinCrear', async () => {
  vi.mocked(empleadosApi.obtener).mockResolvedValue(crearEmpleado())
  renderizarRutas([{ path: '/empleados/:id/editar', element: <FormularioEmpleado /> }], { rol: 'Admin', ruta: '/empleados/e1/editar' })
  await waitFor(() => expect(screen.getByLabelText('Primer nombre')).toHaveValue('Ana'))
  expect(screen.getByLabelText('Departamento')).toHaveValue('d1')
  expect(screen.getByLabelText('Tipo de empleado')).toHaveValue('PorHoras')
  expect(screen.getByLabelText('Sueldo por hora')).toHaveValue(500)

  await userEvent.clear(screen.getByLabelText('Horas trabajadas'))
  await escribir('Horas trabajadas', '50')
  await guardar()

  await waitFor(() => expect(empleadosApi.actualizar).toHaveBeenCalledTimes(1))
  expect(vi.mocked(empleadosApi.actualizar).mock.calls[0]).toEqual([
    'e1',
    {
      primerNombre: 'Ana',
      apellidoPaterno: 'Pérez',
      cedula: '402-0000001-5',
      departamentoId: 'd1',
      tipo: 'PorHoras',
      compensacion: { sueldoPorHora: 500, horasTrabajadas: 50 },
    },
  ])
  expect(empleadosApi.crear).not.toHaveBeenCalled()
})

test('EditarUnEmpleadoQueNoExisteMuestraElErrorSinFormulario', async () => {
  vi.mocked(empleadosApi.obtener).mockRejectedValue(
    new AxiosError('fallo', undefined, undefined, undefined, {
      status: 404,
      data: { title: 'Recurso no encontrado.', detail: 'No se encontró el empleado.' },
    } as AxiosResponse),
  )
  renderizarRutas([{ path: '/empleados/:id/editar', element: <FormularioEmpleado /> }], { rol: 'Admin', ruta: '/empleados/x/editar' })

  expect(await screen.findByRole('alert')).toHaveTextContent('No se encontró el empleado.')
  expect(screen.queryByRole('button', { name: 'Guardar' })).not.toBeInTheDocument()
})

test('SiFallanLosDepartamentosSeAvisaYNoSePuedeGuardar', async () => {
  vi.mocked(departamentosApi.listar).mockRejectedValue(
    new AxiosError('fallo', undefined, undefined, undefined, { status: 500, data: { title: 'Error.', detail: 'Servicio caído.' } } as AxiosResponse),
  )
  await abrirFormulario()

  expect(await screen.findByRole('alert')).toHaveTextContent('No se pudieron cargar los departamentos: Servicio caído.')
  expect(screen.getByRole('button', { name: 'Guardar' })).toBeDisabled()
})
