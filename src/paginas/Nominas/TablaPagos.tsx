import { Fragment, useState } from 'react'
import estilos from '../../componentes/comunes/Tabla.module.css'
import paginas from '../Paginas.module.css'
import { ETIQUETAS_TIPO } from '../../tipos/empleados'
import type { PagoEmpleado } from '../../tipos/nominas'
import { formatearMoneda } from '../../utilidades/formato'

/** Pagos por empleado; cada fila se expande para ver el desglose del cálculo. */
export function TablaPagos({ pagos }: { pagos: PagoEmpleado[] }) {
  const [abiertos, setAbiertos] = useState<ReadonlySet<string>>(new Set())

  const alternar = (id: string) =>
    setAbiertos((anteriores) => {
      const nuevos = new Set(anteriores)
      if (!nuevos.delete(id)) nuevos.add(id)
      return nuevos
    })

  return (
    <div className={estilos.contenedor}>
      <table className={estilos.tabla}>
        <thead>
          <tr>
            <th>Empleado</th>
            <th>Departamento</th>
            <th>Tipo</th>
            <th className={estilos.derecha}>Pago semanal</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {pagos.map((pago) => (
            <Fragment key={pago.empleadoId}>
              <tr>
                <td>{pago.nombreCompleto}</td>
                <td>{pago.nombreDepartamento}</td>
                <td>{ETIQUETAS_TIPO[pago.tipoEmpleado]}</td>
                <td className={estilos.derecha}>{formatearMoneda(pago.desglose.total)}</td>
                <td>
                  <button
                    type="button"
                    className={paginas.enlace}
                    aria-expanded={abiertos.has(pago.empleadoId)}
                    onClick={() => alternar(pago.empleadoId)}
                  >
                    {abiertos.has(pago.empleadoId) ? 'Ocultar' : 'Desglose'}
                  </button>
                </td>
              </tr>
              {abiertos.has(pago.empleadoId) &&
                pago.desglose.lineas.map((linea) => (
                  <tr key={`${pago.empleadoId}-${linea.concepto}`} className={paginas.desglose}>
                    <td colSpan={2}>{linea.concepto}</td>
                    <td>{linea.formula}</td>
                    <td className={estilos.derecha}>{formatearMoneda(linea.monto)}</td>
                    <td />
                  </tr>
                ))}
            </Fragment>
          ))}
        </tbody>
      </table>
    </div>
  )
}
