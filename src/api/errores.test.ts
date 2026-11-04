import { AxiosError, type AxiosResponse } from 'axios'
import { aplicarErroresServidor, mensajeError, mensajeErrorDetallado } from './errores'

function crearError(estado: number, datos: unknown) {
  return new AxiosError('fallo', undefined, undefined, undefined, { status: estado, data: datos } as AxiosResponse)
}

test('MensajeUsaDetalleLuegoTituloLuegoTextoPorDefecto', () => {
  expect(mensajeError(crearError(409, { detail: 'Ya existe.', title: 'Conflicto.' }))).toBe('Ya existe.')
  expect(mensajeError(crearError(409, { title: 'Conflicto.' }))).toBe('Conflicto.')
  expect(mensajeError(new Error('red'))).toBe('No se pudo conectar con el servidor.')
})

test('DemasiadasSolicitudesTieneMensajePropio', () => {
  expect(mensajeError(crearError(429, {}))).toContain('Demasiadas solicitudes')
})

test('ErroresDeCampoAnidadosSeAplicanEnMinusculaInicial', () => {
  const setError = vi.fn()
  const error = crearError(400, { errors: { 'Compensacion.SueldoPorHora': ['Debe ser mayor que 0.'], Cedula: ['Formato inválido.'] } })

  const hubo = aplicarErroresServidor(error, setError)

  expect(hubo).toBe(true)
  expect(setError).toHaveBeenCalledWith('compensacion.sueldoPorHora', { type: 'servidor', message: 'Debe ser mayor que 0.' })
  expect(setError).toHaveBeenCalledWith('cedula', { type: 'servidor', message: 'Formato inválido.' })
})

test('MensajeDetalladoUneElPrimerErrorDeCadaCampoOUsaElMensajeGeneral', () => {
  const conCampos = crearError(400, { errors: { FechaInicioSemana: ['Debe ser lunes.', 'Otra.'], Otro: ['Dato inválido.'] } })

  expect(mensajeErrorDetallado(conCampos)).toBe('Debe ser lunes. Dato inválido.')
  expect(mensajeErrorDetallado(crearError(409, { detail: 'Ya existe.' }))).toBe('Ya existe.')
})

test('ClavesQueNoSonCamposVanAUnaAlertaGeneralEnVezDePerderse', () => {
  const setError = vi.fn()
  const error = crearError(400, { errors: { '$.compensacion.salarioSemanal': ['Valor inválido.'], Cedula: ['Formato inválido.'] } })

  const hubo = aplicarErroresServidor(error, setError, ['cedula'])

  expect(hubo).toBe(true)
  expect(setError).toHaveBeenCalledWith('cedula', { type: 'servidor', message: 'Formato inválido.' })
  expect(setError).toHaveBeenCalledWith('root', { type: 'servidor', message: 'Valor inválido.' })
  expect(setError).toHaveBeenCalledTimes(2)
})

test('SinErroresDeCampoDevuelveFalso', () => {
  expect(aplicarErroresServidor(crearError(409, { title: 'Conflicto.' }), vi.fn())).toBe(false)
})
