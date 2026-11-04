const PAGINA_INICIO_SESION = '/iniciar-sesion'

/** Recarga completa hacia el login (descarta todo el estado de React). Aislado para poder simularlo en pruebas. */
export const irAlInicioSesion = () => window.location.assign(PAGINA_INICIO_SESION)
