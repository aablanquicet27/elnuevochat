# Configuración para Supabase
Este archivo contiene instrucciones para configurar Supabase en producción.

## Pasos para configurar Supabase

1. Crear un nuevo proyecto en Supabase (https://app.supabase.io)
2. Obtener las credenciales de API (URL y Anon Key)
3. Ejecutar el script de esquema de base de datos (supabase-schema.sql)
4. Configurar las políticas de seguridad RLS (Row Level Security)
5. Configurar autenticación por correo electrónico

## Variables de entorno necesarias

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Políticas de seguridad recomendadas

Para cada tabla, configurar políticas RLS que permitan:
- Lectura: solo al propietario de los datos o administradores
- Escritura: solo al propietario de los datos o administradores
- Eliminación: solo al propietario de los datos o administradores

## Configuración de autenticación

1. Habilitar autenticación por correo electrónico
2. Configurar plantillas de correo electrónico para:
   - Confirmación de registro
   - Restablecimiento de contraseña
   - Cambio de correo electrónico
3. Configurar URL de redirección para autenticación
