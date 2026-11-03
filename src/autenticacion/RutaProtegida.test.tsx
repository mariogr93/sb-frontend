import { screen } from '@testing-library/react'
import { rutas } from '../rutas'
import { renderizarRutas } from '../pruebas/utilidades'

test('SinSesionRedirigeAlInicioDeSesion', () => {
  const enrutador = renderizarRutas(rutas, { ruta: '/empleados' })

  expect(enrutador.state.location.pathname).toBe('/iniciar-sesion')
  expect(screen.getByRole('heading', { name: 'Iniciar sesión' })).toBeInTheDocument()
})

test('UsuarioEnRutaDeAdministradorVuelveAlInicio', () => {
  const enrutador = renderizarRutas(rutas, { rol: 'Usuario', ruta: '/usuarios' })

  expect(enrutador.state.location.pathname).toBe('/')
})

test('AdministradorEntraARutaDeAdministrador', () => {
  const enrutador = renderizarRutas(rutas, { rol: 'Admin', ruta: '/usuarios' })

  expect(enrutador.state.location.pathname).toBe('/usuarios')
})
