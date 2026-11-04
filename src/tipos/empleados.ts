import type { DesglosePago } from './comun'

export const TIPOS_EMPLEADO = ['Asalariado', 'PorHoras', 'PorComision', 'AsalariadoPorComision'] as const
export type TipoEmpleado = (typeof TIPOS_EMPLEADO)[number]
export type EstadoEmpleado = 'Activo' | 'Inactivo'

export type CompensacionEmpleado = {
  salarioSemanal?: number | null
  sueldoPorHora?: number | null
  horasTrabajadas?: number | null
  ventasBrutas?: number | null
  tarifaComision?: number | null
  salarioBase?: number | null
}
export type CampoCompensacion = keyof CompensacionEmpleado

// Única fuente de verdad de qué campos pide cada tipo (tipo nuevo = una línea).
export const CAMPOS_POR_TIPO: Record<TipoEmpleado, CampoCompensacion[]> = {
  Asalariado: ['salarioSemanal'],
  PorHoras: ['sueldoPorHora', 'horasTrabajadas'],
  PorComision: ['ventasBrutas', 'tarifaComision'],
  AsalariadoPorComision: ['ventasBrutas', 'tarifaComision', 'salarioBase'],
}

export const ETIQUETAS_TIPO: Record<TipoEmpleado, string> = {
  Asalariado: 'Asalariado',
  PorHoras: 'Por horas',
  PorComision: 'Por comisión',
  AsalariadoPorComision: 'Asalariado por comisión',
}

export const ETIQUETAS_CAMPO: Record<CampoCompensacion, string> = {
  salarioSemanal: 'Salario semanal',
  sueldoPorHora: 'Sueldo por hora',
  horasTrabajadas: 'Horas trabajadas',
  ventasBrutas: 'Ventas brutas',
  tarifaComision: 'Tarifa de comisión',
  salarioBase: 'Salario base',
}

export type Empleado = {
  id: string
  primerNombre: string
  apellidoPaterno: string
  nombreCompleto: string
  cedula: string
  departamentoId: string
  nombreDepartamento: string
  tipo: TipoEmpleado
  estado: EstadoEmpleado
  compensacion: CompensacionEmpleado
  pagoSemanal: DesglosePago
  fechaCreacion: string
  fechaActualizacion: string | null
}

export type GuardarEmpleadoSolicitud = {
  primerNombre: string
  apellidoPaterno: string
  cedula: string
  departamentoId: string
  tipo: TipoEmpleado
  compensacion: CompensacionEmpleado
}

export type FiltroEmpleados = {
  nombre?: string
  departamentoId?: string
  estado?: EstadoEmpleado
  tipo?: TipoEmpleado
  pagina: number
  tamanoPagina: number
}
