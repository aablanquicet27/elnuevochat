import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../layout/Layout';
import { getChatbot, updateChatbot, deleteChatbot } from '../../lib/supabase';

export default function ChatbotDetail({ user }) {
  const router = useRouter();
  const { id } = router.query;
  
  const [chatbot, setChatbot] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [welcomeMessage, setWelcomeMessage] = useState('');
  const [instructions, setInstructions] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#6366F1');
  const [modelName, setModelName] = useState('gpt-3.5-turbo');
  const [temperature, setTemperature] = useState(0.7);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('general');

  useEffect(() => {
    async function loadChatbot() {
      if (!id) return;
      
      try {
        const { data, error } = await getChatbot(id);
        
        if (error) throw error;
        if (!data) throw new Error('Chatbot no encontrado');
        
        setChatbot(data);
        setName(data.name);
        setDescription(data.description || '');
        setWelcomeMessage(data.welcome_message || '¡Hola! Soy un asistente virtual. ¿En qué puedo ayudarte?');
        setInstructions(data.instructions || '');
        setPrimaryColor(data.primary_color || '#6366F1');
        setModelName(data.model_name || 'gpt-3.5-turbo');
        setTemperature(data.temperature || 0.7);
      } catch (error) {
        console.error('Error loading chatbot:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
    
    loadChatbot();
  }, [id]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      if (!user) {
        throw new Error('Debes iniciar sesión para actualizar el chatbot');
      }

      const updates = {
        name,
        description,
        welcome_message: welcomeMessage,
        instructions,
        primary_color: primaryColor,
        model_name: modelName,
        temperature: parseFloat(temperature),
      };

      const { data, error } = await updateChatbot(id, updates);
      
      if (error) {
        throw error;
      }

      setChatbot(data);
      alert('Chatbot actualizado correctamente');
    } catch (error) {
      setError(error.message || 'Error al actualizar el chatbot. Por favor, inténtalo de nuevo.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('¿Estás seguro de que quieres eliminar este chatbot? Esta acción no se puede deshacer.')) {
      return;
    }

    setDeleting(true);
    setError(null);

    try {
      const { error } = await deleteChatbot(id);
      
      if (error) {
        throw error;
      }

      router.push('/dashboard');
    } catch (error) {
      setError(error.message || 'Error al eliminar el chatbot. Por favor, inténtalo de nuevo.');
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <Layout title="Cargando Chatbot" user={user}>
        <div className="bg-gray-50 min-h-screen">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="Error" user={user}>
        <div className="bg-gray-50 min-h-screen">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => router.push('/dashboard')}
              className="btn-primary"
            >
              Volver al Dashboard
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={`Chatbot: ${chatbot.name}`} user={user}>
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{chatbot.name}</h1>
              <p className="text-gray-600 mt-2">Gestiona y personaliza tu chatbot</p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => router.push(`/chatbots/${id}/preview`)}
                className="btn-secondary"
              >
                Vista previa
              </button>
              <button
                onClick={() => router.push(`/chatbots/${id}/integrate`)}
                className="btn-primary"
              >
                Integrar
              </button>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px">
                <button
                  onClick={() => setActiveTab('general')}
                  className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                    activeTab === 'general'
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  General
                </button>
                <button
                  onClick={() => setActiveTab('training')}
                  className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                    activeTab === 'training'
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Entrenamiento
                </button>
                <button
                  onClick={() => setActiveTab('appearance')}
                  className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                    activeTab === 'appearance'
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Apariencia
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                    activeTab === 'settings'
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Configuración
                </button>
              </nav>
            </div>

            {activeTab === 'general' && (
              <form onSubmit={handleSave} className="p-6">
                <div className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Nombre del chatbot *
                    </label>
                    <div className="mt-1">
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="input"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                      Descripción
                    </label>
                    <div className="mt-1">
                      <textarea
                        id="description"
                        name="description"
                        rows={3}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="input"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="welcomeMessage" className="block text-sm font-medium text-gray-700">
                      Mensaje de bienvenida
                    </label>
                    <div className="mt-1">
                      <textarea
                        id="welcomeMessage"
                        name="welcomeMessage"
                        rows={2}
                        value={welcomeMessage}
                        onChange={(e) => setWelcomeMessage(e.target.value)}
                        className="input"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="instructions" className="block text-sm font-medium text-gray-700">
                      Instrucciones para el chatbot
                    </label>
                    <div className="mt-1">
                      <textarea
                        id="instructions"
                        name="instructions"
                        rows={4}
                        value={instructions}
                        onChange={(e) => setInstructions(e.target.value)}
                        className="input"
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      type="submit"
                      disabled={saving}
                      className={`btn-primary ${saving ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                      {saving ? 'Guardando...' : 'Guardar cambios'}
                    </button>
                  </div>
                </div>
              </form>
            )}

            {activeTab === 'training' && (
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Fuentes de datos</h3>
                <p className="text-gray-600 mb-6">
                  Añade documentos, URLs o texto para entrenar a tu chatbot con información específica.
                </p>

                <div className="bg-gray-50 p-8 rounded-lg text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Arrastra archivos aquí</h3>
                  <p className="mt-1 text-sm text-gray-500">O</p>
                  <div className="mt-4">
                    <button
                      type="button"
                      className="btn-secondary"
                    >
                      Subir archivos
                    </button>
                  </div>
                  <p className="mt-2 text-xs text-gray-500">PDF, DOCX, TXT (máx. 10MB)</p>
                </div>

                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Añadir URL</h4>
                  <div className="flex">
                    <input
                      type="url"
                      placeholder="https://ejemplo.com/pagina"
                      className="input flex-grow mr-2"
                    />
                    <button
                      type="button"
                      className="btn-primary"
                    >
                      Añadir
                    </button>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Añadir texto</h4>
                  <div className="flex flex-col">
                    <textarea
                      placeholder="Escribe o pega texto aquí..."
                      rows={4}
                      className="input mb-2"
                    />
                    <div className="flex justify-end">
                      <button
                        type="button"
                        className="btn-primary"
                      >
                        Añadir
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'appearance' && (
              <form onSubmit={handleSave} className="p-6">
                <div className="space-y-6">
                  <div>
                    <label htmlFor="primaryColor" className="block text-sm font-medium text-gray-700">
                      Color principal
                    </label>
                    <div className="mt-1 flex items-center">
                      <input
                        id="primaryColor"
                        name="primaryColor"
                        type="color"
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="h-10 w-10 rounded-md border border-gray-300 cursor-pointer"
                      />
                      <span className="ml-3 text-gray-700">{primaryColor}</span>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      type="submit"
                      disabled={saving}
                      className={`btn-primary ${saving ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                      {saving ? 'Guardando...' : 'Guardar cambios'}
                    </button>
                  </div>
                </div>
              </form>
            )}

            {activeTab === 'settings' && (
              <form onSubmit={handleSave} className="p-6">
                <div className="space-y-6">
                  <div>
                    <label htmlFor="modelName" className="block text-sm font-medium text-gray-700">
                      Modelo de IA
                    </label>
                    <div className="mt-1">
                      <select
                        id="modelName"
                        name="modelName"
                        value={modelName}
                        onChange={(e) => setModelName(e.target.value)}
                        className="input"
                      >
                        <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                        <option value="gpt-4">GPT-4</option>
                        <option value="claude-2">Claude 2</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="temperature" className="block text-sm font-medium text-gray-700">
                      Temperatura: {temperature}
                    </label>
                    <div className="mt-1">
                      <input
                        id="temperature"
                        name="temperature"
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={temperature}
                        onChange={(e) => setTemperature(e.target.value)}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Más preciso</span>
                        <span>Más creativo</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-between">
                    <button
                      type="button"
                      onClick={handleDelete}
                      disabled={deleting}
                      className={`px-4 py-2 border border-red-300 rounded-md text-red-700 hover:bg-red-50 ${
                        deleting ? 'opacity-70 cursor-not-allowed' : ''
                      }`}
                    >
                      {deleting ? 'Eliminando...' : 'Eliminar chatbot'}
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className={`btn-primary ${saving ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                      {saving ? 'Guardando...' : 'Guardar cambios'}
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
