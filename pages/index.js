import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen">
      <Head>
        <title>Chatbase Clone | La plataforma completa para agentes de IA basados en chat</title>
        <meta name="description" content="Chatbase es la plataforma completa para construir y desplegar Agentes de IA para tu negocio para manejar soporte al cliente e impulsar más ingresos." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-gray-900">
              Chatbase.co
            </Link>
          </div>
          <nav className="flex space-x-4">
            <Link href="/affiliates" className="text-gray-600 hover:text-gray-900">
              Afiliados
            </Link>
            <Link href="/pricing" className="text-gray-600 hover:text-gray-900">
              Precios
            </Link>
            <button className="text-gray-600 hover:text-gray-900">
              Recursos
            </button>
            <Link href="/auth/signin" className="text-gray-600 hover:text-gray-900">
              Iniciar sesión
            </Link>
            <Link href="/auth/signup" className="btn-primary">
              Prueba Gratis
            </Link>
          </nav>
        </div>
      </header>

      <main>
        <section className="relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 lg:py-32 flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Agentes de IA para experiencias mágicas de cliente
              </h1>
              <p className="text-lg md:text-xl text-gray-600 mb-8">
                Chatbase es la plataforma completa para construir y desplegar Agentes de IA para tu negocio para manejar soporte al cliente e impulsar más ingresos.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link href="/auth/signup" className="btn-primary text-center">
                  Construye tu agente
                </Link>
                <p className="text-sm text-gray-500 mt-2">No se requiere tarjeta de crédito</p>
              </div>
            </div>
            <div className="md:w-1/2 gradient-primary rounded-3xl p-8 text-white">
              <div className="bg-white rounded-lg p-6 mb-4">
                <h3 className="font-medium mb-2">Fuentes</h3>
                <div className="flex items-center p-2 bg-gray-50 rounded-lg mb-2">
                  <div className="w-8 h-8 bg-red-500 rounded mr-2 flex items-center justify-center text-white">
                    PDF
                  </div>
                  <span>Guía.pdf</span>
                </div>
                <div className="flex items-center p-2 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-gray-200 rounded mr-2 flex items-center justify-center">
                    +
                  </div>
                  <span>Añadir fuente</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-lg font-medium mb-8">Confiado por más de 9000+ negocios en todo el mundo</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
              {/* Logos de empresas irían aquí */}
              <div className="h-8 bg-gray-200 rounded"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">La plataforma completa para agentes de soporte de IA</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Chatbase está diseñado para construir agentes de soporte de IA que resuelvan los problemas más difíciles de tus clientes mientras mejoran los resultados del negocio.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="card">
                <div className="h-48 bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                  {/* Imagen ilustrativa */}
                </div>
                <h3 className="text-xl font-bold mb-2">Diseñado para LLMs</h3>
                <p className="text-gray-600">
                  Modelos de lenguaje con capacidades de razonamiento para respuestas efectivas a consultas complejas.
                </p>
              </div>
              
              <div className="card">
                <div className="h-48 bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                  {/* Imagen ilustrativa */}
                </div>
                <h3 className="text-xl font-bold mb-2">Diseñado para simplicidad</h3>
                <p className="text-gray-600">
                  Crea, gestiona y despliega Agentes de IA fácilmente, incluso sin habilidades técnicas.
                </p>
              </div>
              
              <div className="card">
                <div className="h-48 bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                  {/* Imagen ilustrativa */}
                </div>
                <h3 className="text-xl font-bold mb-2">Diseñado para seguridad</h3>
                <p className="text-gray-600">
                  Disfruta de tranquilidad con encriptación robusta y estándares estrictos de cumplimiento.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">Chatbase</h3>
              <p className="text-gray-400">La plataforma completa para agentes de IA basados en chat</p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Producto</h3>
              <ul className="space-y-2">
                <li><Link href="/pricing" className="text-gray-400 hover:text-white">Precios</Link></li>
                <li><Link href="/docs" className="text-gray-400 hover:text-white">Documentación</Link></li>
                <li><Link href="/guides" className="text-gray-400 hover:text-white">Guías</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Compañía</h3>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-gray-400 hover:text-white">Acerca de</Link></li>
                <li><Link href="/blog" className="text-gray-400 hover:text-white">Blog</Link></li>
                <li><Link href="/contact" className="text-gray-400 hover:text-white">Contacto</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Link href="/terms" className="text-gray-400 hover:text-white">Términos de Servicio</Link></li>
                <li><Link href="/privacy" className="text-gray-400 hover:text-white">Política de Privacidad</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} Chatbase Clone. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
