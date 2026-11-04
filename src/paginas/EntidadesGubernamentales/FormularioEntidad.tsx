import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { aplicarErroresServidor, mensajeError } from '../../api/errores'
import { Alerta } from '../../componentes/comunes/Alerta'
import { Boton } from '../../componentes/comunes/Boton'
import { Campo } from '../../componentes/comunes/Campo'
import { Modal } from '../../componentes/comunes/Modal'
import type { EntidadGubernamental } from '../../tipos/catalogos'
import estilos from '../Paginas.module.css'
import { useGuardarEntidad } from './consultasEntidades'

const LONGITUD_MAXIMA_NOMBRE = 200
const LONGITUD_MAXIMA_CLASIFICACION = 100
const REQUERIDO = 'Este campo es obligatorio.'

const texto = (maximo: number) => z.string().trim().min(1, REQUERIDO).max(maximo, `Máximo ${maximo} caracteres.`)

const esquema = z.object({
  nombre: texto(LONGITUD_MAXIMA_NOMBRE),
  categoria: texto(LONGITUD_MAXIMA_CLASIFICACION),
  poderDelEstado: texto(LONGITUD_MAXIMA_CLASIFICACION),
  sector: texto(LONGITUD_MAXIMA_CLASIFICACION),
})

type Datos = z.infer<typeof esquema>

type Props = { entidad?: EntidadGubernamental; alCerrar: () => void }

export function FormularioEntidad({ entidad, alCerrar }: Props) {
  const guardar = useGuardarEntidad(entidad?.id)
  const formulario = useForm<Datos>({
    resolver: zodResolver(esquema),
    defaultValues: {
      nombre: entidad?.nombre ?? '',
      categoria: entidad?.categoria ?? '',
      poderDelEstado: entidad?.poderDelEstado ?? '',
      sector: entidad?.sector ?? '',
    },
  })
  const { errors, isSubmitting } = formulario.formState

  const enviar = formulario.handleSubmit(async (datos) => {
    try {
      await guardar.mutateAsync(datos)
      alCerrar()
    } catch (error) {
      if (!aplicarErroresServidor(error, formulario.setError)) formulario.setError('root', { message: mensajeError(error) })
    }
  })

  return (
    <Modal titulo={entidad ? 'Editar entidad' : 'Nueva entidad'}>
      <form onSubmit={enviar} noValidate>
        {errors.root && <Alerta>{errors.root.message}</Alerta>}
        <Campo etiqueta="Nombre" error={errors.nombre?.message}>
          <input {...formulario.register('nombre')} />
        </Campo>
        <Campo etiqueta="Categoría" error={errors.categoria?.message}>
          <input {...formulario.register('categoria')} />
        </Campo>
        <Campo etiqueta="Poder del Estado" error={errors.poderDelEstado?.message}>
          <input {...formulario.register('poderDelEstado')} />
        </Campo>
        <Campo etiqueta="Sector" error={errors.sector?.message}>
          <input {...formulario.register('sector')} />
        </Campo>
        <div className={estilos.acciones}>
          <Boton type="button" variante="secundario" onClick={alCerrar}>
            Cancelar
          </Boton>
          <Boton type="submit" disabled={isSubmitting}>
            Guardar
          </Boton>
        </div>
      </form>
    </Modal>
  )
}
