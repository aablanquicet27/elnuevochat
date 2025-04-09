// pages/api/sources/[id].js
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export default async function handler(req, res) {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value;
        },
        set(name, value, options) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name, options) {
          cookieStore.set({ name, value: '', ...options });
        },
      },
    }
  );

  // Verificar autenticación
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    return res.status(401).json({ error: 'No autorizado' });
  }

  // Obtener el ID de la fuente de la URL
  const { id } = req.query;
  
  if (!id) {
    return res.status(400).json({ error: 'ID de fuente no proporcionado' });
  }

  // Manejar diferentes métodos HTTP
  switch (req.method) {
    case 'GET':
      return getSource(req, res, supabase, user, id);
    case 'PUT':
      return updateSource(req, res, supabase, user, id);
    case 'DELETE':
      return deleteSource(req, res, supabase, user, id);
    default:
      return res.status(405).json({ error: 'Método no permitido' });
  }
}

// Obtener una fuente específica
async function getSource(req, res, supabase, user, id) {
  try {
    // Obtener la fuente
    const { data: source, error: sourceError } = await supabase
      .from('sources')
      .select('*, chatbots(user_id)')
      .eq('id', id)
      .single();

    if (sourceError || !source) {
      return res.status(404).json({ error: 'Fuente no encontrada' });
    }

    // Verificar que el usuario tenga acceso a esta fuente
    if (source.chatbots.user_id !== user.id) {
      return res.status(403).json({ error: 'No tienes permiso para acceder a esta fuente' });
    }

    // Eliminar la información anidada de chatbots antes de devolver
    delete source.chatbots;

    return res.status(200).json(source);
  } catch (error) {
    return res.status(500).json({ error: 'Error en el servidor' });
  }
}

// Actualizar una fuente existente
async function updateSource(req, res, supabase, user, id) {
  try {
    // Obtener la fuente para verificar permisos
    const { data: source, error: sourceError } = await supabase
      .from('sources')
      .select('*, chatbots(user_id)')
      .eq('id', id)
      .single();

    if (sourceError || !source) {
      return res.status(404).json({ error: 'Fuente no encontrada' });
    }

    // Verificar que el usuario tenga acceso a esta fuente
    if (source.chatbots.user_id !== user.id) {
      return res.status(403).json({ error: 'No tienes permiso para modificar esta fuente' });
    }

    // Extraer los campos actualizables del cuerpo de la solicitud
    const {
      name,
      content,
      file_url,
      web_url,
      status,
    } = req.body;

    // Construir objeto de actualización con los campos proporcionados
    const updates = {};
    if (name !== undefined) updates.name = name;
    
    // Solo permitir actualizar el contenido si es del tipo correcto
    if (source.type === 'text' && content !== undefined) updates.content = content;
    if (source.type === 'pdf' && file_url !== undefined) updates.file_url = file_url;
    if (source.type === 'url' && web_url !== undefined) updates.web_url = web_url;
    
    // Solo permitir actualizar el estado si es un valor válido
    if (status !== undefined && ['pending', 'processing', 'completed', 'error'].includes(status)) {
      updates.status = status;
    }

    // Actualizar la fuente
    const { data: updatedSource, error: updateError } = await supabase
      .from('sources')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      return res.status(400).json({ error: updateError.message });
    }

    return res.status(200).json(updatedSource);
  } catch (error) {
    return res.status(500).json({ error: 'Error en el servidor' });
  }
}

// Eliminar una fuente
async function deleteSource(req, res, supabase, user, id) {
  try {
    // Obtener la fuente para verificar permisos
    const { data: source, error: sourceError } = await supabase
      .from('sources')
      .select('*, chatbots(user_id)')
      .eq('id', id)
      .single();

    if (sourceError || !source) {
      return res.status(404).json({ error: 'Fuente no encontrada' });
    }

    // Verificar que el usuario tenga acceso a esta fuente
    if (source.chatbots.user_id !== user.id) {
      return res.status(403).json({ error: 'No tienes permiso para eliminar esta fuente' });
    }

    // Eliminar la fuente
    const { error: deleteError } = await supabase
      .from('sources')
      .delete()
      .eq('id', id);

    if (deleteError) {
      return res.status(400).json({ error: deleteError.message });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: 'Error en el servidor' });
  }
}
