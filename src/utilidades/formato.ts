const moneda = new Intl.NumberFormat('es-DO', { style: 'currency', currency: 'DOP' })
const fecha = new Intl.DateTimeFormat('es-DO', { dateStyle: 'medium' })

export const formatearMoneda = (valor: number) => moneda.format(valor)

/** Instante (ISO con hora, UTC): se muestra en la zona del navegador. */
export const formatearFecha = (valor: string) => fecha.format(new Date(valor))

/** Fecha de calendario ("2026-10-26"): sin zona horaria, para que no se corra un día. */
export function formatearFechaCalendario(valor: string): string {
  const [anio, mes, dia] = valor.split('-').map(Number)
  return fecha.format(new Date(anio, mes - 1, dia))
}
