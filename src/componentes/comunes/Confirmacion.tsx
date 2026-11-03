import { Boton } from './Boton'
import estilos from './Confirmacion.module.css'
import { useFocoEnDialogo } from './useFocoEnDialogo'

type Props = {
  titulo: string
  mensaje: string
  textoConfirmar?: string
  procesando?: boolean
  alConfirmar: () => void
  alCancelar: () => void
}

export function Confirmacion({ titulo, mensaje, textoConfirmar = 'Confirmar', procesando, alConfirmar, alCancelar }: Props) {
  const referencia = useFocoEnDialogo<HTMLDivElement>()

  return (
    <div className={estilos.fondo}>
      <div
        ref={referencia}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={titulo}
        className={estilos.caja}
        onKeyDown={(evento) => evento.key === 'Escape' && alCancelar()}
      >
        <h2>{titulo}</h2>
        <p>{mensaje}</p>
        <div className={estilos.acciones}>
          <Boton variante="secundario" onClick={alCancelar} disabled={procesando}>
            Cancelar
          </Boton>
          <Boton variante="peligro" onClick={alConfirmar} disabled={procesando}>
            {textoConfirmar}
          </Boton>
        </div>
      </div>
    </div>
  )
}
