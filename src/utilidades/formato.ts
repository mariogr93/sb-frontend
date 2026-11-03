const moneda = new Intl.NumberFormat('es-DO', { style: 'currency', currency: 'DOP' })
const fecha = new Intl.DateTimeFormat('es-DO', { dateStyle: 'medium' })

export const formatearMoneda = (valor: number) => moneda.format(valor)
export const formatearFecha = (valor: string) => fecha.format(new Date(valor))
