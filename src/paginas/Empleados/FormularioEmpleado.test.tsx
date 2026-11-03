import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AxiosError, type AxiosResponse } from 'axios'
import { vi } from 'vitest'
import { departamentosApi } from '../../api/departamentosApi'
import { empleadosApi } from '../../api/empleadosApi'
import { renderizarConProveedores } from '../../pruebas/utilidades'
import { FormularioEmpleado } from './FormularioEmpleado'

vi.mock('../../api/departamentosApi', () => ({ departamentosApi: { listar: vi.fn() } }))
vi.mock('../../api/empleadosApi', () => ({ empleadosApi: { crear: vi.fn() } }))

beforeEach(() => {
  vi.mocked(departamentosApi.listar).mockResolvedValue([{ id: 'd1', nombre: 'Ventas', estaActivo: true }])
})

test('PorHorasMuestraSueldoYHoras', async () => {
  renderizarConProveedores(<FormularioEmpleado />, { rol: 'Admin' })

  await userEvent.selectOptions(screen.getByLabelText('Tipo de empleado'), 'PorHoras')

  expect(screen.getByLabelText('Sueldo por hora')).toBeInTheDocument()
  expect(screen.getByLabelText('Horas trabajadas')).toBeInTheDocument()
  expect(screen.queryByLabelText('Salario semanal')).not.toBeInTheDocument()
})

test('SinCompletarMuestraErroresDeLosCamposDelTipo', async () => {
  renderizarConProveedores(<FormularioEmpleado />, { rol: 'Admin' })

  await userEvent.click(screen.getByRole('button', { name: 'Guardar' }))

  expect(await screen.findAllByText('Este campo es obligatorio.')).not.toHaveLength(0)
  expect(empleadosApi.crear).not.toHaveBeenCalled()
})

test('ErrorDeCampoDelServidorApareceBajoElInput', async () => {
  vi.mocked(empleadosApi.crear).mockRejectedValue(
    new AxiosError('fallo', undefined, undefined, undefined, {
      status: 400,
      data: { errors: { 'Compensacion.SueldoPorHora': ['El sueldo por hora es inválido.'] } },
    } as AxiosResponse),
  )
  renderizarConProveedores(<FormularioEmpleado />, { rol: 'Admin' })
  await screen.findByRole('option', { name: 'Ventas' })

  await userEvent.type(screen.getByLabelText('Primer nombre'), 'Ana')
  await userEvent.type(screen.getByLabelText('Apellido paterno'), 'Pérez')
  await userEvent.type(screen.getByLabelText('Cédula'), '402-0000001-5')
  await userEvent.selectOptions(screen.getByLabelText('Departamento'), 'd1')
  await userEvent.selectOptions(screen.getByLabelText('Tipo de empleado'), 'PorHoras')
  await userEvent.type(screen.getByLabelText('Sueldo por hora'), '500')
  await userEvent.type(screen.getByLabelText('Horas trabajadas'), '45')
  await userEvent.click(screen.getByRole('button', { name: 'Guardar' }))

  expect(await screen.findByText('El sueldo por hora es inválido.')).toBeInTheDocument()
})
