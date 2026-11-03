import { clienteHttp } from './clienteHttp'
import type { Departamento, GuardarDepartamentoSolicitud } from '../tipos/catalogos'

const RUTA = '/departamentos'

export const departamentosApi = {
  listar: async (incluirInactivos = false) =>
    (await clienteHttp.get<Departamento[]>(RUTA, { params: { incluirInactivos } })).data,
  crear: async (solicitud: GuardarDepartamentoSolicitud) => (await clienteHttp.post<Departamento>(RUTA, solicitud)).data,
  actualizar: async (id: string, solicitud: GuardarDepartamentoSolicitud) =>
    (await clienteHttp.put<Departamento>(`${RUTA}/${id}`, solicitud)).data,
  desactivar: async (id: string) => {
    await clienteHttp.delete(`${RUTA}/${id}`)
  },
}
