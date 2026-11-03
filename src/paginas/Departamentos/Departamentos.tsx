import { useState } from 'react'
import { mensajeError } from '../../api/errores'
import { useAutenticacion } from '../../autenticacion/useAutenticacion'
import { Alerta } from '../../componentes/comunes/Alerta'
import { Boton } from '../../componentes/comunes/Boton'
import { Cargando } from '../../componentes/comunes/Cargando'
import { Confirmacion } from '../../componentes/comunes/Confirmacion'
import { Tabla, type Columna } from '../../componentes/comunes/Tabla'
import type { Departamento } from '../../tipos/catalogos'
import estilos from '../Paginas.module.css'
import { useDepartamentos, useDesactivarDepartamento } from './consultasDepartamentos'
import { FormularioDepartamento } from './FormularioDepartamento'

export function Departamentos() {
  const { esAdministrador } = useAutenticacion()
  const [incluirInactivos, setIncluirInactivos] = useState(false)
  const [edicion, setEdicion] = useState<Departamento | 'nuevo' | null>(null)
  const [aDesactivar, setADesactivar] = useState<Departamento | null>(null)
  const { data, isPending, isError, error } = useDepartamentos(incluirInactivos)
  const desactivar = useDesactivarDepartamento()

  const columnas: Columna<Departamento>[] = [
    { titulo: 'Nombre', celda: (departamento) => departamento.nombre },
    { titulo: 'Estado', celda: (departamento) => (departamento.estaActivo ? 'Activo' : 'Inactivo') },
    ...(esAdministrador
      ? [
          {
            titulo: 'Acciones',
            celda: (departamento: Departamento) => (
              <div className={estilos.filaAcciones}>
                <button type="button" className={estilos.enlace} onClick={() => setEdicion(departamento)}>
                  Editar
                </button>
                {departamento.estaActivo && (
                  <button type="button" className={`${estilos.enlace} ${estilos.peligro}`} onClick={() => setADesactivar(departamento)}>
                    Desactivar
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
      <div className={estilos.barra}>
        <label className={estilos.casilla}>
          <input type="checkbox" checked={incluirInactivos} onChange={(evento) => setIncluirInactivos(evento.target.checked)} />
          Incluir inactivos
        </label>
        {esAdministrador && (
          <Boton className={estilos.espacio} onClick={() => setEdicion('nuevo')}>
            Nuevo departamento
          </Boton>
        )}
      </div>

      {desactivar.isError && <Alerta>{mensajeError(desactivar.error)}</Alerta>}
      {isPending && <Cargando />}
      {isError && <Alerta>{mensajeError(error)}</Alerta>}
      {data && <Tabla columnas={columnas} filas={data} clave={(departamento) => departamento.id} />}

      {edicion && (
        <FormularioDepartamento departamento={edicion === 'nuevo' ? undefined : edicion} alCerrar={() => setEdicion(null)} />
      )}
      {aDesactivar && (
        <Confirmacion
          titulo="Desactivar departamento"
          mensaje={`¿Desactivar ${aDesactivar.nombre}? No se puede si tiene empleados activos.`}
          textoConfirmar="Desactivar"
          procesando={desactivar.isPending}
          alConfirmar={confirmarDesactivar}
          alCancelar={() => setADesactivar(null)}
        />
      )}
    </div>
  )
}
