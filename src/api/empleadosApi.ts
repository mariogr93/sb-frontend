import { clienteHttp } from './clienteHttp'
import type { ResultadoPaginado } from '../tipos/comun'
import type { Empleado, FiltroEmpleados, GuardarEmpleadoSolicitud } from '../tipos/empleados'

const RUTA = '/empleados'

export const empleadosApi = {
  listar: async (filtro: FiltroEmpleados) => (await clienteHttp.get<ResultadoPaginado<Empleado>>(RUTA, { params: filtro })).data,
  obtener: async (id: string) => (await clienteHttp.get<Empleado>(`${RUTA}/${id}`)).data,
  crear: async (solicitud: GuardarEmpleadoSolicitud) => (await clienteHttp.post<Empleado>(RUTA, solicitud)).data,
  actualizar: async (id: string, solicitud: GuardarEmpleadoSolicitud) =>
    (await clienteHttp.put<Empleado>(`${RUTA}/${id}`, solicitud)).data,
  desactivar: async (id: string) => {
    await clienteHttp.delete(`${RUTA}/${id}`)
  },
  activar: async (id: string) => {
    await clienteHttp.put(`${RUTA}/${id}/activar`)
  },
}
