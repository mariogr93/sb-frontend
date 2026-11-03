import '@testing-library/jest-dom/vitest'
import { afterEach, vi } from 'vitest'

// Sin estado compartido entre pruebas: sesión y historial de llamadas de los mocks.
afterEach(() => {
  sessionStorage.clear()
  vi.clearAllMocks()
})
