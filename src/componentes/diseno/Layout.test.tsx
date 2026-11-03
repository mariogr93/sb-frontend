import { render, screen } from '@testing-library/react'
import { RouterProvider, createMemoryRouter } from 'react-router-dom'
import { rutas } from '../../rutas'

test('MuestraMenuYTituloDeLaRuta', () => {
  const enrutador = createMemoryRouter(rutas, { initialEntries: ['/empleados'] })

  render(<RouterProvider router={enrutador} />)

  expect(screen.getByRole('heading', { name: 'Consulta de empleados' })).toBeInTheDocument()
  expect(screen.getByRole('link', { name: 'Inicio' })).toBeInTheDocument()
  expect(screen.getByRole('link', { name: 'Crear registro' })).toBeInTheDocument()
})
