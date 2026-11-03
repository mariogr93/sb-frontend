import { Boton } from './Boton'
import estilos from './Paginacion.module.css'

type Props = { pagina: number; totalPaginas: number; totalElementos: number; alCambiar: (pagina: number) => void }

export function Paginacion({ pagina, totalPaginas, totalElementos, alCambiar }: Props) {
  return (
    <nav className={estilos.paginacion} aria-label="Paginación">
      <span>
        {totalElementos} registros · Página {pagina} de {Math.max(totalPaginas, 1)}
      </span>
      <div>
        <Boton variante="secundario" disabled={pagina <= 1} onClick={() => alCambiar(pagina - 1)}>
          Anterior
        </Boton>
        <Boton variante="secundario" disabled={pagina >= totalPaginas} onClick={() => alCambiar(pagina + 1)}>
          Siguiente
        </Boton>
      </div>
    </nav>
  )
}
