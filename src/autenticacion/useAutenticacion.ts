import { useContext } from 'react'
import { ContextoAutenticacion } from './contextoAutenticacion'

export function useAutenticacion() {
  const contexto = useContext(ContextoAutenticacion)
  if (!contexto) throw new Error('useAutenticacion requiere ProveedorAutenticacion.')
  return contexto
}
