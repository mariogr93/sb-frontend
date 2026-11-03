export const ROLES = ['Admin', 'Usuario'] as const
export type Rol = (typeof ROLES)[number]

export type Usuario = {
  id: string
  nombreUsuario: string
  nombreCompleto: string
  rol: Rol
  estaActivo: boolean
  fechaCreacion: string
}

export type CrearUsuarioSolicitud = {
  nombreUsuario: string
  nombreCompleto: string
  contrasena: string
  rol: Rol
}

export type ActualizarUsuarioSolicitud = { nombreCompleto: string; rol: Rol; estaActivo: boolean }

export type CambiarContrasenaSolicitud = { contrasenaNueva: string }
