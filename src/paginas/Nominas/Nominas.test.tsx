import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AxiosError, type AxiosResponse } from 'axios'
import { vi } from 'vitest'
import { nominasApi } from '../../api/nominasApi'
import { renderizarConProveedores } from '../../pruebas/utilidades'
import { Nominas } from './Nominas'

vi.mock('../../api/nominasApi', () => ({ nominasApi: { listar: vi.fn(), guardar: vi.fn() } }))

beforeEach(() => {
  vi.mocked(nominasApi.listar).mockResolvedValue({
    elementos: [
      { id: 'n1', fechaInicioSemana: '2026-10-26', fechaCreacion: '2026-11-02T14:00:00Z', creadoPor: 'admin', cantidadEmpleados: 228, montoTotal: 3733892.76 },
    ],
    pagina: 1,
    tamanoPagina: 10,
    totalElementos: 1,
    totalPaginas: 1,
  })
})

test('UsuarioVeElHistorialPeroNoElFormularioDeGuardar', async () => {
  renderizarConProveedores(<Nominas />, { rol: 'Usuario' })

  expect(await screen.findByText('admin')).toBeInTheDocument()
  expect(screen.queryByRole('button', { name: 'Guardar nómina' })).not.toBeInTheDocument()
})

test('SemanaYaGuardadaMuestraElConflictoDelServidor', async () => {
  vi.mocked(nominasApi.guardar).mockRejectedValue(
    new AxiosError('fallo', undefined, undefined, undefined, {
      status: 409,
      data: { title: 'Conflicto.', detail: 'Ya existe una nómina para esa semana.' },
    } as AxiosResponse),
  )
  renderizarConProveedores(<Nominas />, { rol: 'Admin' })
  await screen.findByText('admin')

  await userEvent.type(screen.getByLabelText('Semana (lunes de inicio)'), '2026-10-26')
  await userEvent.click(screen.getByRole('button', { name: 'Guardar nómina' }))

  expect(await screen.findByRole('alert')).toHaveTextContent('Ya existe una nómina para esa semana.')
})
