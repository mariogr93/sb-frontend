import { useId, cloneElement, type ReactElement } from 'react'
import estilos from './Campo.module.css'

type Props = {
  etiqueta: string
  error?: string
  children: ReactElement<{ id?: string }>
}

/** Etiqueta + input + mensaje de error. El input hijo recibe el id para enlazar la etiqueta. */
export function Campo({ etiqueta, error, children }: Props) {
  const id = useId()
  return (
    <div className={estilos.campo}>
      <label htmlFor={id}>{etiqueta}</label>
      {cloneElement(children, { id })}
      {error && <span className={estilos.error}>{error}</span>}
    </div>
  )
}
