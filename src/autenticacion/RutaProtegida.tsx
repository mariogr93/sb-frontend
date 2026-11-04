import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAutenticacion } from './useAutenticacion'

export function RutaProtegida({ soloAdministrador = false }: { soloAdministrador?: boolean }) {
  const { sesion, esAdministrador } = useAutenticacion()
  const ubicacion = useLocation()

  if (!sesion) return <Navigate to="/iniciar-sesion" replace state={{ desde: ubicacion.pathname }} />
  if (soloAdministrador && !esAdministrador) return <Navigate to="/" replace />
  return <Outlet />
}
