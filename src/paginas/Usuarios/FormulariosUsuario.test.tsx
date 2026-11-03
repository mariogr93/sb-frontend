import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { usuariosApi } from '../../api/usuariosApi'
import { renderizarConProveedores } from '../../pruebas/utilidades'
import { FormularioCrearUsuario } from './FormulariosUsuario'

vi.mock('../../api/usuariosApi', () => ({ usuariosApi: { crear: vi.fn() } }))

test('ContrasenaDebilNoSeEnviaYMuestraLaRegla', async () => {
  renderizarConProveedores(<FormularioCrearUsuario alCerrar={vi.fn()} />, { rol: 'Admin' })

  await userEvent.type(screen.getByLabelText('Usuario'), 'maria.diaz')
  await userEvent.type(screen.getByLabelText('Nombre completo'), 'María Díaz')
  await userEvent.type(screen.getByLabelText('Contraseña'), 'corta')
  await userEvent.click(screen.getByRole('button', { name: 'Guardar' }))

  expect(await screen.findByText('Mínimo 8 caracteres.')).toBeInTheDocument()
  expect(usuariosApi.crear).not.toHaveBeenCalled()
})

test('DatosValidosCreanElUsuarioYCierran', async () => {
  vi.mocked(usuariosApi.crear).mockResolvedValue({
    id: 'u1',
    nombreUsuario: 'maria.diaz',
    nombreCompleto: 'María Díaz',
    rol: 'Usuario',
    estaActivo: true,
    fechaCreacion: '2026-11-02T14:00:00Z',
  })
  const alCerrar = vi.fn()
  renderizarConProveedores(<FormularioCrearUsuario alCerrar={alCerrar} />, { rol: 'Admin' })

  await userEvent.type(screen.getByLabelText('Usuario'), 'maria.diaz')
  await userEvent.type(screen.getByLabelText('Nombre completo'), 'María Díaz')
  await userEvent.type(screen.getByLabelText('Contraseña'), 'Segura12345')
  await userEvent.click(screen.getByRole('button', { name: 'Guardar' }))

  await vi.waitFor(() => expect(alCerrar).toHaveBeenCalled())
  expect(usuariosApi.crear).toHaveBeenCalledWith({
    nombreUsuario: 'maria.diaz',
    nombreCompleto: 'María Díaz',
    contrasena: 'Segura12345',
    rol: 'Usuario',
  })
})
