import { z } from 'zod'
import { CAMPOS_POR_TIPO, TIPOS_EMPLEADO, type Empleado } from '../../tipos/empleados'

// Mismos límites que el servidor (el servidor valida igual).
const MONTO_MAXIMO = 99_999_999.99
const HORAS_MAXIMAS = 168
const TARIFA_MAXIMA = 1
const LONGITUD_MAXIMA_NOMBRE = 100
const PATRON_CEDULA = /^\d{3}-\d{7}-\d$/
const PATRON_NOMBRE = /^\p{L}[\p{L} '.-]*$/u
const REQUERIDO = 'Este campo es obligatorio.'
const MENSAJE_MONTO = 'Debe estar entre 0 y 99,999,999.99.'

const nombre = z
  .string()
  .trim()
  .min(1, REQUERIDO)
  .max(LONGITUD_MAXIMA_NOMBRE, `Máximo ${LONGITUD_MAXIMA_NOMBRE} caracteres.`)
  .regex(PATRON_NOMBRE, 'Solo letras, espacios, apóstrofo, punto o guion.')

const monto = z.number().min(0, MENSAJE_MONTO).max(MONTO_MAXIMO, MENSAJE_MONTO).optional()

export const esquemaEmpleado = z
  .object({
    primerNombre: nombre,
    apellidoPaterno: nombre,
    cedula: z.string().trim().regex(PATRON_CEDULA, 'Formato ###-#######-#.'),
    departamentoId: z.string().min(1, REQUERIDO),
    tipo: z.enum(TIPOS_EMPLEADO),
    compensacion: z.object({
      salarioSemanal: monto,
      sueldoPorHora: monto,
      horasTrabajadas: z.number().min(0, 'No puede ser negativo.').max(HORAS_MAXIMAS, `Máximo ${HORAS_MAXIMAS} horas.`).optional(),
      ventasBrutas: monto,
      tarifaComision: z
        .number()
        .gt(0, 'Debe ser mayor que 0.')
        .max(TARIFA_MAXIMA, 'Máximo 1 (100 %).')
        .optional(),
      salarioBase: monto,
    }),
  })
  .superRefine((datos, contexto) => {
    // Solo exige los campos del tipo elegido.
    CAMPOS_POR_TIPO[datos.tipo].forEach((campo) => {
      if (datos.compensacion[campo] === undefined) {
        contexto.addIssue({ code: 'custom', path: ['compensacion', campo], message: REQUERIDO })
      }
    })
  })

export type DatosFormularioEmpleado = z.infer<typeof esquemaEmpleado>

/** Valores iniciales del formulario a partir de un empleado existente (null → undefined). */
export function aDatosFormulario(empleado: Empleado): DatosFormularioEmpleado {
  const { compensacion } = empleado
  return {
    primerNombre: empleado.primerNombre,
    apellidoPaterno: empleado.apellidoPaterno,
    cedula: empleado.cedula,
    departamentoId: empleado.departamentoId,
    tipo: empleado.tipo,
    compensacion: {
      salarioSemanal: compensacion.salarioSemanal ?? undefined,
      sueldoPorHora: compensacion.sueldoPorHora ?? undefined,
      horasTrabajadas: compensacion.horasTrabajadas ?? undefined,
      ventasBrutas: compensacion.ventasBrutas ?? undefined,
      tarifaComision: compensacion.tarifaComision ?? undefined,
      salarioBase: compensacion.salarioBase ?? undefined,
    },
  }
}
