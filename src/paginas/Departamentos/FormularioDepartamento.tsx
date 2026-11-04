import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { aplicarErroresServidor, mensajeError } from '../../api/errores'
import { Alerta } from '../../componentes/comunes/Alerta'
import { Boton } from '../../componentes/comunes/Boton'
import { Campo } from '../../componentes/comunes/Campo'
import { Modal } from '../../componentes/comunes/Modal'
import type { Departamento } from '../../tipos/catalogos'
import estilos from '../Paginas.module.css'
import { useGuardarDepartamento } from './consultasDepartamentos'

const LONGITUD_MAXIMA = 100

const esquema = z.object({
  nombre: z.string().trim().min(1, 'Este campo es obligatorio.').max(LONGITUD_MAXIMA, `Máximo ${LONGITUD_MAXIMA} caracteres.`),
})

type Datos = z.infer<typeof esquema>

type Props = { departamento?: Departamento; alCerrar: () => void }

export function FormularioDepartamento({ departamento, alCerrar }: Props) {
  const guardar = useGuardarDepartamento(departamento?.id)
  const formulario = useForm<Datos>({ resolver: zodResolver(esquema), defaultValues: { nombre: departamento?.nombre ?? '' } })
  const { errors, isSubmitting } = formulario.formState

  const enviar = formulario.handleSubmit(async (datos) => {
    try {
      await guardar.mutateAsync(datos)
      alCerrar()
    } catch (error) {
      if (!aplicarErroresServidor(error, formulario.setError, Object.keys(esquema.shape))) {
        formulario.setError('root', { message: mensajeError(error) })
      }
    }
  })

  return (
    <Modal titulo={departamento ? 'Editar departamento' : 'Nuevo departamento'}>
      <form onSubmit={enviar} noValidate>
        {errors.root && <Alerta>{errors.root.message}</Alerta>}
        <Campo etiqueta="Nombre" error={errors.nombre?.message}>
          <input {...formulario.register('nombre')} />
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
