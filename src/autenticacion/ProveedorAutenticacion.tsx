import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { autenticacionApi } from '../api/autenticacionApi'
import { almacenSesion } from './almacenSesion'
import { ContextoAutenticacion } from './contextoAutenticacion'
import type { IniciarSesionSolicitud } from '../tipos/autenticacion'

const ROL_ADMINISTRADOR = 'Admin'

export function ProveedorAutenticacion({ children }: { children: ReactNode }) {
  const [sesion, setSesion] = useState(almacenSesion.leer)
  const clienteConsultas = useQueryClient()

  const iniciarSesion = useCallback(async (solicitud: IniciarSesionSolicitud) => {
    const respuesta = await autenticacionApi.iniciarSesion(solicitud)
    almacenSesion.guardar(respuesta)
    setSesion(respuesta)
  }, [])

  const cerrarSesion = useCallback(() => {
    almacenSesion.borrar()
    clienteConsultas.clear()
    setSesion(null)
  }, [clienteConsultas])

  const valor = useMemo(
    () => ({ sesion, esAdministrador: sesion?.rol === ROL_ADMINISTRADOR, iniciarSesion, cerrarSesion }),
    [sesion, iniciarSesion, cerrarSesion],
  )

  return <ContextoAutenticacion.Provider value={valor}>{children}</ContextoAutenticacion.Provider>
}
