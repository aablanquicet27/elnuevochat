-- Esquema de base de datos para el clon de Chatbase.co

-- Habilitar extensión UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabla de planes de suscripción (movida antes de profiles para evitar el error de referencia)
CREATE TABLE plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  interval TEXT NOT NULL, -- 'monthly' o 'yearly'
  features JSONB NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de perfiles de usuario (extiende la tabla auth.users de Supabase)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  plan_id UUID REFERENCES plans(id) DEFAULT NULL
);

-- Tabla de chatbots
CREATE TABLE chatbots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  instructions TEXT,
  welcome_message TEXT,
  avatar_url TEXT,
  is_public BOOLEAN DEFAULT FALSE,
  primary_color TEXT DEFAULT '#6366F1',
  model_name TEXT DEFAULT 'gpt-3.5-turbo',
  temperature DECIMAL(3, 2) DEFAULT 0.7,
  max_tokens INTEGER DEFAULT 2000,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de fuentes de datos para chatbots
CREATE TABLE sources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  chatbot_id UUID REFERENCES chatbots(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL, -- 'pdf', 'url', 'text', etc.
  content TEXT, -- Para texto directo
  file_url TEXT, -- Para archivos subidos
  web_url TEXT, -- Para URLs
  status TEXT DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'error'
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de conversaciones
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  chatbot_id UUID REFERENCES chatbots(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id), -- NULL para usuarios anónimos
  visitor_id TEXT, -- Para identificar usuarios anónimos
  title TEXT DEFAULT 'Nueva conversación',
  is_active BOOLEAN DEFAULT TRUE,
  metadata JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de mensajes
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL, -- 'user', 'assistant', 'system'
  content TEXT NOT NULL,
  sources JSONB DEFAULT NULL, -- Referencias a las fuentes utilizadas
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de integraciones
CREATE TABLE integrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  chatbot_id UUID REFERENCES chatbots(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL, -- 'iframe', 'chat_bubble', 'api'
  settings JSONB DEFAULT '{}'::JSONB,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de estadísticas de uso
CREATE TABLE usage_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) NOT NULL,
  chatbot_id UUID REFERENCES chatbots(id),
  message_count INTEGER DEFAULT 0,
  token_count INTEGER DEFAULT 0,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de leads generados
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  chatbot_id UUID REFERENCES chatbots(id) ON DELETE CASCADE NOT NULL,
  conversation_id UUID REFERENCES conversations(id),
  email TEXT NOT NULL,
  name TEXT,
  phone TEXT,
  metadata JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Políticas de seguridad RLS (Row Level Security)

-- Habilitar RLS en todas las tablas
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE chatbots ENABLE ROW LEVEL SECURITY;
ALTER TABLE sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Políticas para perfiles
CREATE POLICY "Usuarios pueden ver su propio perfil" 
  ON profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Usuarios pueden actualizar su propio perfil" 
  ON profiles FOR UPDATE 
  USING (auth.uid() = id);

-- Políticas para planes
CREATE POLICY "Cualquiera puede ver planes activos" 
  ON plans FOR SELECT 
  USING (is_active = TRUE);

-- Políticas para chatbots
CREATE POLICY "Usuarios pueden ver sus propios chatbots" 
  ON chatbots FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden ver chatbots públicos" 
  ON chatbots FOR SELECT 
  USING (is_public = TRUE);

CREATE POLICY "Usuarios pueden crear sus propios chatbots" 
  ON chatbots FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden actualizar sus propios chatbots" 
  ON chatbots FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden eliminar sus propios chatbots" 
  ON chatbots FOR DELETE 
  USING (auth.uid() = user_id);

-- Políticas para fuentes
CREATE POLICY "Usuarios pueden ver fuentes de sus chatbots" 
  ON sources FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM chatbots 
    WHERE chatbots.id = sources.chatbot_id 
    AND chatbots.user_id = auth.uid()
  ));

CREATE POLICY "Usuarios pueden crear fuentes para sus chatbots" 
  ON sources FOR INSERT 
  WITH CHECK (EXISTS (
    SELECT 1 FROM chatbots 
    WHERE chatbots.id = sources.chatbot_id 
    AND chatbots.user_id = auth.uid()
  ));

CREATE POLICY "Usuarios pueden actualizar fuentes de sus chatbots" 
  ON sources FOR UPDATE 
  USING (EXISTS (
    SELECT 1 FROM chatbots 
    WHERE chatbots.id = sources.chatbot_id 
    AND chatbots.user_id = auth.uid()
  ));

CREATE POLICY "Usuarios pueden eliminar fuentes de sus chatbots" 
  ON sources FOR DELETE 
  USING (EXISTS (
    SELECT 1 FROM chatbots 
    WHERE chatbots.id = sources.chatbot_id 
    AND chatbots.user_id = auth.uid()
  ));

-- Políticas para conversaciones
CREATE POLICY "Usuarios pueden ver conversaciones de sus chatbots" 
  ON conversations FOR SELECT 
  USING (
    auth.uid() = user_id OR 
    EXISTS (
      SELECT 1 FROM chatbots 
      WHERE chatbots.id = conversations.chatbot_id 
      AND chatbots.user_id = auth.uid()
    )
  );

-- Políticas para mensajes
CREATE POLICY "Usuarios pueden ver mensajes de sus conversaciones" 
  ON messages FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM conversations 
    WHERE conversations.id = messages.conversation_id 
    AND (
      conversations.user_id = auth.uid() OR 
      EXISTS (
        SELECT 1 FROM chatbots 
        WHERE chatbots.id = conversations.chatbot_id 
        AND chatbots.user_id = auth.uid()
      )
    )
  ));

-- Políticas para integraciones
CREATE POLICY "Usuarios pueden ver integraciones de sus chatbots" 
  ON integrations FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM chatbots 
    WHERE chatbots.id = integrations.chatbot_id 
    AND chatbots.user_id = auth.uid()
  ));

-- Políticas para estadísticas de uso
CREATE POLICY "Usuarios pueden ver sus propias estadísticas" 
  ON usage_stats FOR SELECT 
  USING (auth.uid() = user_id);

-- Políticas para leads
CREATE POLICY "Usuarios pueden ver leads de sus chatbots" 
  ON leads FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM chatbots 
    WHERE chatbots.id = leads.chatbot_id 
    AND chatbots.user_id = auth.uid()
  ));

-- Funciones y triggers

-- Función para actualizar el timestamp de actualización
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para actualizar el timestamp de actualización
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON profiles
FOR EACH ROW EXECUTE PROCEDURE update_updated_at();

CREATE TRIGGER update_plans_updated_at
BEFORE UPDATE ON plans
FOR EACH ROW EXECUTE PROCEDURE update_updated_at();

CREATE TRIGGER update_chatbots_updated_at
BEFORE UPDATE ON chatbots
FOR EACH ROW EXECUTE PROCEDURE update_updated_at();

CREATE TRIGGER update_sources_updated_at
BEFORE UPDATE ON sources
FOR EACH ROW EXECUTE PROCEDURE update_updated_at();

CREATE TRIGGER update_conversations_updated_at
BEFORE UPDATE ON conversations
FOR EACH ROW EXECUTE PROCEDURE update_updated_at();

CREATE TRIGGER update_integrations_updated_at
BEFORE UPDATE ON integrations
FOR EACH ROW EXECUTE PROCEDURE update_updated_at();

CREATE TRIGGER update_usage_stats_updated_at
BEFORE UPDATE ON usage_stats
FOR EACH ROW EXECUTE PROCEDURE update_updated_at();

-- Función para crear un perfil automáticamente después del registro
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'avatar_url');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para crear perfil automáticamente
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Índices para mejorar el rendimiento

-- Índices para búsquedas frecuentes
CREATE INDEX idx_chatbots_user_id ON chatbots(user_id);
CREATE INDEX idx_sources_chatbot_id ON sources(chatbot_id);
CREATE INDEX idx_conversations_chatbot_id ON conversations(chatbot_id);
CREATE INDEX idx_conversations_user_id ON conversations(user_id);
CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_integrations_chatbot_id ON integrations(chatbot_id);
CREATE INDEX idx_usage_stats_user_id ON usage_stats(user_id);
CREATE INDEX idx_usage_stats_chatbot_id ON usage_stats(chatbot_id);
CREATE INDEX idx_leads_chatbot_id ON leads(chatbot_id);

-- Datos iniciales para planes
INSERT INTO plans (name, description, price, interval, features, is_active)
VALUES 
  ('Free', 'Plan gratuito para comenzar', 0, 'monthly', '{"message_limit": 100, "kb_per_agent": 400, "team_members": 1, "agents": 1, "links_limit": 10}'::JSONB, TRUE),
  ('Hobby', 'Para uso personal o pequeños proyectos', 40, 'monthly', '{"message_limit": 2000, "kb_per_agent": 33000, "team_members": 1, "agents": 1, "actions": 5}'::JSONB, TRUE),
  ('Standard', 'Para negocios en crecimiento', 150, 'monthly', '{"message_limit": 12000, "kb_per_agent": 100000, "team_members": 3, "agents": 2, "actions": 10}'::JSONB, TRUE),
  ('Pro', 'Para empresas con necesidades avanzadas', 500, 'monthly', '{"message_limit": 45000, "kb_per_agent": 500000, "team_members": 10, "agents": 3, "actions": 20, "analytics": true}'::JSONB, TRUE);
