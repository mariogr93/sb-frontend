import { useState } from 'react'
import { Outlet, useMatches } from 'react-router-dom'
import { BarraLateral } from './BarraLateral'
import estilos from './Layout.module.css'

type DatosRuta = { titulo?: string }

export function Layout() {
  const coincidencias = useMatches()
  const titulo = (coincidencias.at(-1)?.handle as DatosRuta | undefined)?.titulo ?? ''
  const [menuAbierto, setMenuAbierto] = useState(false)

  return (
    <div className={estilos.contenedor}>
      <BarraLateral abierta={menuAbierto} alCerrar={() => setMenuAbierto(false)} />
      {menuAbierto && <div className={estilos.fondoMenu} onClick={() => setMenuAbierto(false)} aria-hidden="true" />}
      <div className={estilos.principal}>
        <header className={estilos.encabezado}>
          <button
            type="button"
            className={estilos.botonMenu}
            aria-label="Abrir menú"
            aria-expanded={menuAbierto}
            onClick={() => setMenuAbierto((abierto) => !abierto)}
          >
            ☰
          </button>
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
