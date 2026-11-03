import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { aplicarErroresServidor, mensajeError } from '../../api/errores'
import { Alerta } from '../../componentes/comunes/Alerta'
import { Boton } from '../../componentes/comunes/Boton'
import { Campo } from '../../componentes/comunes/Campo'
import { Cargando } from '../../componentes/comunes/Cargando'
import { CAMPOS_POR_TIPO, ETIQUETAS_CAMPO, ETIQUETAS_TIPO, TIPOS_EMPLEADO } from '../../tipos/empleados'
import { useDepartamentos } from '../Departamentos/consultasDepartamentos'
import { useEmpleado, useGuardarEmpleado } from './consultasEmpleados'
import { aDatosFormulario, esquemaEmpleado, type DatosFormularioEmpleado } from './esquemaEmpleado'
import estilos from './Empleados.module.css'

// Inputs numéricos: '' → undefined (si no, NaN rompe la validación).
const numero = { setValueAs: (valor: string) => (valor === '' || valor === undefined ? undefined : Number(valor)) }

export function FormularioEmpleado() {
  const { id } = useParams()
  const navegar = useNavigate()
  const { data: empleado, isPending: cargandoEmpleado } = useEmpleado(id)
  const { data: departamentos = [] } = useDepartamentos(false)
  const guardar = useGuardarEmpleado(id)
  const formulario = useForm<DatosFormularioEmpleado>({
    resolver: zodResolver(esquemaEmpleado),
    defaultValues: { tipo: 'Asalariado', compensacion: {} },
  })
  const tipo = formulario.watch('tipo')
  const { errors, isSubmitting } = formulario.formState

  useEffect(() => {
    if (empleado) formulario.reset(aDatosFormulario(empleado))
  }, [empleado, formulario])

  const enviar = formulario.handleSubmit(async (datos) => {
    // Envía solo los campos del tipo elegido.
    const compensacion = Object.fromEntries(CAMPOS_POR_TIPO[datos.tipo].map((campo) => [campo, datos.compensacion[campo]]))
    try {
      const guardado = await guardar.mutateAsync({ ...datos, compensacion })
      navegar(`/empleados/${guardado.id}`)
    } catch (error) {
      if (!aplicarErroresServidor(error, formulario.setError)) {
        formulario.setError('root', { message: mensajeError(error) })
      }
    }
  })

  if (id && cargandoEmpleado) return <Cargando />

  return (
    <form className={estilos.formulario} onSubmit={enviar} noValidate>
      {errors.root && <Alerta>{errors.root.message}</Alerta>}
      <div className={estilos.rejilla}>
        <Campo etiqueta="Primer nombre" error={errors.primerNombre?.message}>
          <input {...formulario.register('primerNombre')} />
        </Campo>
        <Campo etiqueta="Apellido paterno" error={errors.apellidoPaterno?.message}>
          <input {...formulario.register('apellidoPaterno')} />
        </Campo>
        <Campo etiqueta="Cédula" error={errors.cedula?.message}>
          <input placeholder="402-1234567-1" {...formulario.register('cedula')} />
        </Campo>
        <Campo etiqueta="Departamento" error={errors.departamentoId?.message}>
          <select {...formulario.register('departamentoId')}>
            <option value="">Seleccione…</option>
            {departamentos.map((departamento) => (
              <option key={departamento.id} value={departamento.id}>
                {departamento.nombre}
              </option>
            ))}
          </select>
        </Campo>
        <Campo etiqueta="Tipo de empleado" error={errors.tipo?.message}>
          <select {...formulario.register('tipo')}>
            {TIPOS_EMPLEADO.map((valor) => (
              <option key={valor} value={valor}>
                {ETIQUETAS_TIPO[valor]}
              </option>
            ))}
          </select>
        </Campo>
        {CAMPOS_POR_TIPO[tipo].map((campo) => (
          <Campo key={campo} etiqueta={ETIQUETAS_CAMPO[campo]} error={errors.compensacion?.[campo]?.message}>
            <input type="number" step="any" {...formulario.register(`compensacion.${campo}`, numero)} />
          </Campo>
        ))}
      </div>
      <div className={estilos.acciones}>
        <Boton type="button" variante="secundario" onClick={() => navegar(-1)}>
          Cancelar
        </Boton>
        <Boton type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Guardando…' : 'Guardar'}
        </Boton>
      </div>
    </form>
  )
}
