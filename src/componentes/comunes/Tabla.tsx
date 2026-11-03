import type { ReactNode } from 'react'
import estilos from './Tabla.module.css'

export type Columna<T> = { titulo: string; celda: (fila: T) => ReactNode; alineacion?: 'derecha' }

type Props<T> = { columnas: Columna<T>[]; filas: T[]; clave: (fila: T) => string }

export function Tabla<T>({ columnas, filas, clave }: Props<T>) {
  return (
    <div className={estilos.contenedor}>
      <table className={estilos.tabla}>
        <thead>
          <tr>
            {columnas.map((columna) => (
              <th key={columna.titulo} className={columna.alineacion === 'derecha' ? estilos.derecha : undefined}>
                {columna.titulo}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filas.map((fila) => (
            <tr key={clave(fila)}>
              {columnas.map((columna) => (
                <td key={columna.titulo} className={columna.alineacion === 'derecha' ? estilos.derecha : undefined}>
                  {columna.celda(fila)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
