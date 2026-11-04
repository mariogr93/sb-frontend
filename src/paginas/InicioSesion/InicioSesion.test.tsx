import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AxiosError, type AxiosResponse } from 'axios'
import { vi } from 'vitest'
import { autenticacionApi } from '../../api/autenticacionApi'
import { rutas } from '../../rutas'
import { renderizarRutas } from '../../pruebas/utilidades'
import { simularApisVacias } from '../../pruebas/simularApis'

vi.mock('../../api/autenticacionApi', () => ({ autenticacionApi: { iniciarSesion: vi.fn() } }))
vi.mock('../../api/departamentosApi', () => ({ departamentosApi: { listar: vi.fn() } }))
vi.mock('../../api/empleadosApi', () => ({ empleadosApi: { listar: vi.fn() } }))
vi.mock('../../api/entidadesApi', () => ({ entidadesApi: { listar: vi.fn() } }))
vi.mock('../../api/nominasApi', () => ({ nominasApi: { reporteSemanal: vi.fn(), listar: vi.fn() } }))
vi.mock('../../api/usuariosApi', () => ({ usuariosApi: { listar: vi.fn() } }))

const iniciarSesion = vi.mocked(autenticacionApi.iniciarSesion)

beforeEach(simularApisVacias)

async function completarFormulario(usuario = 'admin', contrasena = 'Admin12345') {
  await userEvent.type(screen.getByLabelText('Usuario'), usuario)
  await userEvent.type(screen.getByLabelText('Contraseña'), contrasena)
  await userEvent.click(screen.getByRole('button', { name: 'Ingresar' }))
}

test('CredencialesCorrectasLlevanAlInicioYEnviaLosDatos', async () => {
  iniciarSesion.mockResolvedValue({
    token: 't',
    fechaExpiracion: new Date(Date.now() + 3_600_000).toISOString(),
    nombreUsuario: 'admin',
    nombreCompleto: 'Administrador',
    rol: 'Admin',
  })
  const enrutador = renderizarRutas(rutas, { ruta: '/iniciar-sesion' })

  await completarFormulario()

  await waitFor(() => expect(enrutador.state.location.pathname).toBe('/'))
  expect(iniciarSesion).toHaveBeenCalledWith({ nombreUsuario: 'admin', contrasena: 'Admin12345' })
})

test('CredencialesInvalidasMuestranElMensajeDelServidor', async () => {
  iniciarSesion.mockRejectedValue(
    new AxiosError('fallo', undefined, undefined, undefined, {
      status: 401,
      data: { title: 'No autorizado.', detail: 'Usuario o contraseña incorrectos.' },
    } as AxiosResponse),
  )
  renderizarRutas(rutas, { ruta: '/iniciar-sesion' })

  await completarFormulario()

  expect(await screen.findByRole('alert')).toHaveTextContent('Usuario o contraseña incorrectos.')
})

test('FormularioVacioMuestraErroresYNoLlamaALaApi', async () => {
  renderizarRutas(rutas, { ruta: '/iniciar-sesion' })

  await userEvent.click(screen.getByRole('button', { name: 'Ingresar' }))

  expect(await screen.findAllByText('Este campo es obligatorio.')).toHaveLength(2)
  expect(iniciarSesion).not.toHaveBeenCalled()
})

test('ContrasenaMasLargaQueElServidorPermiteSeRechazaEnElCliente', async () => {
  renderizarRutas(rutas, { ruta: '/iniciar-sesion' })

  await completarFormulario('admin', 'A'.repeat(129))

  expect(await screen.findByText('Máximo 128 caracteres.')).toBeInTheDocument()
  expect(iniciarSesion).not.toHaveBeenCalled()
})
