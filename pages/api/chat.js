// pages/api/chat.js
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

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

  const { chatbotId, message, conversationId, visitorId } = req.body;

  if (!chatbotId) {
    return res.status(400).json({ error: 'ID de chatbot no proporcionado' });
  }

  if (!message) {
    return res.status(400).json({ error: 'Mensaje no proporcionado' });
  }

  try {
    // Verificar que el chatbot exista
    const { data: chatbot, error: chatbotError } = await supabase
      .from('chatbots')
      .select('*')
      .eq('id', chatbotId)
      .single();

    if (chatbotError || !chatbot) {
      return res.status(404).json({ error: 'Chatbot no encontrado' });
    }

    // Obtener o crear una conversación
    let conversation;
    if (conversationId) {
      // Verificar que la conversación exista y pertenezca al chatbot
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .eq('id', conversationId)
        .eq('chatbot_id', chatbotId)
        .single();

      if (error || !data) {
        return res.status(404).json({ error: 'Conversación no encontrada' });
      }
      conversation = data;
    } else {
      // Crear una nueva conversación
      const { data, error } = await supabase
        .from('conversations')
        .insert({
          chatbot_id: chatbotId,
          title: 'Nueva conversación',
          visitor_id: visitorId || null,
          is_active: true,
        })
        .select()
        .single();

      if (error) {
        return res.status(400).json({ error: error.message });
      }
      conversation = data;
    }

    // Guardar el mensaje del usuario
    const { data: userMessage, error: messageError } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversation.id,
        role: 'user',
        content: message,
      })
      .select()
      .single();

    if (messageError) {
      return res.status(400).json({ error: messageError.message });
    }

    // Actualizar la fecha de actualización de la conversación
    await supabase
      .from('conversations')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', conversation.id);

    // Generar respuesta del chatbot
    // En una implementación real, aquí se llamaría a un modelo de IA
    // Por ahora, generamos una respuesta simple
    const botResponse = `Esta es una respuesta de ejemplo del chatbot "${chatbot.name}". En una implementación real, esta respuesta sería generada por un modelo de IA basado en las fuentes de datos proporcionadas.`;

    // Guardar la respuesta del chatbot
    const { data: assistantMessage, error: assistantError } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversation.id,
        role: 'assistant',
        content: botResponse,
      })
      .select()
      .single();

    if (assistantError) {
      return res.status(400).json({ error: assistantError.message });
    }

    // Actualizar estadísticas de uso
    // En una implementación real, aquí se actualizarían las estadísticas de uso

    return res.status(200).json({
      message: botResponse,
      conversationId: conversation.id,
      messageId: assistantMessage.id,
    });
  } catch (error) {
    console.error('Error en el chat:', error);
    return res.status(500).json({ error: 'Error en el servidor' });
  }
}
