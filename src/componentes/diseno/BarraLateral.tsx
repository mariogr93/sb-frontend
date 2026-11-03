import { NavLink } from 'react-router-dom'
import logo from '../../recursos/SUPERINTENDENCIA_DE_BANCOS.png'
import iconoInicio from '../../recursos/home.svg'
import estilos from './BarraLateral.module.css'

type Opcion = { ruta: string; etiqueta: string; exacta?: boolean; icono?: string }

const OPCIONES: Opcion[] = [
  { ruta: '/', etiqueta: 'Inicio', exacta: true, icono: iconoInicio },
  { ruta: '/empleados', etiqueta: 'Consulta', exacta: true },
  { ruta: '/empleados/nuevo', etiqueta: 'Crear registro' },
  { ruta: '/reporte-semanal', etiqueta: 'Reporte semanal' },
  { ruta: '/nominas', etiqueta: 'Nóminas' },
  { ruta: '/entidades-gubernamentales', etiqueta: 'Entidades gubernamentales' },
  { ruta: '/departamentos', etiqueta: 'Departamentos' },
  { ruta: '/usuarios', etiqueta: 'Usuarios' },
]

export function BarraLateral() {
  return (
    <aside className={estilos.barra}>
      <img className={estilos.logo} src={logo} alt="Superintendencia de Bancos de la República Dominicana" />
      <nav className={estilos.menu}>
        {OPCIONES.map((opcion) => (
          <NavLink
            key={opcion.ruta}
            to={opcion.ruta}
            end={opcion.exacta}
            className={({ isActive }) => `${estilos.opcion} ${isActive ? estilos.activa : ''}`}
          >
            {opcion.icono && <img src={opcion.icono} alt="" width={24} height={24} />}
            <span>{opcion.etiqueta}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
