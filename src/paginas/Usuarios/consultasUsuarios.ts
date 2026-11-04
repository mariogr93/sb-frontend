import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { usuariosApi } from '../../api/usuariosApi'
import type { ActualizarUsuarioSolicitud, CambiarContrasenaSolicitud, CrearUsuarioSolicitud } from '../../tipos/usuarios'

export const useUsuarios = () => useQuery({ queryKey: ['usuarios'], queryFn: usuariosApi.listar })

export function useCrearUsuario() {
  const cliente = useQueryClient()
  return useMutation({
    mutationFn: (solicitud: CrearUsuarioSolicitud) => usuariosApi.crear(solicitud),
    onSuccess: () => cliente.invalidateQueries({ queryKey: ['usuarios'] }),
  })
}

export function useActualizarUsuario(id: string) {
  const cliente = useQueryClient()
  return useMutation({
    mutationFn: (solicitud: ActualizarUsuarioSolicitud) => usuariosApi.actualizar(id, solicitud),
    onSuccess: () => cliente.invalidateQueries({ queryKey: ['usuarios'] }),
  })
}

export const useCambiarContrasena = (id: string) =>
  useMutation({ mutationFn: (solicitud: CambiarContrasenaSolicitud) => usuariosApi.cambiarContrasena(id, solicitud) })

export function useDesactivarUsuario() {
  const cliente = useQueryClient()
  return useMutation({
    mutationFn: usuariosApi.desactivar,
    onSuccess: () => cliente.invalidateQueries({ queryKey: ['usuarios'] }),
  })
}
