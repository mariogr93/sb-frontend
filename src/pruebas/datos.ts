import type { Empleado } from '../tipos/empleados'
import type { ReporteNominaSemanal } from '../tipos/nominas'

export function crearReporte(): ReporteNominaSemanal {
  return {
    fechaGeneracion: '2026-11-02T14:00:00Z',
    pagos: [
      {
        empleadoId: 'e1',
        nombreCompleto: 'Ana Pérez',
        tipoEmpleado: 'PorHoras',
        nombreDepartamento: 'Ventas',
        desglose: {
          lineas: [
            { concepto: 'Horas regulares', formula: '500 × 40', monto: 20000 },
            { concepto: 'Horas extra', formula: '500 × 1.5 × 5', monto: 3750 },
          ],
          total: 23750,
        },
      },
    ],
    totalesPorTipo: [{ tipoEmpleado: 'PorHoras', cantidadEmpleados: 1, montoTotal: 23750 }],
    cantidadEmpleados: 1,
    montoTotal: 23750,
  }
}

export function crearEmpleado(cambios: Partial<Empleado> = {}): Empleado {
  return {
    id: 'e1',
    primerNombre: 'Ana',
    apellidoPaterno: 'Pérez',
    nombreCompleto: 'Ana Pérez',
    cedula: '402-0000001-5',
    departamentoId: 'd1',
    nombreDepartamento: 'Ventas',
    tipo: 'PorHoras',
    estado: 'Activo',
    compensacion: { sueldoPorHora: 500, horasTrabajadas: 45 },
    pagoSemanal: {
      lineas: [
        { concepto: 'Horas regulares', formula: '500 × 40', monto: 20000 },
        { concepto: 'Horas extra', formula: '500 × 1.5 × 5', monto: 3750 },
      ],
      total: 23750,
    },
    fechaCreacion: '2026-11-02T14:00:00Z',
    fechaActualizacion: null,
    ...cambios,
  }
}
