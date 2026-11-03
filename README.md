# SB Frontend

Cliente web de [SB.SistemaNomina](https://github.com/mariogr93/sb-backend-api): empleados, pagos semanales, nóminas, entidades gubernamentales, departamentos y usuarios.

> 🚧 En construcción. El README final se completa en el último paso.

## Tecnologías

React + TypeScript + Vite, React Router, TanStack Query, React Hook Form + Zod, Axios. Pruebas: Vitest + Testing Library.

## Requisitos

- Node.js 22.22.2 o superior (o 24)
- API en ejecución: `dotnet run --project src/SB.SistemaNomina.API --launch-profile http` (repositorio `sb-backend-api`)

## Ejecución

```bash
cp .env.example .env
npm install
npm run dev
```

Abre http://localhost:5173 (origen permitido por el CORS de la API).

## Scripts

| Comando | Acción |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Compilación de producción |
| `npm run lint` | ESLint |
| `npm test` | Pruebas (Vitest) |
