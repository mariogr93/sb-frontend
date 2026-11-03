import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AxiosError, type AxiosResponse } from 'axios'
import { vi } from 'vitest'
import { departamentosApi } from '../../api/departamentosApi'
import { renderizarConProveedores } from '../../pruebas/utilidades'
import { Departamentos } from './Departamentos'

vi.mock('../../api/departamentosApi', () => ({ departamentosApi: { listar: vi.fn(), desactivar: vi.fn() } }))

beforeEach(() => {
  vi.mocked(departamentosApi.listar).mockResolvedValue([{ id: 'd1', nombre: 'Ventas', estaActivo: true }])
})

test('UsuarioSoloLeeSinAccionesDeEscritura', async () => {
  renderizarConProveedores(<Departamentos />, { rol: 'Usuario' })

  expect(await screen.findByText('Ventas')).toBeInTheDocument()
  expect(screen.queryByRole('button', { name: 'Nuevo departamento' })).not.toBeInTheDocument()
  expect(screen.queryByRole('button', { name: 'Desactivar' })).not.toBeInTheDocument()
})

test('DesactivarConEmpleadosActivosMuestraElMensajeDelServidor', async () => {
  vi.mocked(departamentosApi.desactivar).mockRejectedValue(
    new AxiosError('fallo', undefined, undefined, undefined, {
      status: 422,
      data: { title: 'Regla de negocio.', detail: 'No se puede desactivar un departamento con empleados activos.' },
    } as AxiosResponse),
  )
  renderizarConProveedores(<Departamentos />, { rol: 'Admin' })
  await screen.findByText('Ventas')

  await userEvent.click(screen.getByRole('button', { name: 'Desactivar' }))
  await userEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Desactivar' }))

  expect(await screen.findByRole('alert')).toHaveTextContent('No se puede desactivar un departamento con empleados activos.')
})
