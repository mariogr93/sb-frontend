import { useState } from 'react'
import { mensajeError } from '../../api/errores'
import { Alerta } from '../../componentes/comunes/Alerta'
import { Boton } from '../../componentes/comunes/Boton'
import { Cargando } from '../../componentes/comunes/Cargando'
import { ETIQUETAS_TIPO } from '../../tipos/empleados'
import { formatearFecha, formatearMoneda } from '../../utilidades/formato'
import { useDepartamentos } from '../Departamentos/consultasDepartamentos'
import estilos from '../Paginas.module.css'
import { useReporteSemanal } from './consultasNominas'
import { TablaPagos } from './TablaPagos'

export function ReporteSemanal() {
  const [departamentoId, setDepartamentoId] = useState('')
  const { data: departamentos = [] } = useDepartamentos(false)
  const { data, isPending, isError, error } = useReporteSemanal(departamentoId || undefined)

  return (
    <div>
      <div className={estilos.barra}>
        <select aria-label="Departamento" value={departamentoId} onChange={(evento) => setDepartamentoId(evento.target.value)}>
          <option value="">Todos los departamentos</option>
          {departamentos.map((departamento) => (
            <option key={departamento.id} value={departamento.id}>
              {departamento.nombre}
            </option>
          ))}
        </select>
        <Boton variante="secundario" className={estilos.espacio} onClick={() => window.print()}>
          Imprimir
        </Boton>
      </div>

      {isPending && <Cargando />}
      {isError && <Alerta>{mensajeError(error)}</Alerta>}
      {data && (
        <>
          <p>Generado el {formatearFecha(data.fechaGeneracion)} · {data.cantidadEmpleados} empleados activos</p>
          {data.pagos.length === 0 ? <p>No hay empleados activos.</p> : <TablaPagos pagos={data.pagos} />}
          <h2>Totales por tipo</h2>
          <div className={estilos.tarjetas}>
            {data.totalesPorTipo.map((total) => (
              <div key={total.tipoEmpleado} className={estilos.tarjeta}>
                <span>
                  {ETIQUETAS_TIPO[total.tipoEmpleado]} ({total.cantidadEmpleados})
                </span>
                <strong>{formatearMoneda(total.montoTotal)}</strong>
              </div>
            ))}
          </div>
          <p className={estilos.total}>Total general: {formatearMoneda(data.montoTotal)}</p>
        </>
      )}
    </div>
  )
}
