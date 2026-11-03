import { useQuery } from '@tanstack/react-query'
import { departamentosApi } from '../../api/departamentosApi'

export const useDepartamentos = (incluirInactivos = false) =>
  useQuery({
    queryKey: ['departamentos', incluirInactivos],
    queryFn: () => departamentosApi.listar(incluirInactivos),
  })
