// pages/api/integrations/[id].js
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

  // Obtener el ID de la integración de la URL
  const { id } = req.query;
  
  if (!id) {
    return res.status(400).json({ error: 'ID de integración no proporcionado' });
  }

  // Manejar diferentes métodos HTTP
  switch (req.method) {
    case 'GET':
      return getIntegration(req, res, supabase, user, id);
    case 'PUT':
      return updateIntegration(req, res, supabase, user, id);
    case 'DELETE':
      return deleteIntegration(req, res, supabase, user, id);
    default:
      return res.status(405).json({ error: 'Método no permitido' });
  }
}

// Obtener una integración específica
async function getIntegration(req, res, supabase, user, id) {
  try {
    // Obtener la integración
    const { data: integration, error: integrationError } = await supabase
      .from('integrations')
      .select('*, chatbots(user_id)')
      .eq('id', id)
      .single();

    if (integrationError || !integration) {
      return res.status(404).json({ error: 'Integración no encontrada' });
    }

    // Verificar que el usuario tenga acceso a esta integración
    if (integration.chatbots.user_id !== user.id) {
      return res.status(403).json({ error: 'No tienes permiso para acceder a esta integración' });
    }

    // Eliminar la información anidada de chatbots antes de devolver
    delete integration.chatbots;

    return res.status(200).json(integration);
  } catch (error) {
    return res.status(500).json({ error: 'Error en el servidor' });
  }
}

// Actualizar una integración existente
async function updateIntegration(req, res, supabase, user, id) {
  try {
    // Obtener la integración para verificar permisos
    const { data: integration, error: integrationError } = await supabase
      .from('integrations')
      .select('*, chatbots(user_id)')
      .eq('id', id)
      .single();

    if (integrationError || !integration) {
      return res.status(404).json({ error: 'Integración no encontrada' });
    }

    // Verificar que el usuario tenga acceso a esta integración
    if (integration.chatbots.user_id !== user.id) {
      return res.status(403).json({ error: 'No tienes permiso para modificar esta integración' });
    }

    // Extraer los campos actualizables del cuerpo de la solicitud
    const {
      settings,
      is_active,
    } = req.body;

    // Construir objeto de actualización con los campos proporcionados
    const updates = {};
    if (settings !== undefined) updates.settings = settings;
    if (is_active !== undefined) updates.is_active = is_active;

    // Actualizar la integración
    const { data: updatedIntegration, error: updateError } = await supabase
      .from('integrations')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      return res.status(400).json({ error: updateError.message });
    }

    return res.status(200).json(updatedIntegration);
  } catch (error) {
    return res.status(500).json({ error: 'Error en el servidor' });
  }
}

// Eliminar una integración
async function deleteIntegration(req, res, supabase, user, id) {
  try {
    // Obtener la integración para verificar permisos
    const { data: integration, error: integrationError } = await supabase
      .from('integrations')
      .select('*, chatbots(user_id)')
      .eq('id', id)
      .single();

    if (integrationError || !integration) {
      return res.status(404).json({ error: 'Integración no encontrada' });
    }

    // Verificar que el usuario tenga acceso a esta integración
    if (integration.chatbots.user_id !== user.id) {
      return res.status(403).json({ error: 'No tienes permiso para eliminar esta integración' });
    }

    // Eliminar la integración
    const { error: deleteError } = await supabase
      .from('integrations')
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
