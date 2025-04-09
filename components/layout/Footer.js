import Link from 'next/link';

export default function Footer() {
  return (
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
  );
}
