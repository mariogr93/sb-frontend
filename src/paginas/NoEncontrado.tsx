import { Link } from 'react-router-dom'

export function NoEncontrado() {
  return (
    <div>
      <p>La página que busca no existe.</p>
      <Link to="/">Volver al inicio</Link>
    </div>
  )
}
