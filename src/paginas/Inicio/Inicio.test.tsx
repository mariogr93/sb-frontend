import { screen } from '@testing-library/react'
import { AxiosError, type AxiosResponse } from 'axios'
import { vi } from 'vitest'
import { nominasApi } from '../../api/nominasApi'
import { crearReporte } from '../../pruebas/datos'
import { renderizarConProveedores } from '../../pruebas/utilidades'
import { Inicio } from './Inicio'

vi.mock('../../api/nominasApi', () => ({ nominasApi: { reporteSemanal: vi.fn() } }))

const reporteSemanal = vi.mocked(nominasApi.reporteSemanal)

// Cada tarjeta se identifica por su etiqueta; el valor debe estar dentro de esa misma tarjeta.
const tarjeta = (etiqueta: string) => screen.getByText(etiqueta).parentElement as HTMLElement

test('CadaTarjetaMuestraSuPropioValor', async () => {
  reporteSemanal.mockResolvedValue({
    ...crearReporte(),
    cantidadEmpleados: 3,
    montoTotal: 29750,
    totalesPorTipo: [
      { tipoEmpleado: 'Asalariado', cantidadEmpleados: 2, montoTotal: 6000 },
      { tipoEmpleado: 'PorHoras', cantidadEmpleados: 1, montoTotal: 23750 },
    ],
  })
  renderizarConProveedores(<Inicio />, { rol: 'Usuario' })

  expect(await screen.findByText('Empleados activos')).toBeInTheDocument()
  expect(tarjeta('Empleados activos')).toHaveTextContent('3')
  expect(tarjeta('Pago semanal total')).toHaveTextContent('29,750.00')
  expect(tarjeta('Asalariado (2)')).toHaveTextContent('6,000.00')
  expect(tarjeta('Por horas (1)')).toHaveTextContent('23,750.00')
})

test('MuestraCargandoMientrasEsperaElReporte', () => {
  reporteSemanal.mockReturnValue(new Promise(() => {}))
  renderizarConProveedores(<Inicio />, { rol: 'Usuario' })

  expect(screen.getByRole('status')).toHaveTextContent('Cargando')
})

test('ErrorDelServidorSeMuestraEnUnaAlerta', async () => {
  reporteSemanal.mockRejectedValue(
    new AxiosError('fallo', undefined, undefined, undefined, {
      status: 500,
      data: { title: 'Error.', detail: 'Ocurrió un error inesperado.' },
    } as AxiosResponse),
  )
  renderizarConProveedores(<Inicio />, { rol: 'Usuario' })

  expect(await screen.findByRole('alert')).toHaveTextContent('Ocurrió un error inesperado.')
})
