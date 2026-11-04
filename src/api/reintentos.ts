import axios from 'axios'

const MAXIMO_REINTENTOS = 1
const PRIMER_ESTADO_DE_SERVIDOR = 500

/**
 * Las consultas reintentan una vez solo ante fallos de red o 5xx.
 * Un 4xx (403, 404, 422, 429) no cambia al repetir, y repetir un 429 gasta más cuota.
 */
export function debeReintentar(intentos: number, error: unknown): boolean {
  const estado = axios.isAxiosError(error) ? error.response?.status : undefined
  const esErrorDeCliente = estado !== undefined && estado < PRIMER_ESTADO_DE_SERVIDOR
  return intentos < MAXIMO_REINTENTOS && !esErrorDeCliente
}
