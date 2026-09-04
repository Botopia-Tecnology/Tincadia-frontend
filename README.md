# Tincadia Frontend

Sitio web y panel de administración de Tincadia, plataforma de tecnología inclusiva que conecta a personas sordas, oyentes y organizaciones.

Construido con [Next.js](https://nextjs.org) 16 (App Router) y [React](https://react.dev) 19.

## Requisitos previos

- [Node.js](https://nodejs.org/) 18 o superior
- [Bun](https://bun.sh/) (gestor de paquetes del proyecto)
- El [backend](https://github.com/Botopia-Tecnology/Tincadia-backend) corriendo, o la URL de un entorno desplegado

## Instalación

```bash
bun install
cp .env.example .env.local
```

Rellena `.env.local` antes de arrancar. Lo mínimo es `NEXT_PUBLIC_API_URL`.

> **Cuidado con el puerto.** El `.env.example` trae `http://localhost:3000`, que es el puerto donde corre este mismo Next. El API Gateway escucha en **3001**, así que en local suele ser `http://localhost:3001`.

Todas las variables llevan prefijo `NEXT_PUBLIC_`, así que **viajan al navegador**. Ahí no va nada secreto: ni claves de servicio, ni credenciales de base de datos.

## Ejecución

```bash
bun dev            # desarrollo, http://localhost:3000
bun run build      # build de producción
bun start          # compila y sirve producción
bun run lint       # ESLint
```

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

### Rutas públicas

Landing (`/`), `nosotros`, `cursos`, `pricing`, `contacto`, `empresas-inclusivas`, `ser-interprete`, `pagos`, `perfil`, `reset-password`, y las legales `terminos` y `privacidad`.

### Panel de administración

Bajo `/admin`: analítica, categorías, cursos, finanzas, formularios, edición de la landing y notificaciones. Las gráficas usan **Recharts**.

## Conexión con el backend

Todo pasa por el **API Gateway**; este frontend no habla con los microservicios ni con Supabase directamente. Los clientes viven en `src/services/`, uno por dominio (`auth`, `content`, `finance`, `forms`, `notifications`, `payments`, `users`).

La URL base y el timeout salen de `NEXT_PUBLIC_API_URL` y `NEXT_PUBLIC_API_TIMEOUT`.

## Internacionalización

Español, inglés y portugués en `src/locales/`. Al añadir una clave, edítala en los **tres** archivos.

## Tecnologías

- **Next.js 16** con App Router
- **React 19**
- **TypeScript** en modo estricto
- **Tailwind CSS 4**
- **Recharts** para las gráficas del panel
- **Microsoft Clarity** para analítica de uso

## Despliegue

Pensado para [Vercel](https://vercel.com/). Hay que configurar las variables de entorno en el proyecto: no se heredan del `.env.local`, que es solo local y no se versiona.

## Licencia

Privado — Tincadia.
