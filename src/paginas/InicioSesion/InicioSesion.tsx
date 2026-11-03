import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { mensajeError } from '../../api/errores'
import { useAutenticacion } from '../../autenticacion/useAutenticacion'
import { Alerta } from '../../componentes/comunes/Alerta'
import { Boton } from '../../componentes/comunes/Boton'
import { Campo } from '../../componentes/comunes/Campo'
import logo from '../../recursos/SUPERINTENDENCIA_DE_BANCOS.png'
import estilos from './InicioSesion.module.css'

const REQUERIDO = 'Este campo es obligatorio.'

const esquema = z.object({
  nombreUsuario: z.string().trim().min(1, REQUERIDO),
  contrasena: z.string().min(1, REQUERIDO),
})

type Datos = z.infer<typeof esquema>

export function InicioSesion() {
  const { sesion, iniciarSesion } = useAutenticacion()
  const navegar = useNavigate()
  const ubicacion = useLocation()
  const formulario = useForm<Datos>({ resolver: zodResolver(esquema) })
  const destino = (ubicacion.state as { desde?: string } | null)?.desde ?? '/'

  if (sesion) return <Navigate to={destino} replace />

  const enviar = formulario.handleSubmit(async (datos) => {
    try {
      await iniciarSesion(datos)
      navegar(destino, { replace: true })
    } catch (error) {
      formulario.setError('root', { message: mensajeError(error) })
    }
  })

  const { errors, isSubmitting } = formulario.formState

  return (
    <main className={estilos.pagina}>
      <form className={estilos.tarjeta} onSubmit={enviar} noValidate>
        <img className={estilos.logo} src={logo} alt="Superintendencia de Bancos" />
        <h1>Iniciar sesión</h1>
        {errors.root && <Alerta>{errors.root.message}</Alerta>}
        <Campo etiqueta="Usuario" error={errors.nombreUsuario?.message}>
          <input autoComplete="username" {...formulario.register('nombreUsuario')} />
        </Campo>
        <Campo etiqueta="Contraseña" error={errors.contrasena?.message}>
          <input type="password" autoComplete="current-password" {...formulario.register('contrasena')} />
        </Campo>
        <Boton type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Ingresando…' : 'Ingresar'}
        </Boton>
      </form>
    </main>
  )
}
