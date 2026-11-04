import { useEffect, useState, type FormEvent } from 'react'
import { mensajeError } from '../../api/errores'
import { useAutenticacion } from '../../autenticacion/useAutenticacion'
import { Alerta } from '../../componentes/comunes/Alerta'
import { Boton } from '../../componentes/comunes/Boton'
import { Cargando } from '../../componentes/comunes/Cargando'
import { Confirmacion } from '../../componentes/comunes/Confirmacion'
import { Paginacion } from '../../componentes/comunes/Paginacion'
import { Tabla, type Columna } from '../../componentes/comunes/Tabla'
import type { EntidadGubernamental, FiltroEntidadesGubernamentales } from '../../tipos/catalogos'
import estilos from '../Paginas.module.css'
import { useActivarEntidad, useDesactivarEntidad, useEntidades } from './consultasEntidades'
import { FormularioEntidad } from './FormularioEntidad'

const TAMANO_PAGINA = 20
const FILTRO_INICIAL: FiltroEntidadesGubernamentales = { pagina: 1, tamanoPagina: TAMANO_PAGINA }

export function EntidadesGubernamentales() {
  const { esAdministrador } = useAutenticacion()
  const [filtro, setFiltro] = useState(FILTRO_INICIAL)
  const [borrador, setBorrador] = useState({ nombre: '', sector: '', poderDelEstado: '', incluirInactivas: false })
  const [edicion, setEdicion] = useState<EntidadGubernamental | 'nueva' | null>(null)
  const [aDesactivar, setADesactivar] = useState<EntidadGubernamental | null>(null)
  const { data, isPending, isError, error } = useEntidades(filtro)
  const desactivar = useDesactivarEntidad()
  const activar = useActivarEntidad()

  // Si la página pedida ya no existe (p. ej. se desactivó la última fila), vuelve a la última.
  const paginaFueraDeRango = Boolean(data && data.totalElementos > 0 && data.elementos.length === 0)
  const ultimaPagina = data?.totalPaginas ?? 1
  useEffect(() => {
    if (paginaFueraDeRango) setFiltro((anterior) => ({ ...anterior, pagina: ultimaPagina }))
  }, [paginaFueraDeRango, ultimaPagina])

  const buscar = (evento: FormEvent) => {
    evento.preventDefault()
    setFiltro({
      nombre: borrador.nombre.trim() || undefined,
      sector: borrador.sector.trim() || undefined,
      poderDelEstado: borrador.poderDelEstado.trim() || undefined,
      incluirInactivas: borrador.incluirInactivas || undefined,
      pagina: 1,
      tamanoPagina: TAMANO_PAGINA,
    })
  }

  const columnas: Columna<EntidadGubernamental>[] = [
    { titulo: 'Nombre', celda: (entidad) => entidad.nombre },
    { titulo: 'Categoría', celda: (entidad) => entidad.categoria },
    { titulo: 'Poder del Estado', celda: (entidad) => entidad.poderDelEstado },
    { titulo: 'Sector', celda: (entidad) => entidad.sector },
    { titulo: 'Estado', celda: (entidad) => (entidad.estaActiva ? 'Activa' : 'Inactiva') },
    ...(esAdministrador
      ? [
          {
            titulo: 'Acciones',
            celda: (entidad: EntidadGubernamental) => (
              <div className={estilos.filaAcciones}>
                <button type="button" className={estilos.enlace} onClick={() => setEdicion(entidad)}>
                  Editar
                </button>
                {entidad.estaActiva ? (
                  <button type="button" className={`${estilos.enlace} ${estilos.peligro}`} onClick={() => setADesactivar(entidad)}>
                    Desactivar
                  </button>
                ) : (
                  <button type="button" className={estilos.enlace} onClick={() => activar.mutate(entidad.id)}>
                    Reactivar
                  </button>
                )}
              </div>
            ),
          },
        ]
      : []),
  ]

  const confirmarDesactivar = () => {
    if (!aDesactivar) return
    desactivar.mutate(aDesactivar.id, { onSettled: () => setADesactivar(null) })
  }

  return (
    <div>
      <form className={estilos.barra} onSubmit={buscar}>
        <input
          aria-label="Nombre"
          placeholder="Nombre"
          value={borrador.nombre}
          onChange={(evento) => setBorrador({ ...borrador, nombre: evento.target.value })}
        />
        <input
          aria-label="Sector"
          placeholder="Sector"
          value={borrador.sector}
          onChange={(evento) => setBorrador({ ...borrador, sector: evento.target.value })}
        />
        <input
          aria-label="Poder del Estado"
          placeholder="Poder del Estado"
          value={borrador.poderDelEstado}
          onChange={(evento) => setBorrador({ ...borrador, poderDelEstado: evento.target.value })}
        />
        <label className={estilos.casilla}>
          <input
            type="checkbox"
            checked={borrador.incluirInactivas}
            onChange={(evento) => setBorrador({ ...borrador, incluirInactivas: evento.target.checked })}
          />
          Incluir inactivas
        </label>
        <Boton type="submit" variante="secundario">
          Buscar
        </Boton>
        {esAdministrador && (
          <Boton type="button" className={estilos.espacio} onClick={() => setEdicion('nueva')}>
            Nueva entidad
          </Boton>
        )}
      </form>

      {desactivar.isError && <Alerta>{mensajeError(desactivar.error)}</Alerta>}
      {activar.isError && <Alerta>{mensajeError(activar.error)}</Alerta>}
      {isPending && <Cargando />}
      {isError && <Alerta>{mensajeError(error)}</Alerta>}
      {data && data.totalElementos === 0 && <p>No hay entidades con esos filtros.</p>}
      {data && data.elementos.length > 0 && (
        <>
          <Tabla columnas={columnas} filas={data.elementos} clave={(entidad) => entidad.id} />
          <Paginacion
            pagina={data.pagina}
            totalPaginas={data.totalPaginas}
            totalElementos={data.totalElementos}
            alCambiar={(pagina) => setFiltro({ ...filtro, pagina })}
          />
        </>
      )}

      {edicion && <FormularioEntidad entidad={edicion === 'nueva' ? undefined : edicion} alCerrar={() => setEdicion(null)} />}
      {aDesactivar && (
        <Confirmacion
          titulo="Desactivar entidad"
          mensaje={`¿Desactivar ${aDesactivar.nombre}?`}
          textoConfirmar="Desactivar"
          procesando={desactivar.isPending}
          alConfirmar={confirmarDesactivar}
          alCancelar={() => setADesactivar(null)}
        />
      )}
    </div>
  )
}
