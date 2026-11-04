import { clienteHttp } from './clienteHttp'
import type { ResultadoPaginado } from '../tipos/comun'
import type {
  EntidadGubernamental,
  FiltroEntidadesGubernamentales,
  GuardarEntidadGubernamentalSolicitud,
} from '../tipos/catalogos'

const RUTA = '/entidades-gubernamentales'

export const entidadesApi = {
  listar: async (filtro: FiltroEntidadesGubernamentales) =>
    (await clienteHttp.get<ResultadoPaginado<EntidadGubernamental>>(RUTA, { params: filtro })).data,
  crear: async (solicitud: GuardarEntidadGubernamentalSolicitud) =>
    (await clienteHttp.post<EntidadGubernamental>(RUTA, solicitud)).data,
  actualizar: async (id: string, solicitud: GuardarEntidadGubernamentalSolicitud) =>
    (await clienteHttp.put<EntidadGubernamental>(`${RUTA}/${id}`, solicitud)).data,
  desactivar: async (id: string) => {
    await clienteHttp.delete(`${RUTA}/${id}`)
  },
}
