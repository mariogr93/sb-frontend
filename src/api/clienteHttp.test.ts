import { AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios'
import { vi } from 'vitest'
import { almacenSesion } from '../autenticacion/almacenSesion'
import { irAlInicioSesion } from '../autenticacion/redireccion'
import { sembrarSesion } from '../pruebas/utilidades'
import { clienteHttp } from './clienteHttp'

vi.mock('../autenticacion/redireccion', () => ({ irAlInicioSesion: vi.fn() }))

const adaptadorOriginal = clienteHttp.defaults.adapter

function responderCon(estado: number) {
  clienteHttp.defaults.adapter = (configuracion: InternalAxiosRequestConfig) => {
    const respuesta = { status: estado, data: {}, statusText: '', headers: {}, config: configuracion } as AxiosResponse
    return estado < 400 ? Promise.resolve(respuesta) : Promise.reject(new AxiosError('fallo', String(estado), configuracion, undefined, respuesta))
  }
}

afterEach(() => {
  clienteHttp.defaults.adapter = adaptadorOriginal
})

test('SolicitudProtegidaConTokenVigenteLlevaElBearer', async () => {
  sembrarSesion('Admin')
  let autorizacion: unknown
  clienteHttp.defaults.adapter = (configuracion: InternalAxiosRequestConfig) => {
    autorizacion = configuracion.headers.Authorization
    return Promise.resolve({ status: 200, data: {}, statusText: '', headers: {}, config: configuracion } as AxiosResponse)
  }

  await clienteHttp.get('/empleados')

  expect(autorizacion).toBe('Bearer token-de-prueba')
})

test('401EnSolicitudProtegidaCierraLaSesionYVuelveAlLogin', async () => {
  sembrarSesion('Admin')
  responderCon(401)

  await expect(clienteHttp.get('/empleados')).rejects.toBeInstanceOf(AxiosError)

  expect(almacenSesion.leer()).toBeNull()
  expect(irAlInicioSesion).toHaveBeenCalledTimes(1)
})

test('401ConTokenYaVencidoTambienCierraLaSesion', async () => {
  // Caso del hallazgo: vencido = sin cabecera Bearer; el 401 igual debe llevar al login.
  sembrarSesion('Admin', -1000)
  responderCon(401)

  await expect(clienteHttp.get('/empleados')).rejects.toBeInstanceOf(AxiosError)

  expect(irAlInicioSesion).toHaveBeenCalledTimes(1)
})

test('401DeCredencialesIncorrectasNoRedirige', async () => {
  responderCon(401)

  await expect(clienteHttp.post('/autenticacion/iniciar-sesion', {})).rejects.toBeInstanceOf(AxiosError)

  expect(irAlInicioSesion).not.toHaveBeenCalled()
})

test('OtrosErroresNoCierranLaSesion', async () => {
  sembrarSesion('Admin')
  responderCon(409)

  await expect(clienteHttp.get('/empleados')).rejects.toBeInstanceOf(AxiosError)

  expect(almacenSesion.leer()).not.toBeNull()
  expect(irAlInicioSesion).not.toHaveBeenCalled()
})
