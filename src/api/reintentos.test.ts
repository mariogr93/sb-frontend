import { AxiosError, type AxiosResponse } from 'axios'
import { debeReintentar } from './reintentos'

const errorHttp = (estado: number) =>
  new AxiosError('fallo', String(estado), undefined, undefined, { status: estado, data: {} } as AxiosResponse)

test.each([403, 404, 409, 422, 429])('NoReintentaUnError%s', (estado) => {
  expect(debeReintentar(0, errorHttp(estado))).toBe(false)
})

test.each([500, 502, 503])('ReintentaUnaVezUnError%s', (estado) => {
  expect(debeReintentar(0, errorHttp(estado))).toBe(true)
  expect(debeReintentar(1, errorHttp(estado))).toBe(false)
})

test('ReintentaUnaVezUnFalloDeRed', () => {
  const sinRespuesta = new AxiosError('Network Error')

  expect(debeReintentar(0, sinRespuesta)).toBe(true)
  expect(debeReintentar(1, sinRespuesta)).toBe(false)
})

test('ReintentaUnaVezUnErrorQueNoEsDeAxios', () => {
  expect(debeReintentar(0, new Error('boom'))).toBe(true)
})
