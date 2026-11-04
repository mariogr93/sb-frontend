import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { empleadosApi } from '../../api/empleadosApi'
import type { FiltroEmpleados, GuardarEmpleadoSolicitud } from '../../tipos/empleados'

export const clavesEmpleados = {
  lista: (filtro: FiltroEmpleados) => ['empleados', 'lista', filtro] as const,
  detalle: (id: string) => ['empleados', 'detalle', id] as const,
}

export const useEmpleados = (filtro: FiltroEmpleados) =>
  useQuery({
    queryKey: clavesEmpleados.lista(filtro),
    queryFn: () => empleadosApi.listar(filtro),
    placeholderData: keepPreviousData,
  })

export const useEmpleado = (id?: string) =>
  useQuery({
    queryKey: clavesEmpleados.detalle(id ?? ''),
    queryFn: () => empleadosApi.obtener(id!),
    enabled: Boolean(id),
  })

export function useGuardarEmpleado(id?: string) {
  const cliente = useQueryClient()
  return useMutation({
    mutationFn: (solicitud: GuardarEmpleadoSolicitud) =>
      id ? empleadosApi.actualizar(id, solicitud) : empleadosApi.crear(solicitud),
    // Refresca listas, detalle, reporte e inicio (el pago cambia).
    onSuccess: () => cliente.invalidateQueries(),
  })
}

export function useActivarEmpleado() {
  const cliente = useQueryClient()
  return useMutation({
    mutationFn: empleadosApi.activar,
    onSuccess: () => cliente.invalidateQueries(),
  })
}

export function useDesactivarEmpleado() {
  const cliente = useQueryClient()
  return useMutation({
    mutationFn: empleadosApi.desactivar,
    onSuccess: () => cliente.invalidateQueries(),
  })
}
