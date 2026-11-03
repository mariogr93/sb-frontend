import { vi } from 'vitest'
import { departamentosApi } from '../api/departamentosApi'
import { empleadosApi } from '../api/empleadosApi'
import { entidadesApi } from '../api/entidadesApi'
import { nominasApi } from '../api/nominasApi'
import { usuariosApi } from '../api/usuariosApi'
import { crearReporte } from './datos'

const PAGINA_VACIA = { elementos: [], pagina: 1, tamanoPagina: 20, totalElementos: 0, totalPaginas: 0 }

/**
 * Respuestas vacías para todas las APIs que alcanzan las rutas completas.
 * Cada archivo de prueba debe declarar antes su `vi.mock` de esos módulos.
 */
export function simularApisVacias() {
  vi.mocked(departamentosApi.listar).mockResolvedValue([])
  vi.mocked(empleadosApi.listar).mockResolvedValue(PAGINA_VACIA)
  vi.mocked(entidadesApi.listar).mockResolvedValue(PAGINA_VACIA)
  vi.mocked(nominasApi.reporteSemanal).mockResolvedValue(crearReporte())
  vi.mocked(nominasApi.listar).mockResolvedValue(PAGINA_VACIA)
  vi.mocked(usuariosApi.listar).mockResolvedValue([])
}
