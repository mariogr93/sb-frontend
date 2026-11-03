import { formatearFecha, formatearFechaCalendario, formatearMoneda } from './formato'

test('ZonaDePruebasEsLaDeRepublicaDominicana', () => {
  // UTC−4: sin esto las pruebas de fechas no detectarían el corrimiento de un día.
  expect(new Date(2026, 0, 1).getTimezoneOffset()).toBe(240)
})

test('MonedaEnPesosDominicanosConMilesYDosDecimales', () => {
  expect(formatearMoneda(23750)).toMatch(/RD\$\s?23,750\.00/)
})

test('FechaDeCalendarioNoSeCorreUnDia', () => {
  const texto = formatearFechaCalendario('2026-10-26')

  expect(texto).toContain('26')
  expect(texto).toMatch(/oct/i)
})

test('InstanteUtcSeMuestraEnLaZonaLocal', () => {
  // 18:00 UTC = 14:00 en Santo Domingo: mismo día.
  expect(formatearFecha('2026-10-26T18:00:00Z')).toContain('26')
  // Medianoche UTC = 20:00 del día anterior: por eso no sirve para fechas de calendario.
  expect(formatearFecha('2026-10-26T00:00:00Z')).toContain('25')
})
