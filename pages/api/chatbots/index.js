// pages/api/chatbots/index.js
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
      return getChatbots(req, res, supabase, user);
    case 'POST':
      return createChatbot(req, res, supabase, user);
    default:
      return res.status(405).json({ error: 'Método no permitido' });
  }
}

// Obtener todos los chatbots del usuario
async function getChatbots(req, res, supabase, user) {
  try {
    const { data, error } = await supabase
      .from('chatbots')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: 'Error en el servidor' });
  }
}

// Crear un nuevo chatbot
async function createChatbot(req, res, supabase, user) {
  const {
    name,
    description,
    welcome_message,
    instructions,
    primary_color,
    model_name,
    temperature,
  } = req.body;

  // Validar datos requeridos
  if (!name) {
    return res.status(400).json({ error: 'El nombre del chatbot es requerido' });
  }

  try {
    const chatbotData = {
      user_id: user.id,
      name,
      description: description || '',
      welcome_message: welcome_message || '¡Hola! Soy un asistente virtual. ¿En qué puedo ayudarte?',
      instructions: instructions || '',
      primary_color: primary_color || '#6366F1',
      model_name: model_name || 'gpt-3.5-turbo',
      temperature: parseFloat(temperature || 0.7),
      is_public: false,
    };

    const { data, error } = await supabase
      .from('chatbots')
      .insert(chatbotData)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(201).json(data);
  } catch (error) {
    return res.status(500).json({ error: 'Error en el servidor' });
  }
}
