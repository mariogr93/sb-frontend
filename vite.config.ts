import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: './src/pruebas/configuracion.ts',
    globals: true,
    // Zona de la República Dominicana: las pruebas de fechas dependen de ella.
    env: { TZ: 'America/Santo_Domingo' },
  },
})
