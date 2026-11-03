import type { ReactNode } from 'react'
import estilos from './Confirmacion.module.css'

type Props = { titulo: string; children: ReactNode }

/** Ventana modal para formularios. Cerrar = botón Cancelar del formulario hijo. */
export function Modal({ titulo, children }: Props) {
  return (
    <div className={estilos.fondo}>
      <div role="dialog" aria-modal="true" aria-label={titulo} className={estilos.caja}>
        <h2>{titulo}</h2>
        {children}
      </div>
    </div>
  )
}
