import { clienteHttp } from './clienteHttp'
import type {
  ActualizarUsuarioSolicitud,
  CambiarContrasenaSolicitud,
  CrearUsuarioSolicitud,
  Usuario,
} from '../tipos/usuarios'

const RUTA = '/usuarios'

export const usuariosApi = {
  listar: async () => (await clienteHttp.get<Usuario[]>(RUTA)).data,
  crear: async (solicitud: CrearUsuarioSolicitud) => (await clienteHttp.post<Usuario>(RUTA, solicitud)).data,
  actualizar: async (id: string, solicitud: ActualizarUsuarioSolicitud) =>
    (await clienteHttp.put<Usuario>(`${RUTA}/${id}`, solicitud)).data,
  cambiarContrasena: async (id: string, solicitud: CambiarContrasenaSolicitud) => {
    await clienteHttp.put(`${RUTA}/${id}/contrasena`, solicitud)
  },
  desactivar: async (id: string) => {
    await clienteHttp.delete(`${RUTA}/${id}`)
  },
}
