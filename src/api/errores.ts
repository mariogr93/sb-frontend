import axios from 'axios'
import type { FieldValues, Path, UseFormSetError } from 'react-hook-form'

type ProblemDetails = { title?: string; detail?: string; status?: number; errors?: Record<string, string[]> }

const MENSAJE_SIN_CONEXION = 'No se pudo conectar con el servidor.'
const MENSAJE_DEMASIADAS_SOLICITUDES = 'Demasiadas solicitudes. Intente en un minuto.'
const ESTADO_DEMASIADAS_SOLICITUDES = 429

export function obtenerProblema(error: unknown): ProblemDetails | undefined {
  return axios.isAxiosError<ProblemDetails>(error) ? error.response?.data : undefined
}

export function mensajeError(error: unknown): string {
  if (axios.isAxiosError(error) && error.response?.status === ESTADO_DEMASIADAS_SOLICITUDES) {
    return MENSAJE_DEMASIADAS_SOLICITUDES
  }
  const problema = obtenerProblema(error)
  return problema?.detail ?? problema?.title ?? MENSAJE_SIN_CONEXION
}

/** Como mensajeError, pero si el servidor devolvió errores de campo muestra el primero de cada uno. */
export function mensajeErrorDetallado(error: unknown): string {
  const errores = obtenerProblema(error)?.errors
  const mensajes = errores ? Object.values(errores).map((lista) => lista[0]) : []
  return mensajes.length > 0 ? mensajes.join(' ') : mensajeError(error)
}

// "Compensacion.SueldoPorHora" → "compensacion.sueldoPorHora"
const aRutaCampo = (clave: string) =>
  clave
    .split('.')
    .map((parte) => parte.charAt(0).toLowerCase() + parte.slice(1))
    .join('.')

/** Pone los errores 400 del servidor en los campos del formulario. Devuelve true si hubo errores de campo. */
export function aplicarErroresServidor<T extends FieldValues>(error: unknown, setError: UseFormSetError<T>): boolean {
  const errores = obtenerProblema(error)?.errors
  if (!errores) return false
  Object.entries(errores).forEach(([clave, mensajes]) =>
    setError(aRutaCampo(clave) as Path<T>, { type: 'servidor', message: mensajes[0] }),
  )
  return true
}
