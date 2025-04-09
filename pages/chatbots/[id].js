import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../hooks/useAuth';
import { useChatbots } from '../../hooks/useChatbots';
import { useSources } from '../../hooks/useSources';
import Layout from '../../components/layout/Layout';

export default function ChatbotDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { user, isAuthenticated } = useAuth();
  const { getChatbot, updateChatbot, loading: chatbotLoading, error: chatbotError } = useChatbots();
  const { getSources, createSource, loading: sourcesLoading, error: sourcesError } = useSources();
  
  const [chatbot, setChatbot] = useState(null);
  const [sources, setSources] = useState([]);
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Formulario para edición general
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    welcome_message: '',
    instructions: '',
    primary_color: '#6366F1',
    model_name: 'gpt-3.5-turbo',
    temperature: 0.7,
    is_public: false,
  });
  
  // Formulario para añadir fuente
  const [sourceForm, setSourceForm] = useState({
    type: 'text',
    name: '',
    content: '',
    web_url: '',
    file_url: '',
  });

  useEffect(() => {
    // Redirigir si no está autenticado
    if (!isAuthenticated && !chatbotLoading) {
      router.push('/auth/signin');
    }
  }, [isAuthenticated, chatbotLoading, router]);

  useEffect(() => {
    // Cargar datos del chatbot cuando el ID esté disponible
    if (id && isAuthenticated) {
      const loadChatbot = async () => {
        setLoading(true);
        setError('');
        
        const { data, error } = await getChatbot(id);
        
        if (error) {
          setError(error);
          setLoading(false);
          return;
        }
        
        if (data) {
          setChatbot(data);
          setFormData({
            name: data.name || '',
            description: data.description || '',
            welcome_message: data.welcome_message || '',
            instructions: data.instructions || '',
            primary_color: data.primary_color || '#6366F1',
            model_name: data.model_name || 'gpt-3.5-turbo',
            temperature: data.temperature || 0.7,
            is_public: data.is_public || false,
          });
          
          // Cargar fuentes
          const { data: sourcesData, error: sourcesError } = await getSources(id);
          
          if (!sourcesError && sourcesData) {
            setSources(sourcesData);
          }
        }
        
        setLoading(false);
      };
      
      loadChatbot();
    }
  }, [id, isAuthenticated, getChatbot, getSources]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSourceChange = (e) => {
    const { name, value } = e.target;
    setSourceForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    const { data, error } = await updateChatbot(id, formData);
    
    if (error) {
      setError(error);
      return;
    }
    
    if (data) {
      setChatbot(data);
      setSuccess('Chatbot actualizado correctamente');
      
      // Ocultar mensaje de éxito después de 3 segundos
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    }
  };

  const handleAddSource = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    // Validar formulario según el tipo de fuente
    if (!sourceForm.name.trim()) {
      setError('El nombre de la fuente es obligatorio');
      return;
    }
    
    if (sourceForm.type === 'text' && !sourceForm.content.trim()) {
      setError('El contenido es obligatorio para fuentes de tipo texto');
      return;
    }
    
    if (sourceForm.type === 'url' && !sourceForm.web_url.trim()) {
      setError('La URL es obligatoria para fuentes de tipo URL');
      return;
    }
    
    if (sourceForm.type === 'pdf' && !sourceForm.file_url.trim()) {
      setError('La URL del archivo es obligatoria para fuentes de tipo PDF');
      return;
    }
    
    const sourceData = {
      chatbot_id: id,
      name: sourceForm.name,
      type: sourceForm.type,
      content: sourceForm.type === 'text' ? sourceForm.content : null,
      web_url: sourceForm.type === 'url' ? sourceForm.web_url : null,
      file_url: sourceForm.type === 'pdf' ? sourceForm.file_url : null,
    };
    
    const { data, error } = await createSource(sourceData);
    
    if (error) {
      setError(error);
      return;
    }
    
    if (data) {
      // Actualizar lista de fuentes
      setSources(prev => [data, ...prev]);
      
      // Limpiar formulario
      setSourceForm({
        type: 'text',
        name: '',
        content: '',
        web_url: '',
        file_url: '',
      });
      
      setSuccess('Fuente añadida correctamente');
      
      // Ocultar mensaje de éxito después de 3 segundos
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    }
  };

  const handleIntegration = () => {
    router.push(`/chatbots/${id}/integration`);
  };

  if (loading) {
    return (
      <Layout title="Cargando...">
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      </Layout>
    );
  }

  if (error && !chatbot) {
    return (
      <Layout title="Error" user={user}>
        <div className="bg-gray-50 min-h-screen">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-red-50 border-l-4 border-red-500 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                  <button
                    onClick={() => router.push('/dashboard')}
                    className="mt-2 text-sm text-red-700 underline"
                  >
                    Volver al dashboard
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={chatbot?.name || 'Chatbot'} user={user}>
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{chatbot?.name}</h1>
              <p className="text-gray-600 mt-2">{chatbot?.description || 'Sin descripción'}</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => router.push('/dashboard')}
                className="btn-secondary"
              >
                Volver
              </button>
              <button
                onClick={handleIntegration}
                className="btn-primary"
              >
                Integrar
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-700">{success}</p>
                </div>
              </div>
            </div>
          )}

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
                  onClick={() => setActiveTab('sources')}
                  className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                    activeTab === 'sources'
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Fuentes de datos
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
                  onClick={() => setActiveTab('advanced')}
                  className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                    activeTab === 'advanced'
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Avanzado
                </button>
              </nav>
            </div>

            <div className="p-6">
              {activeTab === 'general' && (
                <form onSubmit={handleSubmit}>
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Nombre del chatbot *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        Descripción
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={3}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="welcome_message" className="block text-sm font-medium text-gray-700">
                        Mensaje de bienvenida
                      </label>
                      <textarea
                        id="welcome_message"
                        name="welcome_message"
                        value={formData.welcome_message}
                        onChange={handleChange}
                        rows={2}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="instructions" className="block text-sm font-medium text-gray-700">
                        Instrucciones para el chatbot
                      </label>
                      <textarea
                        id="instructions"
                        name="instructions"
                        value={formData.instructions}
                        onChange={handleChange}
                        rows={4}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                      />
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        id="is_public"
                        name="is_public"
                        type="checkbox"
                        checked={formData.is_public}
                        onChange={handleChange}
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                      />
                      <label htmlFor="is_public" className="ml-2 block text-sm text-gray-900">
                        Chatbot público
                      </label>
                    </div>
                    
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="btn-primary"
                        disabled={chatbotLoading}
                      >
                        {chatbotLoading ? 'Guardando...' : 'Guardar cambios'}
                      </button>
                    </div>
                  </div>
                </form>
              )}

              {activeTab === 'sources' && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Fuentes de datos</h3>
                  <p className="text-gray-600 mb-6">
                    Añade fuentes de datos para entrenar tu chatbot. Puedes añadir texto, URLs o archivos PDF.
                  </p>
                  
                  <form onSubmit={handleAddSource} className="bg-gray-50 p-4 rounded-md mb-6">
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                          Tipo de fuente
                        </label>
                        <select
                          id="type"
                          name="type"
                          value={sourceForm.type}
                          onChange={handleSourceChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                        >
                          <option value="text">Texto</option>
                          <option value="url">URL</option>
                          <option value="pdf">PDF</option>
                        </select>
                      </div>
                      
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                          Nombre de la fuente *
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={sourceForm.name}
                          onChange={handleSourceChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                          required
                        />
                      </div>
                      
                      {sourceForm.type === 'text' && (
                        <div>
                          <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                            Contenido *
                          </label>
                          <textarea
                            id="content"
                            name="content"
                            value={sourceForm.content}
                            onChange={handleSourceChange}
                            rows={6}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                            required
                          />
                        </div>
                      )}
                      
                      {sourceForm.type === 'url' && (
                        <div>
                          <label htmlFor="web_url" className="block text-sm font-medium text-gray-700">
                            URL *
                          </label>
                          <input
                            type="url"
                            id="web_url"
                            name="web_url"
                            value={sourceForm.web_url}
                            onChange={handleSourceChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                            placeholder="https://ejemplo.com/pagina"
                            required
                          />
                        </div>
                      )}
                      
                      {sourceForm.type === 'pdf' && (
                        <div>
                          <label htmlFor="file_url" className="block text-sm font-medium text-gray-700">
                            URL del archivo PDF *
                          </label>
                          <input
                            type="url"
                            id="file_url"
                            name="file_url"
                            value={sourceForm.file_url}
                            onChange={handleSourceChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                            placeholder="https://ejemplo.com/documento.pdf"
                            required
                          />
                        </div>
                      )}
                      
                      <div className="flex justify-end">
                        <button
                          type="submit"
                          className="btn-primary"
                          disabled={sourcesLoading}
                        >
                          {sourcesLoading ? 'Añadiendo...' : 'Añadir fuente'}
                        </button>
                      </div>
                    </div>
                  </form>
                  
                  <h4 className="text-md font-medium text-gray-900 mb-2">Fuentes añadidas</h4>
                  
                  {sources.length === 0 ? (
                    <div className="bg-gray-50 p-4 rounded-md text-center">
                      <p className="text-gray-600">No hay fuentes añadidas</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {sources.map((source) => (
                        <div key={source.id} className="bg-gray-50 p-4 rounded-md">
                          <div className="flex justify-between items-start">
                            <div>
                              <h5 className="text-sm font-medium text-gray-900">{source.name}</h5>
                              <p className="text-xs text-gray-500">
                                Tipo: {source.type === 'text' ? 'Texto' : source.type === 'url' ? 'URL' : 'PDF'}
                              </p>
                              <p className="text-xs text-gray-500">
                                Estado: {
                                  source.status === 'pending' ? 'Pendiente' :
                                  source.status === 'processing' ? 'Procesando' :
                                  source.status === 'completed' ? 'Completado' : 'Error'
                                }
                              </p>
                            </div>
                            <span className="text-xs text-gray-500">
                              {new Date(source.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'appearance' && (
                <form onSubmit={handleSubmit}>
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="primary_color" className="block text-sm font-medium text-gray-700">
                        Color principal
                      </label>
                      <div className="mt-1 flex items-center">
                        <input
                          type="color"
                          id="primary_color"
                          name="primary_color"
                          value={formData.primary_color}
                          onChange={handleChange}
                          className="h-8 w-8 border border-gray-300 rounded-md shadow-sm"
                        />
                        <span className="ml-2 text-sm text-gray-500">{formData.primary_color}</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="btn-primary"
                        disabled={chatbotLoading}
                      >
                        {chatbotLoading ? 'Guardando...' : 'Guardar cambios'}
                      </button>
                    </div>
                  </div>
                </form>
              )}

              {activeTab === 'advanced' && (
                <form onSubmit={handleSubmit}>
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="model_name" className="block text-sm font-medium text-gray-700">
                        Modelo de IA
                      </label>
                      <select
                        id="model_name"
                        name="model_name"
                        value={formData.model_name}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                      >
                        <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                        <option value="gpt-4">GPT-4</option>
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="temperature" className="block text-sm font-medium text-gray-700">
                        Temperatura ({formData.temperature})
                      </label>
                      <input
                        type="range"
                        id="temperature"
                        name="temperature"
                        min="0"
                        max="1"
                        step="0.1"
                        value={formData.temperature}
                        onChange={handleChange}
                        className="mt-1 block w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Más preciso</span>
                        <span>Más creativo</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="btn-primary"
                        disabled={chatbotLoading}
                      >
                        {chatbotLoading ? 'Guardando...' : 'Guardar cambios'}
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
