import { clienteHttp } from './clienteHttp'
import type { ResultadoPaginado } from '../tipos/comun'
import type { GuardarNominaSolicitud, Nomina, NominaResumen, ReporteNominaSemanal } from '../tipos/nominas'

const RUTA = '/reportes-nomina'

export const nominasApi = {
  reporteSemanal: async (departamentoId?: string) =>
    (await clienteHttp.get<ReporteNominaSemanal>(`${RUTA}/semanal`, { params: { departamentoId } })).data,
  guardar: async (solicitud: GuardarNominaSolicitud) => (await clienteHttp.post<Nomina>(`${RUTA}/nominas`, solicitud)).data,
  listar: async (pagina: number, tamanoPagina: number) =>
    (await clienteHttp.get<ResultadoPaginado<NominaResumen>>(`${RUTA}/nominas`, { params: { pagina, tamanoPagina } })).data,
  obtener: async (id: string) => (await clienteHttp.get<Nomina>(`${RUTA}/nominas/${id}`)).data,
}
