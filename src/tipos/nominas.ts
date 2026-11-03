import type { DesglosePago } from './comun'
import type { TipoEmpleado } from './empleados'

export type PagoEmpleado = {
  empleadoId: string
  nombreCompleto: string
  tipoEmpleado: TipoEmpleado
  nombreDepartamento: string
  desglose: DesglosePago
}

export type TotalTipoEmpleado = { tipoEmpleado: TipoEmpleado; cantidadEmpleados: number; montoTotal: number }

export type ReporteNominaSemanal = {
  fechaGeneracion: string
  pagos: PagoEmpleado[]
  totalesPorTipo: TotalTipoEmpleado[]
  cantidadEmpleados: number
  montoTotal: number
}

export type NominaResumen = {
  id: string
  fechaInicioSemana: string
  fechaCreacion: string
  creadoPor: string
  cantidadEmpleados: number
  montoTotal: number
}

export type Nomina = {
  id: string
  fechaInicioSemana: string
  fechaCreacion: string
  creadoPor: string
  montoTotal: number
  pagos: PagoEmpleado[]
}

export type GuardarNominaSolicitud = { fechaInicioSemana: string }
