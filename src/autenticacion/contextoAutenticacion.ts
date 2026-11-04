import { createContext } from 'react'
import type { IniciarSesionSolicitud, InicioSesionRespuesta } from '../tipos/autenticacion'

export type ContextoAutenticacionValor = {
  sesion: InicioSesionRespuesta | null
  esAdministrador: boolean
  iniciarSesion: (solicitud: IniciarSesionSolicitud) => Promise<void>
  cerrarSesion: () => void
}

export const ContextoAutenticacion = createContext<ContextoAutenticacionValor | null>(null)
