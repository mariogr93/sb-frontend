import { screen } from '@testing-library/react'
import { vi } from 'vitest'
import { nominasApi } from '../../api/nominasApi'
import { crearReporte } from '../../pruebas/datos'
import { renderizarConProveedores } from '../../pruebas/utilidades'
import { Inicio } from './Inicio'

vi.mock('../../api/nominasApi', () => ({ nominasApi: { reporteSemanal: vi.fn() } }))

test('MuestraTotalesDelReporteSemanal', async () => {
  vi.mocked(nominasApi.reporteSemanal).mockResolvedValue(crearReporte())
  renderizarConProveedores(<Inicio />, { rol: 'Usuario' })

  expect(await screen.findByText('Empleados activos')).toBeInTheDocument()
  expect(screen.getAllByText(/23,750\.00/)).not.toHaveLength(0)
  expect(screen.getByText('Por horas (1)')).toBeInTheDocument()
})
