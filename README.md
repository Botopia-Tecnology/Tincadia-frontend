<!-- prettier-ignore -->
<div align="center">

# Tincadia Frontend

[![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=flat-square&logo=next.js&logoColor=white)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61dafb?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-blue?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Bun](https://img.shields.io/badge/Bun-fbf0df?style=flat-square&logo=bun&logoColor=black)](https://bun.sh)

**Sitio web y panel de administración de Tincadia** — plataforma de tecnología inclusiva que conecta a personas sordas, oyentes y organizaciones.

[Empezar](#empezar) • [Configuración](#configuración) • [Comandos](#comandos) • [Estructura](#estructura) • [Despliegue](#despliegue)

</div>

Construido con [Next.js](https://nextjs.org) 16 (App Router) y [React](https://react.dev) 19.

## Empezar

### Requisitos

- [Node.js](https://nodejs.org) 18 o superior
- [Bun](https://bun.sh) — gestor de paquetes del proyecto
- El [backend](https://github.com/Botopia-Tecnology/Tincadia-backend) corriendo, o la URL de un entorno desplegado

### Instalación

```bash
git clone https://github.com/Botopia-Tecnology/Tincadia-frontend.git
cd Tincadia-frontend/tincadia-front
bun install
cp .env.example .env.local
```

### Ejecutar

```bash
bun dev
```

Abre [http://localhost:3000](http://localhost:3000). La página se actualiza sola al editar los archivos.

## Configuración

Rellena `.env.local` antes de arrancar:

| Variable | Descripción |
|---|---|
| `NEXT_PUBLIC_API_URL` | URL base del API Gateway |
| `NEXT_PUBLIC_API_TIMEOUT` | Timeout de las peticiones, en ms (30000 por defecto) |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Client ID de Google para el login |
| `NEXT_PUBLIC_AUTH_REFRESH_ENABLED` | Renovación automática de token |
| `NEXT_PUBLIC_AUTH_STORAGE_PREFIX` | Prefijo de las claves en localStorage |
| `NEXT_PUBLIC_CLARITY_PROJECT_ID` | Proyecto de Microsoft Clarity |

> [!WARNING]
> El `.env.example` trae `NEXT_PUBLIC_API_URL=http://localhost:3000`, que es el puerto de este mismo Next. El API Gateway escucha en **3001**, así que en local suele ser `http://localhost:3001`.

> [!CAUTION]
> Todas las variables llevan prefijo `NEXT_PUBLIC_`, así que **viajan al navegador**. Ahí no va nada secreto: ni claves de servicio, ni credenciales de base de datos.

## Comandos

| Comando | Descripción |
|---|---|
| `bun dev` | Servidor de desarrollo |
| `bun run build` | Build de producción |
| `bun start` | Compila y sirve producción |
| `bun run lint` | ESLint |

## Estructura

```
tincadia-front/
├── src/
│   ├── app/          # Rutas (App Router)
│   │   ├── admin/    # Panel de administración
│   │   └── api/      # Route handlers
│   ├── components/   # Componentes reutilizables
│   ├── config/       # Configuración y variables de entorno
│   ├── contexts/     # Contextos de React (i18n, sesión…)
│   ├── hooks/        # Hooks propios
│   ├── lib/          # Utilidades y cliente HTTP
│   ├── locales/      # Traducciones (es, en, pt)
│   ├── services/     # Clientes del API Gateway
│   ├── styles/
│   └── types/
└── public/
```

**Rutas públicas** — landing (`/`), `nosotros`, `cursos`, `pricing`, `contacto`, `empresas-inclusivas`, `ser-interprete`, `pagos`, `perfil`, `reset-password`, y las legales `terminos` y `privacidad`.

**Panel de administración** — bajo `/admin`: analítica, categorías, cursos, finanzas, formularios, edición de la landing y notificaciones. Las gráficas usan [Recharts](https://recharts.org).

### Conexión con el backend

Todo pasa por el **API Gateway**; este frontend no habla con los microservicios ni con Supabase directamente. Los clientes viven en `src/services/`, uno por dominio: `auth`, `content`, `finance`, `forms`, `notifications`, `payments`, `users`.

### Convenciones

- TypeScript en modo estricto
- Componentes en `PascalCase`, hooks en `camelCase` con prefijo `use`
- Las traducciones van en los **tres** archivos de `src/locales/` (`es`, `en`, `pt`)

## Despliegue

Pensado para [Vercel](https://vercel.com).

```bash
bun run build
```

> [!NOTE]
> Las variables de entorno se configuran en el proyecto de Vercel: no se heredan del `.env.local`, que es solo local y no se versiona.
