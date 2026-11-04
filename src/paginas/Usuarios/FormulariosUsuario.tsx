import { zodResolver } from '@hookform/resolvers/zod'
import type { ReactNode } from 'react'
import { useForm, type FieldValues, type UseFormReturn } from 'react-hook-form'
import { z } from 'zod'
import { aplicarErroresServidor, mensajeError } from '../../api/errores'
import { Alerta } from '../../componentes/comunes/Alerta'
import { Boton } from '../../componentes/comunes/Boton'
import { Campo } from '../../componentes/comunes/Campo'
import { Modal } from '../../componentes/comunes/Modal'
import { ROLES, type Usuario } from '../../tipos/usuarios'
import {
  LONGITUD_MAXIMA_NOMBRE_PERSONA,
  MENSAJE_NOMBRE_PERSONA,
  PATRON_NOMBRE_PERSONA,
  REQUERIDO,
} from '../../utilidades/validaciones'
import estilos from '../Paginas.module.css'
import { useActualizarUsuario, useCambiarContrasena, useCrearUsuario } from './consultasUsuarios'

const LONGITUD_MINIMA_CONTRASENA = 8
const LONGITUD_MAXIMA_CONTRASENA = 128
const PATRON_NOMBRE_USUARIO = /^[a-zA-Z0-9._-]{3,50}$/

// Misma regla que el servidor (ReglasNombrePersona).
const nombreCompleto = z
  .string()
  .trim()
  .min(1, REQUERIDO)
  .max(LONGITUD_MAXIMA_NOMBRE_PERSONA, `Máximo ${LONGITUD_MAXIMA_NOMBRE_PERSONA} caracteres.`)
  .regex(PATRON_NOMBRE_PERSONA, MENSAJE_NOMBRE_PERSONA)

const contrasena = z
  .string()
  .min(LONGITUD_MINIMA_CONTRASENA, `Mínimo ${LONGITUD_MINIMA_CONTRASENA} caracteres.`)
  .max(LONGITUD_MAXIMA_CONTRASENA, `Máximo ${LONGITUD_MAXIMA_CONTRASENA} caracteres.`)
  .regex(/[A-Z]/, 'Debe incluir una mayúscula.')
  .regex(/[a-z]/, 'Debe incluir una minúscula.')
  .regex(/[0-9]/, 'Debe incluir un número.')

const esquemaCrear = z.object({
  nombreUsuario: z.string().trim().regex(PATRON_NOMBRE_USUARIO, '3 a 50 caracteres: letras, números, punto, guion o guion bajo.'),
  nombreCompleto,
  contrasena,
  rol: z.enum(ROLES),
})

const esquemaEditar = z.object({ nombreCompleto, rol: z.enum(ROLES), estaActivo: z.boolean() })

const esquemaContrasena = z.object({ contrasenaNueva: contrasena })

type DatosCrear = z.infer<typeof esquemaCrear>
type DatosEditar = z.infer<typeof esquemaEditar>
type DatosContrasena = z.infer<typeof esquemaContrasena>

type PropsCierre = { alCerrar: () => void }

/** Envía el formulario: errores de campo del servidor en su campo, el resto como alerta. */
async function enviarConErrores<T extends FieldValues>(
  formulario: UseFormReturn<T>,
  accion: () => Promise<unknown>,
  alCerrar: () => void,
) {
  try {
    await accion()
    alCerrar()
  } catch (error) {
    if (!aplicarErroresServidor(error, formulario.setError)) {
      formulario.setError('root', { message: mensajeError(error) })
    }
  }
}

function Acciones({ alCerrar, enviando }: PropsCierre & { enviando: boolean }): ReactNode {
  return (
    <div className={estilos.acciones}>
      <Boton type="button" variante="secundario" onClick={alCerrar}>
        Cancelar
      </Boton>
      <Boton type="submit" disabled={enviando}>
        Guardar
      </Boton>
    </div>
  )
}

export function FormularioCrearUsuario({ alCerrar }: PropsCierre) {
  const crear = useCrearUsuario()
  const formulario = useForm<DatosCrear>({ resolver: zodResolver(esquemaCrear), defaultValues: { rol: 'Usuario' } })
  const { errors, isSubmitting } = formulario.formState
  const enviar = formulario.handleSubmit((datos) => enviarConErrores(formulario, () => crear.mutateAsync(datos), alCerrar))

  return (
    <Modal titulo="Nuevo usuario">
      <form onSubmit={enviar} noValidate>
        {errors.root && <Alerta>{errors.root.message}</Alerta>}
        <Campo etiqueta="Usuario" error={errors.nombreUsuario?.message}>
          <input autoComplete="off" {...formulario.register('nombreUsuario')} />
        </Campo>
        <Campo etiqueta="Nombre completo" error={errors.nombreCompleto?.message}>
          <input {...formulario.register('nombreCompleto')} />
        </Campo>
        <Campo etiqueta="Contraseña" error={errors.contrasena?.message}>
          <input type="password" autoComplete="new-password" {...formulario.register('contrasena')} />
        </Campo>
        <Campo etiqueta="Rol" error={errors.rol?.message}>
          <select {...formulario.register('rol')}>
            {ROLES.map((rol) => (
              <option key={rol} value={rol}>
                {rol}
              </option>
            ))}
          </select>
        </Campo>
        <Acciones alCerrar={alCerrar} enviando={isSubmitting} />
      </form>
    </Modal>
  )
}

export function FormularioEditarUsuario({ usuario, alCerrar }: PropsCierre & { usuario: Usuario }) {
  const actualizar = useActualizarUsuario(usuario.id)
  const formulario = useForm<DatosEditar>({
    resolver: zodResolver(esquemaEditar),
    defaultValues: { nombreCompleto: usuario.nombreCompleto, rol: usuario.rol, estaActivo: usuario.estaActivo },
  })
  const { errors, isSubmitting } = formulario.formState
  const enviar = formulario.handleSubmit((datos) => enviarConErrores(formulario, () => actualizar.mutateAsync(datos), alCerrar))

  return (
    <Modal titulo={`Editar ${usuario.nombreUsuario}`}>
      <form onSubmit={enviar} noValidate>
        {errors.root && <Alerta>{errors.root.message}</Alerta>}
        <Campo etiqueta="Nombre completo" error={errors.nombreCompleto?.message}>
          <input {...formulario.register('nombreCompleto')} />
        </Campo>
        <Campo etiqueta="Rol" error={errors.rol?.message}>
          <select {...formulario.register('rol')}>
            {ROLES.map((rol) => (
              <option key={rol} value={rol}>
                {rol}
              </option>
            ))}
          </select>
        </Campo>
        <Campo etiqueta="Activo" error={errors.estaActivo?.message}>
          <input type="checkbox" {...formulario.register('estaActivo')} />
        </Campo>
        <Acciones alCerrar={alCerrar} enviando={isSubmitting} />
      </form>
    </Modal>
  )
}

export function FormularioContrasena({ usuario, alCerrar }: PropsCierre & { usuario: Usuario }) {
  const cambiar = useCambiarContrasena(usuario.id)
  const formulario = useForm<DatosContrasena>({ resolver: zodResolver(esquemaContrasena) })
  const { errors, isSubmitting } = formulario.formState
  const enviar = formulario.handleSubmit((datos) => enviarConErrores(formulario, () => cambiar.mutateAsync(datos), alCerrar))

  return (
    <Modal titulo={`Cambiar contraseña de ${usuario.nombreUsuario}`}>
      <form onSubmit={enviar} noValidate>
        {errors.root && <Alerta>{errors.root.message}</Alerta>}
        <Campo etiqueta="Contraseña nueva" error={errors.contrasenaNueva?.message}>
          <input type="password" autoComplete="new-password" {...formulario.register('contrasenaNueva')} />
        </Campo>
        <Acciones alCerrar={alCerrar} enviando={isSubmitting} />
      </form>
    </Modal>
  )
}
