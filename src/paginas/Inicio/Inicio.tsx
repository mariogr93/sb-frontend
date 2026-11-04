import { Link } from 'react-router-dom'
import { mensajeError } from '../../api/errores'
import { Alerta } from '../../componentes/comunes/Alerta'
import { Cargando } from '../../componentes/comunes/Cargando'
import { ETIQUETAS_TIPO } from '../../tipos/empleados'
import { formatearMoneda } from '../../utilidades/formato'
import { useReporteSemanal } from '../Nominas/consultasNominas'
import estilos from '../Paginas.module.css'

export function Inicio() {
  const { data, isPending, isError, error } = useReporteSemanal()

  if (isPending) return <Cargando />
  if (isError) return <Alerta>{mensajeError(error)}</Alerta>

  return (
    <div>
      <div className={estilos.tarjetas}>
        <div className={estilos.tarjeta}>
          <span>Empleados activos</span>
          <strong>{data.cantidadEmpleados}</strong>
        </div>
        <div className={estilos.tarjeta}>
          <span>Pago semanal total</span>
          <strong>{formatearMoneda(data.montoTotal)}</strong>
        </div>
        {data.totalesPorTipo.map((total) => (
          <div key={total.tipoEmpleado} className={estilos.tarjeta}>
            <span>
              {ETIQUETAS_TIPO[total.tipoEmpleado]} ({total.cantidadEmpleados})
            </span>
            <strong>{formatearMoneda(total.montoTotal)}</strong>
          </div>
        ))}
      </div>
      <div className={estilos.filaAcciones}>
        <Link to="/empleados">Consultar empleados</Link>
        <Link to="/reporte-semanal">Ver reporte semanal</Link>
      </div>
    </div>
  )
}
