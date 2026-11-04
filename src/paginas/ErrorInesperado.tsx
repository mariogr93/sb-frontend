import { useRouteError } from 'react-router-dom'
import estilos from './ErrorInesperado.module.css'

/** Pantalla para errores de renderizado: evita la pantalla en inglés por defecto del router. */
export function ErrorInesperado() {
  const error = useRouteError()
  if (import.meta.env.DEV) console.error(error)

  return (
    <main className={estilos.pagina}>
      <h1>Ocurrió un error inesperado</h1>
      <p>Recargue la página. Si el problema continúa, vuelva a iniciar sesión.</p>
      <a href="/">Ir al inicio</a>
    </main>
  )
}
