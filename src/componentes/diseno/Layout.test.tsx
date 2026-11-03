import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { rutas } from '../../rutas'
import { renderizarRutas } from '../../pruebas/utilidades'

test('MuestraMenuYTituloDeLaRuta', () => {
  renderizarRutas(rutas, { rol: 'Admin', ruta: '/empleados' })

  expect(screen.getByRole('heading', { name: 'Consulta de empleados' })).toBeInTheDocument()
  expect(screen.getByRole('link', { name: 'Inicio' })).toBeInTheDocument()
  expect(screen.getByRole('link', { name: 'Crear registro' })).toBeInTheDocument()
})

test('BotonDeMenuAbreYElegirUnaOpcionLoCierra', async () => {
  renderizarRutas(rutas, { rol: 'Admin', ruta: '/' })
  const botonMenu = screen.getByRole('button', { name: 'Abrir menú' })
  expect(botonMenu).toHaveAttribute('aria-expanded', 'false')

  await userEvent.click(botonMenu)
  expect(botonMenu).toHaveAttribute('aria-expanded', 'true')

  await userEvent.click(screen.getByRole('link', { name: 'Departamentos' }))
  expect(screen.getByRole('button', { name: 'Abrir menú' })).toHaveAttribute('aria-expanded', 'false')
})

test('UsuarioNoVeOpcionesDeAdministrador', () => {
  renderizarRutas(rutas, { rol: 'Usuario', ruta: '/' })

  expect(screen.getByRole('link', { name: 'Consulta' })).toBeInTheDocument()
  expect(screen.queryByRole('link', { name: 'Crear registro' })).not.toBeInTheDocument()
  expect(screen.queryByRole('link', { name: 'Usuarios' })).not.toBeInTheDocument()
})
