/** Solo rutas internas ("/algo"): evita redirecciones a otros sitios. */
export function rutaInterna(ruta: unknown): string {
  return typeof ruta === 'string' && ruta.startsWith('/') && !ruta.startsWith('//') ? ruta : '/'
}
