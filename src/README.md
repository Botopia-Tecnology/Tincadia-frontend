# Estructura del Proyecto (Feature-Based)

Esta estructura sigue el patrón **Feature-Based** en lugar de agrupar por tipo de archivo.

## 📁 Estructura de Carpetas

```
src/
├── app/                 # Rutas (Pages) - Next.js App Router
│   ├── layout.tsx       # Layout principal
│   └── page.tsx         # Página principal (Home)
├── components/          # Componentes UI genéricos y reutilizables
│   └── ui/              # Componentes de shadcn/ui
├── features/            # ⭐ CLAVE: Lógica de negocio agrupada por funcionalidad
│   ├── auth/            # Todo lo relacionado a autenticación
│   │   ├── components/  # Ej: LoginForm.tsx, RegisterForm.tsx
│   │   ├── hooks/       # Ej: useAuth.ts, useLogin.ts
│   │   └── types/       # Ej: auth.types.ts
│   └── dashboard/       # Todo lo del dashboard
│       ├── components/
│       ├── hooks/
│       └── types/
├── lib/                 # Utilidades y configuraciones
│   └──                  # Ej: axios.ts, fetcher.ts, utils.ts
├── hooks/               # Hooks globales compartidos
│   └──                  # Ej: useScroll.ts, useDebounce.ts
└── types/               # Definiciones de tipos globales
    └──                  # Ej: global.types.ts, api.types.ts
```

## 🎯 Reglas del Proyecto

1. **Tech Stack**: Next.js (App Router), TypeScript, Tailwind CSS, Zustand
2. **Estilo**: Usa componentes de Shadcn/ui ubicados en `@/components/ui`
3. **Importaciones**: Usa alias `@/` para evitar rutas relativas largas
4. **Datos**: Usa Server Actions para mutaciones de datos, no `useEffect` si es posible
5. **Estructura**: Si creas una nueva funcionalidad (ej: 'pagos'), crea una carpeta en `src/features/pagos`

## 📝 Ejemplos de Uso

### Importaciones con alias `@/`
```typescript
// ✅ Correcto
import { Button } from '@/components/ui/button';
import { useAuth } from '@/features/auth/hooks/useAuth';

// ❌ Evitar
import { Button } from '../../../components/ui/button';
```

### Creando una nueva feature
Cuando agregues una nueva funcionalidad, crea su carpeta en `features/`:
```
src/features/payments/
├── components/
│   ├── PaymentForm.tsx
│   └── PaymentHistory.tsx
├── hooks/
│   └── usePayment.ts
└── types/
    └── payment.types.ts
```

