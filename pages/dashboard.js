import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../hooks/useAuth';
import { useChatbots } from '../hooks/useChatbots';
import Layout from '../components/layout/Layout';

export default function Dashboard() {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const { getChatbots, loading: chatbotsLoading, error } = useChatbots();
  const [chatbots, setChatbots] = useState([]);
  const router = useRouter();

  useEffect(() => {
    // Redirigir si no está autenticado
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/signin');
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    // Cargar chatbots cuando el usuario esté autenticado
    if (isAuthenticated) {
      const loadChatbots = async () => {
        const { data, error } = await getChatbots();
        if (data) {
          setChatbots(data);
        }
      };
      
      loadChatbots();
    }
  }, [isAuthenticated, getChatbots]);

  const handleCreateChatbot = () => {
    router.push('/chatbots/create');
  };

  const handleChatbotClick = (id) => {
    router.push(`/chatbots/${id}`);
  };

  if (authLoading) {
    return (
      <Layout title="Cargando...">
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Dashboard" user={user}>
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Mis Chatbots</h1>
              <p className="text-gray-600 mt-2">Gestiona tus chatbots personalizados</p>
            </div>
            <button
              onClick={handleCreateChatbot}
              className="btn-primary"
            >
              Crear Chatbot
            </button>
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

          {chatbotsLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          ) : chatbots.length === 0 ? (
            <div className="bg-white shadow rounded-lg p-6 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">No tienes chatbots</h3>
              <p className="mt-2 text-gray-600">Crea tu primer chatbot para comenzar a interactuar con tus usuarios.</p>
              <button
                onClick={handleCreateChatbot}
                className="mt-4 btn-primary"
              >
                Crear mi primer chatbot
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {chatbots.map((chatbot) => (
                <div
                  key={chatbot.id}
                  onClick={() => handleChatbotClick(chatbot.id)}
                  className="bg-white shadow rounded-lg overflow-hidden cursor-pointer transition-transform transform hover:scale-105"
                >
                  <div
                    className="h-3"
                    style={{ backgroundColor: chatbot.primary_color || '#6366F1' }}
                  ></div>
                  <div className="p-6">
                    <h3 className="text-lg font-medium text-gray-900">{chatbot.name}</h3>
                    <p className="mt-1 text-sm text-gray-600 line-clamp-2">{chatbot.description || 'Sin descripción'}</p>
                    <div className="mt-4 flex justify-between items-center">
                      <span className="text-xs text-gray-500">
                        Creado: {new Date(chatbot.created_at).toLocaleDateString()}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded-full ${chatbot.is_public ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {chatbot.is_public ? 'Público' : 'Privado'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
