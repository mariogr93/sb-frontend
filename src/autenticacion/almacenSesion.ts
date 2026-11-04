import type { InicioSesionRespuesta } from '../tipos/autenticacion'

const CLAVE = 'sb-sesion'

// sessionStorage: la sesión termina al cerrar la pestaña.
export const almacenSesion = {
  leer(): InicioSesionRespuesta | null {
    try {
      const valor = sessionStorage.getItem(CLAVE)
      if (!valor) return null
      const sesion = JSON.parse(valor) as InicioSesionRespuesta
      return new Date(sesion.fechaExpiracion) > new Date() ? sesion : null
    } catch {
      return null
    }
  },
  guardar: (sesion: InicioSesionRespuesta) => sessionStorage.setItem(CLAVE, JSON.stringify(sesion)),
  borrar: () => sessionStorage.removeItem(CLAVE),
}
