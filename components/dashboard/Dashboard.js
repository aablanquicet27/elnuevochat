import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '../layout/Layout';
import { getCurrentUser, getUserProfile, getChatbots } from '../../lib/supabase';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [chatbots, setChatbots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadUserData() {
      try {
        // Obtener el usuario actual
        const { data: userData, error: userError } = await getCurrentUser();
        
        if (userError) throw userError;
        if (!userData.user) {
          router.push('/auth/signin');
          return;
        }

        setUser(userData.user);
        
        // Obtener el perfil del usuario
        const { data: profileData, error: profileError } = await getUserProfile(userData.user.id);
        if (profileError) throw profileError;
        
        setProfile(profileData);
        
        // Obtener los chatbots del usuario
        const { data: chatbotsData, error: chatbotsError } = await getChatbots(userData.user.id);
        if (chatbotsError) throw chatbotsError;
        
        setChatbots(chatbotsData || []);
      } catch (error) {
        console.error('Error loading user data:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
    
    loadUserData();
  }, [router]);

  return (
    <Layout title="Dashboard" user={user}>
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
            </div>
          ) : error ? (
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
          ) : (
            <>
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Bienvenido, {profile?.full_name || user?.email}</h1>
                <p className="text-gray-600 mt-2">Gestiona tus chatbots y analiza su rendimiento</p>
              </div>

              <div className="bg-white shadow rounded-lg p-6 mb-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Tus Chatbots</h2>
                  <Link href="/chatbots/create" className="btn-primary">
                    Crear nuevo chatbot
                  </Link>
                </div>

                {chatbots.length === 0 ? (
                  <div className="text-center py-12">
                    <svg className="mx-auto h-16 w-16 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                    <h3 className="mt-4 text-lg font-medium text-gray-900">No tienes chatbots</h3>
                    <p className="mt-1 text-gray-500">Comienza creando tu primer chatbot para interactuar con tus usuarios.</p>
                    <div className="mt-6">
                      <Link href="/chatbots/create" className="btn-primary">
                        Crear mi primer chatbot
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {chatbots.map((chatbot) => (
                      <div key={chatbot.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                        <div className="p-5">
                          <div className="flex items-center mb-3">
                            <div 
                              className="w-10 h-10 rounded-full mr-3 flex items-center justify-center text-white"
                              style={{ backgroundColor: chatbot.primary_color || '#6366F1' }}
                            >
                              {chatbot.name.charAt(0).toUpperCase()}
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 truncate">{chatbot.name}</h3>
                          </div>
                          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{chatbot.description || 'Sin descripción'}</p>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-500">
                              Creado: {new Date(chatbot.created_at).toLocaleDateString()}
                            </span>
                            <Link href={`/chatbots/${chatbot.id}`} className="text-purple-600 hover:text-purple-500 text-sm font-medium">
                              Gestionar
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white shadow rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Uso del Plan</h3>
                  <div className="flex items-center mb-2">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: '45%' }}></div>
                    </div>
                    <span className="ml-2 text-sm text-gray-600">45%</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Plan actual: <span className="font-medium">{profile?.plan?.name || 'Free'}</span>
                  </p>
                  <div className="mt-4">
                    <Link href="/pricing" className="text-purple-600 hover:text-purple-500 text-sm font-medium">
                      Actualizar plan
                    </Link>
                  </div>
                </div>

                <div className="bg-white shadow rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Mensajes Totales</h3>
                  <p className="text-3xl font-bold text-gray-900">0</p>
                  <p className="text-sm text-gray-600 mt-1">Mensajes este mes</p>
                  <div className="mt-4">
                    <Link href="/analytics" className="text-purple-600 hover:text-purple-500 text-sm font-medium">
                      Ver análisis
                    </Link>
                  </div>
                </div>

                <div className="bg-white shadow rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Leads Generados</h3>
                  <p className="text-3xl font-bold text-gray-900">0</p>
                  <p className="text-sm text-gray-600 mt-1">Leads este mes</p>
                  <div className="mt-4">
                    <Link href="/leads" className="text-purple-600 hover:text-purple-500 text-sm font-medium">
                      Ver todos los leads
                    </Link>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}
