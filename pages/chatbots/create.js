import { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../hooks/useAuth';
import { useChatbots } from '../../hooks/useChatbots';
import Layout from '../../components/layout/Layout';

export default function CreateChatbot() {
  const { user, isAuthenticated } = useAuth();
  const { createChatbot, loading, error } = useChatbots();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    welcome_message: '¡Hola! Soy un asistente virtual. ¿En qué puedo ayudarte?',
    instructions: '',
    primary_color: '#6366F1',
    model_name: 'gpt-3.5-turbo',
    temperature: 0.7,
  });
  
  const [formError, setFormError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    
    if (!formData.name.trim()) {
      setFormError('El nombre del chatbot es obligatorio');
      return;
    }
    
    const { data, error } = await createChatbot(formData);
    
    if (error) {
      setFormError(error);
      return;
    }
    
    if (data) {
      router.push(`/chatbots/${data.id}`);
    }
  };

  return (
    <Layout title="Crear Chatbot" user={user}>
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Crear Nuevo Chatbot</h1>
            <p className="text-gray-600 mt-2">Configura tu chatbot personalizado</p>
          </div>

          {formError && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{formError}</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg overflow-hidden">
            <div className="p-6 space-y-6">
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
                  placeholder="Mi Asistente Virtual"
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
                  placeholder="Describe brevemente para qué sirve este chatbot"
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
                  placeholder="Proporciona instrucciones específicas sobre cómo debe comportarse el chatbot"
                />
              </div>
              
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
            </div>
            
            <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => router.push('/dashboard')}
                className="btn-secondary"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creando...
                  </span>
                ) : 'Crear Chatbot'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}
