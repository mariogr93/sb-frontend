// Mismos límites que el servidor (ConstantesValidacion); el servidor valida igual.
export const REQUERIDO = 'Este campo es obligatorio.'
export const LONGITUD_MAXIMA_NOMBRE_PERSONA = 100
export const PATRON_NOMBRE_PERSONA = /^\p{L}[\p{L} '.-]*$/u
export const MENSAJE_NOMBRE_PERSONA = 'Solo letras, espacios, apóstrofo, punto o guion.'

export const DECIMALES_MONTO = 2
export const DECIMALES_HORAS = 3
export const DECIMALES_TARIFA = 6

const TOLERANCIA_DECIMAL = 1e-9

/** True si el número tiene a lo sumo `decimales` decimales (los ceros finales no cuentan, como en el servidor). */
export function tieneMaximoDecimales(valor: number, decimales: number): boolean {
  const escalado = valor * 10 ** decimales
  return Math.abs(escalado - Math.round(escalado)) < TOLERANCIA_DECIMAL
}

export const mensajeMaximoDecimales = (decimales: number) => `Máximo ${decimales} decimales.`
