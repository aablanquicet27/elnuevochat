import { useState, useEffect } from 'react';
import Layout from '../layout/Layout';

export default function ChatbotWidget({ chatbotId }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: '¡Hola! Soy un asistente virtual. ¿En qué puedo ayudarte?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatbot, setChatbot] = useState(null);

  useEffect(() => {
    // Aquí se cargaría la información del chatbot desde la API
    // Por ahora usamos datos de ejemplo
    setChatbot({
      name: 'Asistente Virtual',
      primary_color: '#6366F1',
      welcome_message: '¡Hola! Soy un asistente virtual. ¿En qué puedo ayudarte?'
    });
  }, [chatbotId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages([...messages, userMessage]);
    setInput('');
    setLoading(true);

    // Simular respuesta del chatbot
    setTimeout(() => {
      const botResponse = { 
        role: 'assistant', 
        content: 'Esta es una respuesta de ejemplo. En una implementación real, esta respuesta vendría de la API.' 
      };
      setMessages(prev => [...prev, botResponse]);
      setLoading(false);
    }, 1000);

    // En una implementación real, aquí se haría la llamada a la API
    // const response = await fetch('/api/chat', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ chatbotId, message: input })
    // });
    // const data = await response.json();
    // setMessages(prev => [...prev, { role: 'assistant', content: data.message }]);
    // setLoading(false);
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header del chat */}
      <div 
        className="p-4 text-white flex items-center"
        style={{ backgroundColor: chatbot?.primary_color || '#6366F1' }}
      >
        <div className="w-8 h-8 rounded-full bg-white bg-opacity-20 flex items-center justify-center mr-3">
          {chatbot?.name?.charAt(0) || 'A'}
        </div>
        <div>
          <h3 className="font-medium">{chatbot?.name || 'Asistente Virtual'}</h3>
          <p className="text-xs text-white text-opacity-80">En línea</p>
        </div>
      </div>

      {/* Área de mensajes */}
      <div className="flex-grow p-4 overflow-y-auto bg-gray-50">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div 
              key={index} 
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-xs md:max-w-md rounded-lg p-3 ${
                  message.role === 'user' 
                    ? 'bg-purple-600 text-white rounded-br-none' 
                    : 'bg-white shadow rounded-bl-none'
                }`}
              >
                <p className="text-sm">{message.content}</p>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="max-w-xs md:max-w-md rounded-lg p-3 bg-white shadow rounded-bl-none">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Formulario de entrada */}
      <div className="p-4 border-t">
        <form onSubmit={handleSubmit} className="flex">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe un mensaje..."
            className="flex-grow px-4 py-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className={`px-4 py-2 rounded-r-lg text-white ${
              loading || !input.trim() ? 'bg-gray-400' : 'bg-purple-600 hover:bg-purple-700'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </form>
        <div className="text-center mt-2">
          <p className="text-xs text-gray-500">Powered by Chatbase Clone</p>
        </div>
      </div>
    </div>
  );
}
