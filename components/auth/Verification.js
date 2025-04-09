import { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../layout/Layout';

export default function Verification() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleResendEmail = async () => {
    setLoading(true);
    setError(null);
    
    // Aquí iría la lógica para reenviar el correo de verificación
    // Simulamos un retraso y éxito
    setTimeout(() => {
      setSuccess(true);
      setLoading(false);
    }, 1500);
  };

  return (
    <Layout title="Verificación de Email">
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Verifica tu correo electrónico
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Hemos enviado un enlace de verificación a tu correo electrónico.
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
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

            {success && (
              <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-green-700">Correo de verificación reenviado correctamente.</p>
                  </div>
                </div>
              </div>
            )}

            <div className="text-center">
              <svg className="mx-auto h-16 w-16 text-purple-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <p className="mt-4 text-gray-700">
                Por favor, revisa tu bandeja de entrada y haz clic en el enlace de verificación para activar tu cuenta.
              </p>
              <p className="mt-2 text-gray-600 text-sm">
                Si no has recibido el correo, revisa tu carpeta de spam o haz clic en el botón de abajo para reenviar.
              </p>
              <div className="mt-6">
                <button
                  onClick={handleResendEmail}
                  disabled={loading || success}
                  className={`w-full btn-primary ${(loading || success) ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {loading ? 'Reenviando...' : success ? 'Correo reenviado' : 'Reenviar correo de verificación'}
                </button>
              </div>
              <div className="mt-4">
                <button
                  onClick={() => router.push('/auth/signin')}
                  className="text-sm text-purple-600 hover:text-purple-500"
                >
                  Volver a iniciar sesión
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
