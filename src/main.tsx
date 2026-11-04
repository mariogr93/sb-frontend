import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from 'react-router-dom'
import { ProveedorAutenticacion } from './autenticacion/ProveedorAutenticacion'
import { enrutador } from './rutas'
import './index.css'

const clienteConsultas = new QueryClient({
  defaultOptions: { queries: { retry: 1, refetchOnWindowFocus: false } },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={clienteConsultas}>
      <ProveedorAutenticacion>
        <RouterProvider router={enrutador} />
      </ProveedorAutenticacion>
    </QueryClientProvider>
  </StrictMode>,
)
