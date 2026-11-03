import { screen } from '@testing-library/react'
import { vi } from 'vitest'
import { departamentosApi } from '../../api/departamentosApi'
import { empleadosApi } from '../../api/empleadosApi'
import { crearEmpleado } from '../../pruebas/datos'
import { renderizarConProveedores } from '../../pruebas/utilidades'
import { ConsultaEmpleados } from './ConsultaEmpleados'

vi.mock('../../api/departamentosApi', () => ({ departamentosApi: { listar: vi.fn() } }))
vi.mock('../../api/empleadosApi', () => ({ empleadosApi: { listar: vi.fn(), desactivar: vi.fn() } }))

beforeEach(() => {
  vi.mocked(departamentosApi.listar).mockResolvedValue([{ id: 'd1', nombre: 'Ventas', estaActivo: true }])
  vi.mocked(empleadosApi.listar).mockResolvedValue({
    elementos: [crearEmpleado()],
    pagina: 1,
    tamanoPagina: 20,
    totalElementos: 1,
    totalPaginas: 1,
  })
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

test('SinResultadosMuestraMensaje', async () => {
  vi.mocked(empleadosApi.listar).mockResolvedValue({ elementos: [], pagina: 1, tamanoPagina: 20, totalElementos: 0, totalPaginas: 0 })
  renderizarConProveedores(<ConsultaEmpleados />, { rol: 'Admin' })

  expect(await screen.findByText('No hay empleados con esos filtros.')).toBeInTheDocument()
})
