import { useEffect, useRef } from 'react'

const SELECTOR_ENFOCABLE = 'input, select, textarea, button, a[href]'

/** Al abrir el diálogo enfoca su primer control; al cerrarlo devuelve el foco a quien lo abrió. */
export function useFocoEnDialogo<T extends HTMLElement>() {
  const referencia = useRef<T>(null)

  useEffect(() => {
    const anterior = document.activeElement as HTMLElement | null
    const primero = referencia.current?.querySelector<HTMLElement>(SELECTOR_ENFOCABLE)
    ;(primero ?? referencia.current)?.focus()
    return () => anterior?.focus()
  }, [])

  return referencia
}
