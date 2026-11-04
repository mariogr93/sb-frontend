import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { nominasApi } from '../../api/nominasApi'

export const useReporteSemanal = (departamentoId?: string) =>
  useQuery({
    queryKey: ['reporte-semanal', departamentoId ?? null],
    queryFn: () => nominasApi.reporteSemanal(departamentoId),
  })

export const useNominas = (pagina: number, tamanoPagina: number) =>
  useQuery({
    queryKey: ['nominas', 'lista', pagina, tamanoPagina],
    queryFn: () => nominasApi.listar(pagina, tamanoPagina),
    placeholderData: keepPreviousData,
  })

export const useNomina = (id?: string) =>
  useQuery({ queryKey: ['nominas', 'detalle', id ?? ''], queryFn: () => nominasApi.obtener(id!), enabled: Boolean(id) })

export function useGuardarNomina() {
  const cliente = useQueryClient()
  return useMutation({ mutationFn: nominasApi.guardar, onSuccess: () => cliente.invalidateQueries() })
}
