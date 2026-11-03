import { formatearMoneda } from './formato'

test('MonedaConMilesYDosDecimales', () => {
  expect(formatearMoneda(23750)).toMatch(/23,750\.00/)
})
