export type ResultadoPaginado<T> = {
  elementos: T[]
  pagina: number
  tamanoPagina: number
  totalElementos: number
  totalPaginas: number
}

export type LineaDesglosePago = { concepto: string; formula: string; monto: number }

export type DesglosePago = { lineas: LineaDesglosePago[]; total: number }
