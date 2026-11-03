import type { ReactNode } from 'react'
import estilos from './Alerta.module.css'

export function Alerta({ children }: { children: ReactNode }) {
  return (
    <div role="alert" className={estilos.alerta}>
      {children}
    </div>
  )
}
