import { screen } from '@testing-library/react'
import { rutas } from '../../rutas'
import { renderizarRutas } from '../../pruebas/utilidades'

test('MuestraMenuYTituloDeLaRuta', () => {
  renderizarRutas(rutas, { rol: 'Admin', ruta: '/empleados' })

  expect(screen.getByRole('heading', { name: 'Consulta de empleados' })).toBeInTheDocument()
  expect(screen.getByRole('link', { name: 'Inicio' })).toBeInTheDocument()
  expect(screen.getByRole('link', { name: 'Crear registro' })).toBeInTheDocument()
})

test('UsuarioNoVeOpcionesDeAdministrador', () => {
  renderizarRutas(rutas, { rol: 'Usuario', ruta: '/' })

  expect(screen.getByRole('link', { name: 'Consulta' })).toBeInTheDocument()
  expect(screen.queryByRole('link', { name: 'Crear registro' })).not.toBeInTheDocument()
  expect(screen.queryByRole('link', { name: 'Usuarios' })).not.toBeInTheDocument()
})
