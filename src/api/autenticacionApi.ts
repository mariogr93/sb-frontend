import { clienteHttp } from './clienteHttp'
import type { IniciarSesionSolicitud, InicioSesionRespuesta } from '../tipos/autenticacion'

export const autenticacionApi = {
  iniciarSesion: async (solicitud: IniciarSesionSolicitud) =>
    (await clienteHttp.post<InicioSesionRespuesta>('/autenticacion/iniciar-sesion', solicitud)).data,
}
