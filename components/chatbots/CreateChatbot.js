import { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../layout/Layout';
import { createChatbot } from '../../lib/supabase';

export default function CreateChatbot({ user }) {
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [welcomeMessage, setWelcomeMessage] = useState('¡Hola! Soy un asistente virtual. ¿En qué puedo ayudarte?');
  const [instructions, setInstructions] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#6366F1');
  const [modelName, setModelName] = useState('gpt-3.5-turbo');
  const [temperature, setTemperature] = useState(0.7);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!user) {
        throw new Error('Debes iniciar sesión para crear un chatbot');
      }

      const chatbotData = {
        user_id: user.id,
        name,
        description,
        welcome_message: welcomeMessage,
        instructions,
        primary_color: primaryColor,
        model_name: modelName,
        temperature: parseFloat(temperature),
      };

      const { data, error } = await createChatbot(chatbotData);
      
      if (error) {
        throw error;
      }

      // Redirigir a la página del chatbot
      router.push(`/chatbots/${data.id}`);
    } catch (error) {
      setError(error.message || 'Error al crear el chatbot. Por favor, inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Crear Chatbot" user={user}>
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Crear nuevo chatbot</h1>
            <p className="text-gray-600 mt-2">Configura tu chatbot personalizado para interactuar con tus usuarios</p>
          </div>

          {error && (
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
          )}

          <div className="bg-white shadow rounded-lg overflow-hidden">
            <form onSubmit={handleSubmit} className="p-6">
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
                      placeholder="Mi Asistente Virtual"
                    />
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    Este nombre será visible para tus usuarios.
                  </p>
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
                      placeholder="Un asistente virtual para responder preguntas sobre mi empresa"
                    />
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    Breve descripción del propósito de este chatbot.
                  </p>
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
                  <p className="mt-1 text-sm text-gray-500">
                    Mensaje que se mostrará al iniciar una conversación.
                  </p>
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
                      placeholder="Eres un asistente amable y servicial que ayuda a los usuarios con preguntas sobre nuestra empresa..."
                    />
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    Instrucciones específicas sobre cómo debe comportarse el chatbot.
                  </p>
                </div>

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
                  <p className="mt-1 text-sm text-gray-500">
                    Color principal para la interfaz del chatbot.
                  </p>
                </div>

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
                  <p className="mt-1 text-sm text-gray-500">
                    Modelo de IA que utilizará el chatbot.
                  </p>
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
                  <p className="mt-1 text-sm text-gray-500">
                    Controla la aleatoriedad de las respuestas del chatbot.
                  </p>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full btn-primary ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {loading ? 'Creando chatbot...' : 'Crear chatbot'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}
