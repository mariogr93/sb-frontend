export type Departamento = { id: string; nombre: string; estaActivo: boolean }

export type GuardarDepartamentoSolicitud = { nombre: string }

export type EntidadGubernamental = {
  id: string
  nombre: string
  categoria: string
  poderDelEstado: string
  sector: string
  estaActiva: boolean
}

export type GuardarEntidadGubernamentalSolicitud = {
  nombre: string
  categoria: string
  poderDelEstado: string
  sector: string
}

export type FiltroEntidadesGubernamentales = {
  nombre?: string
  sector?: string
  poderDelEstado?: string
  incluirInactivas?: boolean
  pagina: number
  tamanoPagina: number
}
