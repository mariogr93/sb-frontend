import { Link, useParams } from 'react-router-dom'
import { mensajeError } from '../../api/errores'
import { Alerta } from '../../componentes/comunes/Alerta'
import { Cargando } from '../../componentes/comunes/Cargando'
import { formatearFecha, formatearFechaCalendario, formatearMoneda } from '../../utilidades/formato'
import estilos from '../Paginas.module.css'
import { useNomina } from './consultasNominas'
import { TablaPagos } from './TablaPagos'

export function DetalleNomina() {
  const { id } = useParams()
  const { data, isPending, isError, error } = useNomina(id)

  if (isPending) return <Cargando />
  if (isError) return <Alerta>{mensajeError(error)}</Alerta>

  return (
    <div>
      <p>
        Semana desde {formatearFechaCalendario(data.fechaInicioSemana)} · guardada por {data.creadoPor} el {formatearFecha(data.fechaCreacion)}
      </p>
      <TablaPagos pagos={data.pagos} />
      <p className={estilos.total}>Total: {formatearMoneda(data.montoTotal)}</p>
      <Link to="/nominas">Volver a nóminas</Link>
    </div>
  )
}
