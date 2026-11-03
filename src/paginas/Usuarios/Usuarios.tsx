import { useState } from 'react'
import { mensajeError } from '../../api/errores'
import { Alerta } from '../../componentes/comunes/Alerta'
import { Boton } from '../../componentes/comunes/Boton'
import { Cargando } from '../../componentes/comunes/Cargando'
import { Confirmacion } from '../../componentes/comunes/Confirmacion'
import { Tabla, type Columna } from '../../componentes/comunes/Tabla'
import type { Usuario } from '../../tipos/usuarios'
import { formatearFecha } from '../../utilidades/formato'
import estilos from '../Paginas.module.css'
import { useDesactivarUsuario, useUsuarios } from './consultasUsuarios'
import { FormularioContrasena, FormularioCrearUsuario, FormularioEditarUsuario } from './FormulariosUsuario'

type Ventana = { tipo: 'crear' } | { tipo: 'editar' | 'contrasena'; usuario: Usuario } | null

export function Usuarios() {
  const [ventana, setVentana] = useState<Ventana>(null)
  const [aDesactivar, setADesactivar] = useState<Usuario | null>(null)
  const { data, isPending, isError, error } = useUsuarios()
  const desactivar = useDesactivarUsuario()
  const cerrar = () => setVentana(null)

  const columnas: Columna<Usuario>[] = [
    { titulo: 'Usuario', celda: (usuario) => usuario.nombreUsuario },
    { titulo: 'Nombre', celda: (usuario) => usuario.nombreCompleto },
    { titulo: 'Rol', celda: (usuario) => usuario.rol },
    { titulo: 'Estado', celda: (usuario) => (usuario.estaActivo ? 'Activo' : 'Inactivo') },
    { titulo: 'Creado', celda: (usuario) => formatearFecha(usuario.fechaCreacion) },
    {
      titulo: 'Acciones',
      celda: (usuario) => (
        <div className={estilos.filaAcciones}>
          <button type="button" className={estilos.enlace} onClick={() => setVentana({ tipo: 'editar', usuario })}>
            Editar
          </button>
          <button type="button" className={estilos.enlace} onClick={() => setVentana({ tipo: 'contrasena', usuario })}>
            Contraseña
          </button>
          {usuario.estaActivo && (
            <button type="button" className={`${estilos.enlace} ${estilos.peligro}`} onClick={() => setADesactivar(usuario)}>
              Desactivar
            </button>
          )}
        </div>
      ),
    },
  ]

  const confirmarDesactivar = () => {
    if (!aDesactivar) return
    desactivar.mutate(aDesactivar.id, { onSettled: () => setADesactivar(null) })
  }

  return (
    <div>
      <div className={estilos.barra}>
        <Boton className={estilos.espacio} onClick={() => setVentana({ tipo: 'crear' })}>
          Nuevo usuario
        </Boton>
      </div>

      {desactivar.isError && <Alerta>{mensajeError(desactivar.error)}</Alerta>}
      {isPending && <Cargando />}
      {isError && <Alerta>{mensajeError(error)}</Alerta>}
      {data && <Tabla columnas={columnas} filas={data} clave={(usuario) => usuario.id} />}

      {ventana?.tipo === 'crear' && <FormularioCrearUsuario alCerrar={cerrar} />}
      {ventana?.tipo === 'editar' && <FormularioEditarUsuario usuario={ventana.usuario} alCerrar={cerrar} />}
      {ventana?.tipo === 'contrasena' && <FormularioContrasena usuario={ventana.usuario} alCerrar={cerrar} />}
      {aDesactivar && (
        <Confirmacion
          titulo="Desactivar usuario"
          mensaje={`¿Desactivar a ${aDesactivar.nombreUsuario}? No podrá iniciar sesión.`}
          textoConfirmar="Desactivar"
          procesando={desactivar.isPending}
          alConfirmar={confirmarDesactivar}
          alCancelar={() => setADesactivar(null)}
        />
      )}
    </div>
  )
}
