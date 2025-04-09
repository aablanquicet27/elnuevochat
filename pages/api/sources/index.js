// pages/api/sources/index.js
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
      return getSources(req, res, supabase, user);
    case 'POST':
      return createSource(req, res, supabase, user);
    default:
      return res.status(405).json({ error: 'Método no permitido' });
  }
}

// Obtener todas las fuentes de un chatbot
async function getSources(req, res, supabase, user) {
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

    // Obtener las fuentes del chatbot
    const { data: sources, error: sourcesError } = await supabase
      .from('sources')
      .select('*')
      .eq('chatbot_id', chatbot_id)
      .order('created_at', { ascending: false });

    if (sourcesError) {
      return res.status(400).json({ error: sourcesError.message });
    }

    return res.status(200).json(sources);
  } catch (error) {
    return res.status(500).json({ error: 'Error en el servidor' });
  }
}

// Crear una nueva fuente para un chatbot
async function createSource(req, res, supabase, user) {
  const {
    chatbot_id,
    name,
    type,
    content,
    file_url,
    web_url,
  } = req.body;

  // Validar datos requeridos
  if (!chatbot_id) {
    return res.status(400).json({ error: 'ID de chatbot no proporcionado' });
  }

  if (!name) {
    return res.status(400).json({ error: 'Nombre de la fuente requerido' });
  }

  if (!type || !['pdf', 'url', 'text'].includes(type)) {
    return res.status(400).json({ error: 'Tipo de fuente inválido' });
  }

  // Validar que se proporcione el contenido adecuado según el tipo
  if (type === 'text' && !content) {
    return res.status(400).json({ error: 'Contenido requerido para fuentes de tipo texto' });
  }

  if (type === 'pdf' && !file_url) {
    return res.status(400).json({ error: 'URL de archivo requerida para fuentes de tipo PDF' });
  }

  if (type === 'url' && !web_url) {
    return res.status(400).json({ error: 'URL web requerida para fuentes de tipo URL' });
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

    // Crear la fuente
    const sourceData = {
      chatbot_id,
      name,
      type,
      content: type === 'text' ? content : null,
      file_url: type === 'pdf' ? file_url : null,
      web_url: type === 'url' ? web_url : null,
      status: 'pending',
    };

    const { data: source, error: sourceError } = await supabase
      .from('sources')
      .insert(sourceData)
      .select()
      .single();

    if (sourceError) {
      return res.status(400).json({ error: sourceError.message });
    }

    // Aquí se podría iniciar un proceso de procesamiento de la fuente
    // Por ejemplo, extraer texto de un PDF o scrapear una URL
    // Esto se haría típicamente con una función serverless o un worker

    return res.status(201).json(source);
  } catch (error) {
    return res.status(500).json({ error: 'Error en el servidor' });
  }
}
