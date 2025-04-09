// pages/api/messages/index.js
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

  // Manejar diferentes métodos HTTP
  switch (req.method) {
    case 'GET':
      return getMessages(req, res, supabase, user);
    case 'POST':
      return createMessage(req, res, supabase, user);
    default:
      return res.status(405).json({ error: 'Método no permitido' });
  }
}

// Obtener todos los mensajes de una conversación
async function getMessages(req, res, supabase, user) {
  const { conversation_id } = req.query;

  if (!conversation_id) {
    return res.status(400).json({ error: 'ID de conversación no proporcionado' });
  }

  try {
    // Primero verificamos que el usuario tenga acceso a esta conversación
    const { data: conversation, error: conversationError } = await supabase
      .from('conversations')
      .select('user_id, chatbot_id, chatbots(user_id)')
      .eq('id', conversation_id)
      .single();

    if (conversationError || !conversation) {
      return res.status(404).json({ error: 'Conversación no encontrada' });
    }

    // Verificar que el usuario tenga acceso a esta conversación
    if (conversation.user_id !== user.id && conversation.chatbots.user_id !== user.id) {
      return res.status(403).json({ error: 'No tienes permiso para acceder a esta conversación' });
    }

    // Obtener los mensajes de la conversación
    const { data: messages, error: messagesError } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversation_id)
      .order('created_at', { ascending: true });

    if (messagesError) {
      return res.status(400).json({ error: messagesError.message });
    }

    return res.status(200).json(messages);
  } catch (error) {
    return res.status(500).json({ error: 'Error en el servidor' });
  }
}

// Crear un nuevo mensaje
async function createMessage(req, res, supabase, user) {
  const {
    conversation_id,
    role,
    content,
    sources,
  } = req.body;

  // Validar datos requeridos
  if (!conversation_id) {
    return res.status(400).json({ error: 'ID de conversación no proporcionado' });
  }

  if (!role || !['user', 'assistant', 'system'].includes(role)) {
    return res.status(400).json({ error: 'Rol inválido' });
  }

  if (!content) {
    return res.status(400).json({ error: 'Contenido del mensaje requerido' });
  }

  try {
    // Verificar que el usuario tenga acceso a esta conversación
    const { data: conversation, error: conversationError } = await supabase
      .from('conversations')
      .select('user_id, chatbot_id, chatbots(user_id)')
      .eq('id', conversation_id)
      .single();

    if (conversationError || !conversation) {
      return res.status(404).json({ error: 'Conversación no encontrada' });
    }

    // Verificar que el usuario tenga acceso a esta conversación
    if (conversation.user_id !== user.id && conversation.chatbots.user_id !== user.id) {
      return res.status(403).json({ error: 'No tienes permiso para acceder a esta conversación' });
    }

    // Crear el mensaje
    const messageData = {
      conversation_id,
      role,
      content,
      sources: sources || null,
    };

    const { data: message, error: messageError } = await supabase
      .from('messages')
      .insert(messageData)
      .select()
      .single();

    if (messageError) {
      return res.status(400).json({ error: messageError.message });
    }

    // Actualizar la fecha de actualización de la conversación
    await supabase
      .from('conversations')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', conversation_id);

    // Si el mensaje es del usuario, generar una respuesta del asistente
    if (role === 'user') {
      // Aquí iría la lógica para generar una respuesta con IA
      // Por ahora, simplemente devolvemos el mensaje creado
      // En una implementación real, esto se haría con un worker o función serverless
    }

    return res.status(201).json(message);
  } catch (error) {
    return res.status(500).json({ error: 'Error en el servidor' });
  }
}
