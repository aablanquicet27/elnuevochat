import { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../layout/Layout';

export default function ChatbotIntegration({ user, chatbot }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('iframe');
  const [copied, setCopied] = useState(false);
  
  // Código de integración para iframe
  const iframeCode = `<iframe
  src="https://chatbase-clone.vercel.app/chatbot/${chatbot?.id}"
  width="100%"
  height="600"
  frameborder="0"
></iframe>`;

  // Código de integración para chat bubble
  const chatBubbleCode = `<script>
  window.chatbaseConfig = {
    chatbotId: "${chatbot?.id}",
    domain: "chatbase-clone.vercel.app"
  }
</script>
<script
  src="https://chatbase-clone.vercel.app/js/chat-bubble.js"
  defer>
</script>`;

  // Código de integración para API
  const apiCode = `// Ejemplo de uso con fetch
fetch('https://chatbase-clone.vercel.app/api/chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    chatbotId: '${chatbot?.id}',
    message: 'Hola, ¿cómo estás?',
    conversationId: 'optional-conversation-id',
  }),
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));`;

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <Layout title="Integrar Chatbot" user={user}>
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Integrar Chatbot</h1>
              <p className="text-gray-600 mt-2">Añade tu chatbot a tu sitio web o aplicación</p>
            </div>
            <button
              onClick={() => router.back()}
              className="btn-secondary"
            >
              Volver
            </button>
          </div>

          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px">
                <button
                  onClick={() => setActiveTab('iframe')}
                  className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                    activeTab === 'iframe'
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Iframe
                </button>
                <button
                  onClick={() => setActiveTab('chat-bubble')}
                  className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                    activeTab === 'chat-bubble'
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Chat Bubble
                </button>
                <button
                  onClick={() => setActiveTab('api')}
                  className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                    activeTab === 'api'
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  API
                </button>
              </nav>
            </div>

            <div className="p-6">
              {activeTab === 'iframe' && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Integración con Iframe</h3>
                  <p className="text-gray-600 mb-6">
                    Añade este código HTML a tu sitio web para incrustar el chatbot directamente en tu página.
                  </p>
                  
                  <div className="relative">
                    <pre className="bg-gray-50 p-4 rounded-md overflow-x-auto text-sm">
                      {iframeCode}
                    </pre>
                    <button
                      onClick={() => handleCopy(iframeCode)}
                      className="absolute top-2 right-2 p-2 bg-white rounded-md shadow-sm hover:bg-gray-100"
                    >
                      {copied ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                        </svg>
                      )}
                    </button>
                  </div>
                  
                  <div className="mt-8">
                    <h4 className="text-md font-medium text-gray-900 mb-2">Vista previa</h4>
                    <div className="border border-gray-200 rounded-md p-4 h-96 flex items-center justify-center bg-gray-50">
                      <div className="text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                        <p className="mt-2 text-gray-600">Vista previa del chatbot</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'chat-bubble' && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Integración con Chat Bubble</h3>
                  <p className="text-gray-600 mb-6">
                    Añade este código JavaScript a tu sitio web para mostrar un botón flotante que abre el chatbot.
                  </p>
                  
                  <div className="relative">
                    <pre className="bg-gray-50 p-4 rounded-md overflow-x-auto text-sm">
                      {chatBubbleCode}
                    </pre>
                    <button
                      onClick={() => handleCopy(chatBubbleCode)}
                      className="absolute top-2 right-2 p-2 bg-white rounded-md shadow-sm hover:bg-gray-100"
                    >
                      {copied ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                        </svg>
                      )}
                    </button>
                  </div>
                  
                  <div className="mt-8">
                    <h4 className="text-md font-medium text-gray-900 mb-2">Vista previa</h4>
                    <div className="border border-gray-200 rounded-md p-4 h-96 relative bg-gray-50">
                      <div className="absolute bottom-4 right-4">
                        <button
                          className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg"
                          style={{ backgroundColor: chatbot?.primary_color || '#6366F1' }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'api' && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Integración con API</h3>
                  <p className="text-gray-600 mb-6">
                    Utiliza nuestra API para integrar el chatbot en tu aplicación personalizada.
                  </p>
                  
                  <div className="relative">
                    <pre className="bg-gray-50 p-4 rounded-md overflow-x-auto text-sm">
                      {apiCode}
                    </pre>
                    <button
                      onClick={() => handleCopy(apiCode)}
                      className="absolute top-2 right-2 p-2 bg-white rounded-md shadow-sm hover:bg-gray-100"
                    >
                      {copied ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                        </svg>
                      )}
                    </button>
                  </div>
                  
                  <div className="mt-8">
                    <h4 className="text-md font-medium text-gray-900 mb-2">Documentación de la API</h4>
                    <p className="text-gray-600">
                      Consulta nuestra <a href="/docs/api" className="text-purple-600 hover:text-purple-500">documentación completa de la API</a> para más información sobre los endpoints disponibles y parámetros.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
