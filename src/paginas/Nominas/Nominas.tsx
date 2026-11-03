import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { mensajeError, mensajeErrorDetallado } from '../../api/errores'
import { useAutenticacion } from '../../autenticacion/useAutenticacion'
import { Alerta } from '../../componentes/comunes/Alerta'
import { Boton } from '../../componentes/comunes/Boton'
import { Cargando } from '../../componentes/comunes/Cargando'
import { Paginacion } from '../../componentes/comunes/Paginacion'
import { Tabla, type Columna } from '../../componentes/comunes/Tabla'
import type { NominaResumen } from '../../tipos/nominas'
import { formatearFechaCalendario, formatearMoneda } from '../../utilidades/formato'
import estilos from '../Paginas.module.css'
import { useGuardarNomina, useNominas } from './consultasNominas'

const TAMANO_PAGINA = 10

const columnas: Columna<NominaResumen>[] = [
  { titulo: 'Semana desde', celda: (nomina) => formatearFechaCalendario(nomina.fechaInicioSemana) },
  { titulo: 'Guardada por', celda: (nomina) => nomina.creadoPor },
  { titulo: 'Empleados', alineacion: 'derecha', celda: (nomina) => nomina.cantidadEmpleados },
  { titulo: 'Monto total', alineacion: 'derecha', celda: (nomina) => formatearMoneda(nomina.montoTotal) },
  { titulo: 'Detalle', celda: (nomina) => <Link to={`/nominas/${nomina.id}`}>Ver</Link> },
]

export function Nominas() {
  const { esAdministrador } = useAutenticacion()
  const [pagina, setPagina] = useState(1)
  const [fecha, setFecha] = useState('')
  const { data, isPending, isError, error } = useNominas(pagina, TAMANO_PAGINA)
  const guardar = useGuardarNomina()

  const alGuardar = (evento: FormEvent) => {
    evento.preventDefault()
    guardar.mutate({ fechaInicioSemana: fecha })
  }

  return (
    <div>
      {esAdministrador && (
        <form className={estilos.barra} onSubmit={alGuardar}>
          <label htmlFor="semana">Semana (lunes de inicio)</label>
          <input id="semana" type="date" required value={fecha} onChange={(evento) => setFecha(evento.target.value)} />
          <Boton type="submit" disabled={guardar.isPending || !fecha}>
            Guardar nómina
          </Boton>
        </form>
      )}
      {guardar.isError && <Alerta>{mensajeErrorDetallado(guardar.error)}</Alerta>}
      {guardar.isSuccess && <p role="status">Nómina guardada.</p>}

      {isPending && <Cargando />}
      {isError && <Alerta>{mensajeError(error)}</Alerta>}
      {data && data.elementos.length === 0 && <p>Aún no hay nóminas guardadas.</p>}
      {data && data.elementos.length > 0 && (
        <>
          <Tabla columnas={columnas} filas={data.elementos} clave={(nomina) => nomina.id} />
          <Paginacion pagina={data.pagina} totalPaginas={data.totalPaginas} totalElementos={data.totalElementos} alCambiar={setPagina} />
        </>
      )}
    </div>
  )
}
