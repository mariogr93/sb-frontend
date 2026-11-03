import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { autenticacionApi } from '../api/autenticacionApi'
import { almacenSesion } from './almacenSesion'
import { ContextoAutenticacion } from './contextoAutenticacion'
import type { IniciarSesionSolicitud } from '../tipos/autenticacion'

const ROL_ADMINISTRADOR = 'Admin'
// setTimeout falla (dispara de inmediato) por encima de este valor.
const RETARDO_MAXIMO_MS = 2 ** 31 - 1

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

  // Con la pestaña abierta, la sesión se cierra sola al vencer el token.
  useEffect(() => {
    if (!sesion) return
    const restante = new Date(sesion.fechaExpiracion).getTime() - Date.now()
    const temporizador = window.setTimeout(cerrarSesion, Math.min(Math.max(restante, 0), RETARDO_MAXIMO_MS))
    return () => window.clearTimeout(temporizador)
  }, [sesion, cerrarSesion])

  const valor = useMemo(
    () => ({ sesion, esAdministrador: sesion?.rol === ROL_ADMINISTRADOR, iniciarSesion, cerrarSesion }),
    [sesion, iniciarSesion, cerrarSesion],
  )

  return <ContextoAutenticacion.Provider value={valor}>{children}</ContextoAutenticacion.Provider>
}
