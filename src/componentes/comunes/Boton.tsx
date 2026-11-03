import type { ButtonHTMLAttributes } from 'react'
import estilos from './Boton.module.css'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & { variante?: 'primario' | 'secundario' | 'peligro' }

export function Boton({ variante = 'primario', className, ...resto }: Props) {
  return <button className={`${estilos.boton} ${estilos[variante]} ${className ?? ''}`} {...resto} />
}
