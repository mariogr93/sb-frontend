import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { departamentosApi } from '../../api/departamentosApi'
import type { GuardarDepartamentoSolicitud } from '../../tipos/catalogos'

export const useDepartamentos = (incluirInactivos = false) =>
  useQuery({
    queryKey: ['departamentos', incluirInactivos],
    queryFn: () => departamentosApi.listar(incluirInactivos),
  })

export function useGuardarDepartamento(id?: string) {
  const cliente = useQueryClient()
  return useMutation({
    mutationFn: (solicitud: GuardarDepartamentoSolicitud) =>
      id ? departamentosApi.actualizar(id, solicitud) : departamentosApi.crear(solicitud),
    onSuccess: () => cliente.invalidateQueries(),
  })
}

export function useDesactivarDepartamento() {
  const cliente = useQueryClient()
  return useMutation({ mutationFn: departamentosApi.desactivar, onSuccess: () => cliente.invalidateQueries() })
}
