import type { ReactNode } from 'react'
import estilos from './Confirmacion.module.css'
import { useFocoEnDialogo } from './useFocoEnDialogo'

type Props = { titulo: string; children: ReactNode }

/** Ventana modal para formularios. Cerrar = botón Cancelar del formulario hijo. */
export function Modal({ titulo, children }: Props) {
  const referencia = useFocoEnDialogo<HTMLDivElement>()

  return (
    <div className={estilos.fondo}>
      <div ref={referencia} tabIndex={-1} role="dialog" aria-modal="true" aria-label={titulo} className={estilos.caja}>
        <h2>{titulo}</h2>
        {children}
      </div>
    </div>
  )
}
