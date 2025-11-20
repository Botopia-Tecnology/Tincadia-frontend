# 🎨 Cómo Agregar Imágenes a los Servicios

## 📂 Ubicación de Imágenes

Coloca las imágenes en:
```
public/media/images/services/
  - clases-lengua-senas.png
  - traductor-senas.png
  - asistente-redaccion.png
```

## 🖼️ Especificaciones de Imágenes

- **Formato**: PNG o JPG
- **Dimensiones**: 800x600px (ratio 4:3)
- **Peso**: Máximo 500KB por imagen
- **Fondo**: Transparente o de color sólido

## 🔧 Actualizar el Componente

### Paso 1: Importa Image de Next.js

Ya está importado en el componente.

### Paso 2: Reemplaza el placeholder del icono

Encuentra esta sección en `Services.tsx` (línea ~80):

```tsx
{/* Icono placeholder - Reemplazar con imagen */}
<IconComponent 
  className="w-24 h-24 text-gray-400" 
  strokeWidth={1.5}
  aria-hidden="true"
/>
```

Reemplaza con:

```tsx
<Image
  src={`/media/images/services/${service.id}.png`}
  alt=""
  fill
  className="object-cover"
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>
```

## 📝 Alternativa: Agregar campo de imagen al array

### Opción 1: Agregar propiedad `image` a cada servicio

```tsx
const services = [
  {
    id: 'clases-lengua-senas',
    image: '/media/images/services/clases-lengua-senas.png', // ← Agregar
    icon: GraduationCap,
    // ... resto de propiedades
  },
  // ...
];
```

Luego en el JSX:

```tsx
<div className={`${service.bgColor} h-48 relative overflow-hidden`}>
  {service.image ? (
    <Image
      src={service.image}
      alt=""
      fill
      className="object-cover"
      sizes="(max-width: 768px) 100vw, 33vw"
    />
  ) : (
    <IconComponent 
      className="w-24 h-24 text-gray-400" 
      strokeWidth={1.5}
      aria-hidden="true"
    />
  )}
  
  {/* Badge superior */}
  <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded-full shadow-sm z-10">
    <span className="text-sm font-medium text-gray-700">
      {service.badge}
    </span>
  </div>
  
  {/* ... resto del contenido */}
</div>
```

## 🎨 Ejemplo Completo con Imagen

```tsx
<div className="bg-white h-48 relative overflow-hidden">
  <Image
    src="/media/images/services/clases-lengua-senas.png"
    alt=""
    fill
    className="object-cover"
    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  />
  
  {/* Overlay opcional para mejor legibilidad del badge */}
  <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-transparent" />
  
  {/* Badge superior */}
  <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded-full shadow-sm z-10">
    <span className="text-sm font-medium text-gray-700">
      Welcome to class!
    </span>
  </div>
  
  {/* Menú de opciones */}
  <button className="absolute top-4 right-4 p-2 bg-white hover:bg-gray-100 rounded-full transition-colors z-10">
    {/* ... */}
  </button>
</div>
```

## 💡 Tips

1. **Optimización**: Next.js optimiza automáticamente las imágenes
2. **Loading**: Agrega `loading="lazy"` para carga diferida
3. **Prioridad**: Usa `priority` solo si la imagen es above-the-fold
4. **Placeholder**: Considera usar `placeholder="blur"` con `blurDataURL`

## 🚀 Cuando tengas las imágenes listas

Avísame y actualizo el componente para usar tus imágenes reales en lugar de los iconos placeholder.

