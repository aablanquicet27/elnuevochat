// pages/api/conversations/[id].js
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

  // Obtener el ID de la conversación de la URL
  const { id } = req.query;
  
  if (!id) {
    return res.status(400).json({ error: 'ID de conversación no proporcionado' });
  }

  // Manejar diferentes métodos HTTP
  switch (req.method) {
    case 'GET':
      return getConversation(req, res, supabase, user, id);
    case 'PUT':
      return updateConversation(req, res, supabase, user, id);
    case 'DELETE':
      return deleteConversation(req, res, supabase, user, id);
    default:
      return res.status(405).json({ error: 'Método no permitido' });
  }
}

// Obtener una conversación específica
async function getConversation(req, res, supabase, user, id) {
  try {
    // Obtener la conversación
    const { data: conversation, error: conversationError } = await supabase
      .from('conversations')
      .select('*, chatbots(user_id)')
      .eq('id', id)
      .single();

    if (conversationError || !conversation) {
      return res.status(404).json({ error: 'Conversación no encontrada' });
    }

    // Verificar que el usuario tenga acceso a esta conversación
    if (conversation.user_id !== user.id && conversation.chatbots.user_id !== user.id) {
      return res.status(403).json({ error: 'No tienes permiso para acceder a esta conversación' });
    }

    // Eliminar la información anidada de chatbots antes de devolver
    delete conversation.chatbots;

    return res.status(200).json(conversation);
  } catch (error) {
    return res.status(500).json({ error: 'Error en el servidor' });
  }
}

// Actualizar una conversación existente
async function updateConversation(req, res, supabase, user, id) {
  try {
    // Obtener la conversación para verificar permisos
    const { data: conversation, error: conversationError } = await supabase
      .from('conversations')
      .select('*, chatbots(user_id)')
      .eq('id', id)
      .single();

    if (conversationError || !conversation) {
      return res.status(404).json({ error: 'Conversación no encontrada' });
    }

    // Verificar que el usuario tenga acceso a esta conversación
    if (conversation.user_id !== user.id && conversation.chatbots.user_id !== user.id) {
      return res.status(403).json({ error: 'No tienes permiso para modificar esta conversación' });
    }

    // Extraer los campos actualizables del cuerpo de la solicitud
    const {
      title,
      is_active,
      metadata,
    } = req.body;

    // Construir objeto de actualización con los campos proporcionados
    const updates = {};
    if (title !== undefined) updates.title = title;
    if (is_active !== undefined) updates.is_active = is_active;
    if (metadata !== undefined) updates.metadata = metadata;

    // Actualizar la conversación
    const { data: updatedConversation, error: updateError } = await supabase
      .from('conversations')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      return res.status(400).json({ error: updateError.message });
    }

    return res.status(200).json(updatedConversation);
  } catch (error) {
    return res.status(500).json({ error: 'Error en el servidor' });
  }
}

// Eliminar una conversación
async function deleteConversation(req, res, supabase, user, id) {
  try {
    // Obtener la conversación para verificar permisos
    const { data: conversation, error: conversationError } = await supabase
      .from('conversations')
      .select('*, chatbots(user_id)')
      .eq('id', id)
      .single();

    if (conversationError || !conversation) {
      return res.status(404).json({ error: 'Conversación no encontrada' });
    }

    // Verificar que el usuario tenga acceso a esta conversación
    if (conversation.user_id !== user.id && conversation.chatbots.user_id !== user.id) {
      return res.status(403).json({ error: 'No tienes permiso para eliminar esta conversación' });
    }

    // Eliminar la conversación
    const { error: deleteError } = await supabase
      .from('conversations')
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
