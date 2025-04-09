# Chatbase Clone - README

Este proyecto es un clon funcional de [Chatbase.co](https://www.chatbase.co/), una plataforma que permite crear chatbots personalizados para sitios web y aplicaciones.

## Características

- Creación de chatbots personalizados sin necesidad de saber programar
- Personalización del carácter del bot, color, imagen de avatar y otros aspectos
- Entrenamiento de chatbots con diferentes fuentes de datos (texto, URLs, PDFs)
- Integración mediante iframe, chat bubble o API
- Análisis y optimización de los bots para mejorar la experiencia de usuario
- Sistema de autenticación completo
- Panel de administración para gestionar chatbots

## Tecnologías utilizadas

- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Autenticación, Almacenamiento)
- **Despliegue**: Vercel (Frontend), Supabase (Backend)

## Instalación local

1. Clonar el repositorio:
```bash
git clone https://github.com/tu-usuario/chatbase-clone.git
cd chatbase-clone
```

2. Instalar dependencias:
```bash
npm install
```

3. Crear un archivo `.env.local` con las siguientes variables:
```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

4. Configurar la base de datos en Supabase:
   - Crear un nuevo proyecto en Supabase
   - Ejecutar el script SQL en `lib/supabase-schema.sql`

5. Iniciar el servidor de desarrollo:
```bash
npm run dev
```

6. Abrir [http://localhost:3000](http://localhost:3000) en el navegador

## Estructura del proyecto

- `/components`: Componentes React reutilizables
- `/hooks`: Hooks personalizados para la lógica de negocio
- `/lib`: Utilidades y configuración
- `/pages`: Páginas de la aplicación
- `/public`: Archivos estáticos
- `/styles`: Estilos CSS

## Despliegue

Ver [DEPLOYMENT.md](./DEPLOYMENT.md) para instrucciones detalladas sobre cómo desplegar la aplicación en Vercel y Supabase.

## Contribuir

1. Hacer fork del repositorio
2. Crear una rama para tu característica (`git checkout -b feature/amazing-feature`)
3. Hacer commit de tus cambios (`git commit -m 'Add some amazing feature'`)
4. Push a la rama (`git push origin feature/amazing-feature`)
5. Abrir un Pull Request

## Licencia

Distribuido bajo la Licencia MIT. Ver `LICENSE` para más información.

## Contacto

Tu Nombre - [@tu_twitter](https://twitter.com/tu_twitter) - email@example.com

Link del proyecto: [https://github.com/tu-usuario/chatbase-clone](https://github.com/tu-usuario/chatbase-clone)
