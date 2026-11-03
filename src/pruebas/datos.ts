import type { Empleado } from '../tipos/empleados'

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
