import { useRef, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { mensajeError } from '../../api/errores'
import { useAutenticacion } from '../../autenticacion/useAutenticacion'
import { Alerta } from '../../componentes/comunes/Alerta'
import { Boton } from '../../componentes/comunes/Boton'
import { Cargando } from '../../componentes/comunes/Cargando'
import { Confirmacion } from '../../componentes/comunes/Confirmacion'
import { Paginacion } from '../../componentes/comunes/Paginacion'
import { Tabla, type Columna } from '../../componentes/comunes/Tabla'
import {
  ETIQUETAS_TIPO,
  TIPOS_EMPLEADO,
  type Empleado,
  type EstadoEmpleado,
  type FiltroEmpleados,
  type TipoEmpleado,
} from '../../tipos/empleados'
import { formatearMoneda } from '../../utilidades/formato'
import { useDepartamentos } from '../Departamentos/consultasDepartamentos'
import { useDesactivarEmpleado, useEmpleados } from './consultasEmpleados'
import estilos from './Empleados.module.css'

const TAMANO_PAGINA = 20
const RETARDO_BUSQUEDA_MS = 300

export function ConsultaEmpleados() {
  const { esAdministrador } = useAutenticacion()
  const navegar = useNavigate()
  const [parametros, setParametros] = useSearchParams()
  const [textoNombre, setTextoNombre] = useState(parametros.get('nombre') ?? '')
  const temporizador = useRef<number | undefined>(undefined)
  const [aDesactivar, setADesactivar] = useState<Empleado | null>(null)

  const filtro: FiltroEmpleados = {
    nombre: parametros.get('nombre') || undefined,
    departamentoId: parametros.get('departamentoId') || undefined,
    estado: (parametros.get('estado') as EstadoEmpleado | null) || undefined,
    tipo: (parametros.get('tipo') as TipoEmpleado | null) || undefined,
    pagina: Number(parametros.get('pagina') ?? 1),
    tamanoPagina: TAMANO_PAGINA,
  }

  const { data, isPending, isError, error } = useEmpleados(filtro)
  const { data: departamentos = [] } = useDepartamentos(true)
  const desactivar = useDesactivarEmpleado()

  // El filtro vive en la URL: se puede compartir y sobrevive al refresco.
  const actualizar = (cambios: Record<string, string | undefined>) =>
    setParametros(
      (anteriores) => {
        const nuevos = new URLSearchParams(anteriores)
        Object.entries(cambios).forEach(([clave, valor]) => (valor ? nuevos.set(clave, valor) : nuevos.delete(clave)))
        if (!('pagina' in cambios)) nuevos.delete('pagina')
        return nuevos
      },
      { replace: true },
    )

  const alCambiarNombre = (valor: string) => {
    setTextoNombre(valor)
    window.clearTimeout(temporizador.current)
    temporizador.current = window.setTimeout(() => actualizar({ nombre: valor.trim() || undefined }), RETARDO_BUSQUEDA_MS)
  }

  const confirmarDesactivar = () => {
    if (!aDesactivar) return
    desactivar.mutate(aDesactivar.id, { onSettled: () => setADesactivar(null) })
  }

  const columnas: Columna<Empleado>[] = [
    { titulo: 'Nombre', celda: (empleado) => <Link to={`/empleados/${empleado.id}`}>{empleado.nombreCompleto}</Link> },
    { titulo: 'Cédula', celda: (empleado) => empleado.cedula },
    { titulo: 'Departamento', celda: (empleado) => empleado.nombreDepartamento },
    { titulo: 'Tipo', celda: (empleado) => ETIQUETAS_TIPO[empleado.tipo] },
    { titulo: 'Estado', celda: (empleado) => empleado.estado },
    { titulo: 'Pago semanal', alineacion: 'derecha', celda: (empleado) => formatearMoneda(empleado.pagoSemanal.total) },
    {
      titulo: 'Acciones',
      celda: (empleado) => (
        <div className={estilos.filaAcciones}>
          <Link to={`/empleados/${empleado.id}`}>Ver</Link>
          {esAdministrador && (
            <>
              <Link to={`/empleados/${empleado.id}/editar`}>Editar</Link>
              {empleado.estado === 'Activo' && (
                <button type="button" className={estilos.enlace} onClick={() => setADesactivar(empleado)}>
                  Desactivar
                </button>
              )}
            </>
          )}
        </div>
      ),
    },
  ]

  return (
    <div>
      <div className={estilos.filtros}>
        <input
          aria-label="Buscar por nombre"
          placeholder="Buscar por nombre"
          value={textoNombre}
          onChange={(evento) => alCambiarNombre(evento.target.value)}
        />
        <select
          aria-label="Departamento"
          value={filtro.departamentoId ?? ''}
          onChange={(evento) => actualizar({ departamentoId: evento.target.value || undefined })}
        >
          <option value="">Todos los departamentos</option>
          {departamentos.map((departamento) => (
            <option key={departamento.id} value={departamento.id}>
              {departamento.nombre}
            </option>
          ))}
        </select>
        <select
          aria-label="Estado"
          value={filtro.estado ?? ''}
          onChange={(evento) => actualizar({ estado: evento.target.value || undefined })}
        >
          <option value="">Todos los estados</option>
          <option value="Activo">Activo</option>
          <option value="Inactivo">Inactivo</option>
        </select>
        <select aria-label="Tipo" value={filtro.tipo ?? ''} onChange={(evento) => actualizar({ tipo: evento.target.value || undefined })}>
          <option value="">Todos los tipos</option>
          {TIPOS_EMPLEADO.map((tipo) => (
            <option key={tipo} value={tipo}>
              {ETIQUETAS_TIPO[tipo]}
            </option>
          ))}
        </select>
        {esAdministrador && <Boton onClick={() => navegar('/empleados/nuevo')}>Crear registro</Boton>}
      </div>

      {desactivar.isError && <Alerta>{mensajeError(desactivar.error)}</Alerta>}
      {isPending && <Cargando />}
      {isError && <Alerta>{mensajeError(error)}</Alerta>}
      {data && data.elementos.length === 0 && <p>No hay empleados con esos filtros.</p>}
      {data && data.elementos.length > 0 && (
        <>
          <Tabla columnas={columnas} filas={data.elementos} clave={(empleado) => empleado.id} />
          <Paginacion
            pagina={data.pagina}
            totalPaginas={data.totalPaginas}
            totalElementos={data.totalElementos}
            alCambiar={(pagina) => actualizar({ pagina: String(pagina) })}
          />
        </>
      )}

      {aDesactivar && (
        <Confirmacion
          titulo="Desactivar empleado"
          mensaje={`¿Desactivar a ${aDesactivar.nombreCompleto}? Dejará de aparecer en el reporte semanal.`}
          textoConfirmar="Desactivar"
          procesando={desactivar.isPending}
          alConfirmar={confirmarDesactivar}
          alCancelar={() => setADesactivar(null)}
        />
      )}
    </div>
  )
}
