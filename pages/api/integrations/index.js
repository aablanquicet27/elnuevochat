// pages/api/integrations/index.js
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
      return getIntegrations(req, res, supabase, user);
    case 'POST':
      return createIntegration(req, res, supabase, user);
    default:
      return res.status(405).json({ error: 'Método no permitido' });
  }
}

// Obtener todas las integraciones de un chatbot
async function getIntegrations(req, res, supabase, user) {
  const { chatbot_id } = req.query;

  if (!chatbot_id) {
    return res.status(400).json({ error: 'ID de chatbot no proporcionado' });
  }

  try {
    // Primero verificamos que el chatbot pertenezca al usuario
    const { data: chatbot, error: chatbotError } = await supabase
      .from('chatbots')
      .select('user_id')
      .eq('id', chatbot_id)
      .single();

    if (chatbotError || !chatbot) {
      return res.status(404).json({ error: 'Chatbot no encontrado' });
    }

    if (chatbot.user_id !== user.id) {
      return res.status(403).json({ error: 'No tienes permiso para acceder a este chatbot' });
    }

    // Obtener las integraciones del chatbot
    const { data: integrations, error: integrationsError } = await supabase
      .from('integrations')
      .select('*')
      .eq('chatbot_id', chatbot_id)
      .order('created_at', { ascending: false });

    if (integrationsError) {
      return res.status(400).json({ error: integrationsError.message });
    }

    return res.status(200).json(integrations);
  } catch (error) {
    return res.status(500).json({ error: 'Error en el servidor' });
  }
}

// Crear una nueva integración para un chatbot
async function createIntegration(req, res, supabase, user) {
  const {
    chatbot_id,
    type,
    settings,
    is_active,
  } = req.body;

  // Validar datos requeridos
  if (!chatbot_id) {
    return res.status(400).json({ error: 'ID de chatbot no proporcionado' });
  }

  if (!type || !['iframe', 'chat_bubble', 'api'].includes(type)) {
    return res.status(400).json({ error: 'Tipo de integración inválido' });
  }

  try {
    // Primero verificamos que el chatbot pertenezca al usuario
    const { data: chatbot, error: chatbotError } = await supabase
      .from('chatbots')
      .select('user_id')
      .eq('id', chatbot_id)
      .single();

    if (chatbotError || !chatbot) {
      return res.status(404).json({ error: 'Chatbot no encontrado' });
    }

    if (chatbot.user_id !== user.id) {
      return res.status(403).json({ error: 'No tienes permiso para modificar este chatbot' });
    }

    // Crear la integración
    const integrationData = {
      chatbot_id,
      type,
      settings: settings || {},
      is_active: is_active !== undefined ? is_active : true,
    };

    const { data: integration, error: integrationError } = await supabase
      .from('integrations')
      .insert(integrationData)
      .select()
      .single();

    if (integrationError) {
      return res.status(400).json({ error: integrationError.message });
    }

    return res.status(201).json(integration);
  } catch (error) {
    return res.status(500).json({ error: 'Error en el servidor' });
  }
}
