import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { entidadesApi } from '../../api/entidadesApi'
import type { FiltroEntidadesGubernamentales, GuardarEntidadGubernamentalSolicitud } from '../../tipos/catalogos'

export const useEntidades = (filtro: FiltroEntidadesGubernamentales) =>
  useQuery({
    queryKey: ['entidades', filtro],
    queryFn: () => entidadesApi.listar(filtro),
    placeholderData: keepPreviousData,
  })

export function useGuardarEntidad(id?: string) {
  const cliente = useQueryClient()
  return useMutation({
    mutationFn: (solicitud: GuardarEntidadGubernamentalSolicitud) =>
      id ? entidadesApi.actualizar(id, solicitud) : entidadesApi.crear(solicitud),
    onSuccess: () => cliente.invalidateQueries(),
  })
}

export function useActivarEntidad() {
  const cliente = useQueryClient()
  return useMutation({ mutationFn: entidadesApi.activar, onSuccess: () => cliente.invalidateQueries() })
}

export function useDesactivarEntidad() {
  const cliente = useQueryClient()
  return useMutation({ mutationFn: entidadesApi.desactivar, onSuccess: () => cliente.invalidateQueries() })
}
