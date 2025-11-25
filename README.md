# Tincadia Frontend

Frontend de Tincadia, una plataforma de tecnología inclusiva que conecta a personas sordas, oyentes y organizaciones mediante soluciones accesibles, inteligencia artificial y herramientas de comunicación.

Este proyecto está construido con [Next.js](https://nextjs.org) y [React](https://react.dev).

## Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- [Node.js](https://nodejs.org/) (versión 18 o superior)
- [npm](https://www.npmjs.com/), [yarn](https://yarnpkg.com/), [pnpm](https://pnpm.io/) o [bun](https://bun.sh/)

## Instalación

1. Clona el repositorio:
```bash
git clone <url-del-repositorio>
cd tincadia-front
```

2. Instala las dependencias:
```bash
bun install
```

## Ejecutar el Proyecto

### Modo Desarrollo

Para ejecutar el servidor de desarrollo:

```bash
bun dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver el resultado.

La página se actualiza automáticamente cuando editas los archivos.

### Modo Producción

Para construir y ejecutar en modo producción:

```bash
# Construir la aplicación
bun run build

# Iniciar el servidor de producción
bun start
```

### Linting

Para ejecutar el linter y verificar el código:

```bash
bun run lint
```

## Scripts Disponibles

- `bun dev` - Inicia el servidor de desarrollo
- `bun run build` - Construye la aplicación para producción
- `bun start` - Inicia el servidor de producción
- `bun run lint` - Ejecuta el linter para verificar el código



## Tecnologías Utilizadas

- **Next.js 16** - Framework de React para producción
- **React 19** - Biblioteca de JavaScript para interfaces de usuario
- **TypeScript** - Superset tipado de JavaScript
- **Tailwind CSS** - Framework de CSS utility-first
- **Lucide React** - Iconos SVG

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
