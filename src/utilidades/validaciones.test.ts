import { tieneMaximoDecimales } from './validaciones'
import { rutaInterna } from './rutas'

test.each([
  [500.01, 2, true],
  [1500.55, 2, true],
  [1500.5, 2, true],
  [500.005, 2, false],
  [40.125, 3, true],
  [40.1255, 3, false],
  [0.123456, 6, true],
  [0.1234567, 6, false],
  [1e-7, 6, false],
])('DecimalesPermitidos_%s_con_%s_es_%s', (valor, decimales, esperado) => {
  expect(tieneMaximoDecimales(valor, decimales)).toBe(esperado)
})

test.each([
  ['/empleados', '/empleados'],
  ['/nominas/abc', '/nominas/abc'],
  ['//sitio-malo.com', '/'],
  ['https://sitio-malo.com', '/'],
  ['empleados', '/'],
  [undefined, '/'],
  [42, '/'],
])('RutaInterna_%s_devuelve_%s', (ruta, esperada) => {
  expect(rutaInterna(ruta)).toBe(esperada)
})
