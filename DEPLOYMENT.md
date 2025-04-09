# Chatbase Clone - Configuración de Despliegue

Este archivo contiene instrucciones para desplegar la aplicación en Vercel y conectarla con Supabase.

## Requisitos previos

1. Cuenta en [Vercel](https://vercel.com)
2. Cuenta en [Supabase](https://supabase.com)
3. Cuenta en [GitHub](https://github.com) (para alojar el código)

## Configuración de Supabase

1. Crear un nuevo proyecto en Supabase
2. En la sección SQL Editor, ejecutar el script `lib/supabase-schema.sql`
3. Configurar autenticación:
   - Ir a Authentication > Settings
   - Habilitar "Email" como proveedor
   - Configurar URL de redirección: `https://tu-dominio.vercel.app/api/auth/callback`
4. Obtener credenciales:
   - Project URL: En Project Settings > API
   - Anon Key: En Project Settings > API

## Configuración de Vercel

1. Importar el repositorio desde GitHub
2. Configurar variables de entorno:
   - `NEXT_PUBLIC_SUPABASE_URL`: URL del proyecto de Supabase
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Clave anónima de Supabase
3. Desplegar el proyecto

## Verificación post-despliegue

1. Verificar que la página principal carga correctamente
2. Probar el registro e inicio de sesión
3. Crear un chatbot de prueba
4. Verificar que todas las funcionalidades trabajan correctamente

## Solución de problemas comunes

- **Error de autenticación**: Verificar las URLs de redirección en Supabase
- **Error de base de datos**: Verificar que el esquema SQL se ejecutó correctamente
- **Error de API**: Verificar las variables de entorno en Vercel
