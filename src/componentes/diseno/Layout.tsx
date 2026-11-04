import { useEffect, useRef, useState } from 'react'
import { Outlet, useMatches } from 'react-router-dom'
import { BarraLateral } from './BarraLateral'
import estilos from './Layout.module.css'

type DatosRuta = { titulo?: string }

export function Layout() {
  const coincidencias = useMatches()
  const titulo = (coincidencias.at(-1)?.handle as DatosRuta | undefined)?.titulo ?? ''
  const [menuAbierto, setMenuAbierto] = useState(false)
  const botonMenu = useRef<HTMLButtonElement>(null)

  // Escape cierra el menú móvil y devuelve el foco al botón que lo abre.
  useEffect(() => {
    if (!menuAbierto) return
    const alPresionarTecla = (evento: KeyboardEvent) => {
      if (evento.key !== 'Escape') return
      setMenuAbierto(false)
      botonMenu.current?.focus()
    }
    document.addEventListener('keydown', alPresionarTecla)
    return () => document.removeEventListener('keydown', alPresionarTecla)
  }, [menuAbierto])

  return (
    <div className={estilos.contenedor}>
      <BarraLateral abierta={menuAbierto} alCerrar={() => setMenuAbierto(false)} />
      {menuAbierto && <div className={estilos.fondoMenu} onClick={() => setMenuAbierto(false)} aria-hidden="true" />}
      <div className={estilos.principal}>
        <header className={estilos.encabezado}>
          <button
            ref={botonMenu}
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
