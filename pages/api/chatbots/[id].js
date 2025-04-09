// pages/api/chatbots/[id].js
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

  // Obtener el ID del chatbot de la URL
  const { id } = req.query;
  
  if (!id) {
    return res.status(400).json({ error: 'ID de chatbot no proporcionado' });
  }

  // Manejar diferentes métodos HTTP
  switch (req.method) {
    case 'GET':
      return getChatbot(req, res, supabase, user, id);
    case 'PUT':
      return updateChatbot(req, res, supabase, user, id);
    case 'DELETE':
      return deleteChatbot(req, res, supabase, user, id);
    default:
      return res.status(405).json({ error: 'Método no permitido' });
  }
}

// Obtener un chatbot específico
async function getChatbot(req, res, supabase, user, id) {
  try {
    // Primero verificamos que el chatbot pertenezca al usuario
    const { data: chatbot, error } = await supabase
      .from('chatbots')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      return res.status(404).json({ error: 'Chatbot no encontrado' });
    }

    // Verificar que el chatbot pertenezca al usuario o sea público
    if (chatbot.user_id !== user.id && !chatbot.is_public) {
      return res.status(403).json({ error: 'No tienes permiso para acceder a este chatbot' });
    }

    return res.status(200).json(chatbot);
  } catch (error) {
    return res.status(500).json({ error: 'Error en el servidor' });
  }
}

// Actualizar un chatbot existente
async function updateChatbot(req, res, supabase, user, id) {
  try {
    // Primero verificamos que el chatbot pertenezca al usuario
    const { data: existingChatbot, error: fetchError } = await supabase
      .from('chatbots')
      .select('user_id')
      .eq('id', id)
      .single();

    if (fetchError || !existingChatbot) {
      return res.status(404).json({ error: 'Chatbot no encontrado' });
    }

    if (existingChatbot.user_id !== user.id) {
      return res.status(403).json({ error: 'No tienes permiso para modificar este chatbot' });
    }

    // Extraer los campos actualizables del cuerpo de la solicitud
    const {
      name,
      description,
      welcome_message,
      instructions,
      primary_color,
      model_name,
      temperature,
      is_public,
      avatar_url,
      max_tokens,
    } = req.body;

    // Construir objeto de actualización con los campos proporcionados
    const updates = {};
    if (name !== undefined) updates.name = name;
    if (description !== undefined) updates.description = description;
    if (welcome_message !== undefined) updates.welcome_message = welcome_message;
    if (instructions !== undefined) updates.instructions = instructions;
    if (primary_color !== undefined) updates.primary_color = primary_color;
    if (model_name !== undefined) updates.model_name = model_name;
    if (temperature !== undefined) updates.temperature = parseFloat(temperature);
    if (is_public !== undefined) updates.is_public = is_public;
    if (avatar_url !== undefined) updates.avatar_url = avatar_url;
    if (max_tokens !== undefined) updates.max_tokens = parseInt(max_tokens);

    // Actualizar el chatbot
    const { data: updatedChatbot, error: updateError } = await supabase
      .from('chatbots')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      return res.status(400).json({ error: updateError.message });
    }

    return res.status(200).json(updatedChatbot);
  } catch (error) {
    return res.status(500).json({ error: 'Error en el servidor' });
  }
}

// Eliminar un chatbot
async function deleteChatbot(req, res, supabase, user, id) {
  try {
    // Primero verificamos que el chatbot pertenezca al usuario
    const { data: existingChatbot, error: fetchError } = await supabase
      .from('chatbots')
      .select('user_id')
      .eq('id', id)
      .single();

    if (fetchError || !existingChatbot) {
      return res.status(404).json({ error: 'Chatbot no encontrado' });
    }

    if (existingChatbot.user_id !== user.id) {
      return res.status(403).json({ error: 'No tienes permiso para eliminar este chatbot' });
    }

    // Eliminar el chatbot
    const { error: deleteError } = await supabase
      .from('chatbots')
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
