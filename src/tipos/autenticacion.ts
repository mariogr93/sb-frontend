export type IniciarSesionSolicitud = { nombreUsuario: string; contrasena: string }

export type InicioSesionRespuesta = {
  token: string
  fechaExpiracion: string
  nombreUsuario: string
  nombreCompleto: string
  rol: 'Admin' | 'Usuario'
}
