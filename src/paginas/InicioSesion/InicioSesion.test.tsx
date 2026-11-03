import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AxiosError, type AxiosResponse } from 'axios'
import { vi } from 'vitest'
import { rutas } from '../../rutas'
import { renderizarRutas } from '../../pruebas/utilidades'
import { autenticacionApi } from '../../api/autenticacionApi'

vi.mock('../../api/autenticacionApi', () => ({ autenticacionApi: { iniciarSesion: vi.fn() } }))

const iniciarSesion = vi.mocked(autenticacionApi.iniciarSesion)

async function completarFormulario() {
  await userEvent.type(screen.getByLabelText('Usuario'), 'admin')
  await userEvent.type(screen.getByLabelText('Contraseña'), 'Admin12345')
  await userEvent.click(screen.getByRole('button', { name: 'Ingresar' }))
}

test('CredencialesCorrectasLlevanAlInicio', async () => {
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
