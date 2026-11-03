import { Outlet, useMatches } from 'react-router-dom'
import { BarraLateral } from './BarraLateral'
import estilos from './Layout.module.css'

type DatosRuta = { titulo?: string }

export function Layout() {
  const coincidencias = useMatches()
  const titulo = (coincidencias.at(-1)?.handle as DatosRuta | undefined)?.titulo ?? ''

  return (
    <div className={estilos.contenedor}>
      <BarraLateral />
      <div className={estilos.principal}>
        <header className={estilos.encabezado}>
          <h1>{titulo}</h1>
        </header>
        <main className={estilos.area}>
          <section className={estilos.tarjeta}>
            <Outlet />
          </section>
        </main>
      </div>
    </div>
  )
}
