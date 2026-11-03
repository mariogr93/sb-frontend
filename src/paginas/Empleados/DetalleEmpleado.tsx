import { Link, useParams } from 'react-router-dom'
import { mensajeError } from '../../api/errores'
import { useAutenticacion } from '../../autenticacion/useAutenticacion'
import { Alerta } from '../../componentes/comunes/Alerta'
import { Cargando } from '../../componentes/comunes/Cargando'
import { Tabla, type Columna } from '../../componentes/comunes/Tabla'
import { ETIQUETAS_TIPO } from '../../tipos/empleados'
import type { LineaDesglosePago } from '../../tipos/comun'
import { formatearFecha, formatearMoneda } from '../../utilidades/formato'
import { useEmpleado } from './consultasEmpleados'
import estilos from './Empleados.module.css'

const columnasDesglose: Columna<LineaDesglosePago>[] = [
  { titulo: 'Concepto', celda: (linea) => linea.concepto },
  { titulo: 'Fórmula', celda: (linea) => linea.formula },
  { titulo: 'Monto', alineacion: 'derecha', celda: (linea) => formatearMoneda(linea.monto) },
]

export function DetalleEmpleado() {
  const { id } = useParams()
  const { esAdministrador } = useAutenticacion()
  const { data: empleado, isPending, isError, error } = useEmpleado(id)

  if (isPending) return <Cargando />
  if (isError) return <Alerta>{mensajeError(error)}</Alerta>

  return (
    <div>
      <dl className={estilos.datos}>
        <div><dt>Nombre</dt><dd>{empleado.nombreCompleto}</dd></div>
        <div><dt>Cédula</dt><dd>{empleado.cedula}</dd></div>
        <div><dt>Departamento</dt><dd>{empleado.nombreDepartamento}</dd></div>
        <div><dt>Tipo</dt><dd>{ETIQUETAS_TIPO[empleado.tipo]}</dd></div>
        <div><dt>Estado</dt><dd>{empleado.estado}</dd></div>
        <div><dt>Creado</dt><dd>{formatearFecha(empleado.fechaCreacion)}</dd></div>
      </dl>

      <h2>Pago semanal</h2>
      <Tabla columnas={columnasDesglose} filas={empleado.pagoSemanal.lineas} clave={(linea) => linea.concepto} />
      <p className={estilos.total}>Total: {formatearMoneda(empleado.pagoSemanal.total)}</p>

      <div className={estilos.acciones}>
        <Link to="/empleados">Volver a la consulta</Link>
        {esAdministrador && <Link to={`/empleados/${empleado.id}/editar`}>Editar</Link>}
      </div>
    </div>
  )
}
