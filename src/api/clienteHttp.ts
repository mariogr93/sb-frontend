import axios from 'axios'
import { almacenSesion } from '../autenticacion/almacenSesion'
import { irAlInicioSesion } from '../autenticacion/redireccion'

const RUTA_INICIO_SESION = '/autenticacion/iniciar-sesion'
const ESTADO_NO_AUTORIZADO = 401

export const clienteHttp = axios.create({ baseURL: import.meta.env.VITE_URL_API })

clienteHttp.interceptors.request.use((configuracion) => {
  const sesion = almacenSesion.leer()
  if (sesion) configuracion.headers.Authorization = `Bearer ${sesion.token}`
  return configuracion
})

clienteHttp.interceptors.response.use(
  (respuesta) => respuesta,
  (error) => {
    // Token vencido o revocado en una solicitud protegida: cerrar sesión y volver al login.
    // El 401 de un inicio de sesión fallido (credenciales incorrectas) no cierra nada.
    const esInicioSesion = axios.isAxiosError(error) && error.config?.url === RUTA_INICIO_SESION
    if (axios.isAxiosError(error) && error.response?.status === ESTADO_NO_AUTORIZADO && !esInicioSesion) {
      almacenSesion.borrar()
      irAlInicioSesion()
    }
    return Promise.reject(error)
  },
)
