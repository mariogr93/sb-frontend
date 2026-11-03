import axios from 'axios'
import { almacenSesion } from '../autenticacion/almacenSesion'

export const clienteHttp = axios.create({ baseURL: import.meta.env.VITE_URL_API })

clienteHttp.interceptors.request.use((configuracion) => {
  const sesion = almacenSesion.leer()
  if (sesion) configuracion.headers.Authorization = `Bearer ${sesion.token}`
  return configuracion
})

clienteHttp.interceptors.response.use(
  (respuesta) => respuesta,
  (error) => {
    // Token vencido o revocado: cerrar sesión y volver al login.
    if (axios.isAxiosError(error) && error.response?.status === 401 && almacenSesion.leer()) {
      almacenSesion.borrar()
      window.location.assign('/iniciar-sesion')
    }
    return Promise.reject(error)
  },
)
