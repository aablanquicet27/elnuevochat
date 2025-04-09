import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';

export default function Header({ user }) {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/" className="text-2xl font-bold text-gray-900">
            Chatbase.co
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-4 items-center">
          <Link href="/affiliates" className="text-gray-600 hover:text-gray-900">
            Afiliados
          </Link>
          <Link href="/pricing" className="text-gray-600 hover:text-gray-900">
            Precios
          </Link>
          
          <Menu as="div" className="relative inline-block text-left">
            <Menu.Button className="text-gray-600 hover:text-gray-900 inline-flex items-center">
              Recursos
              <ChevronDownIcon className="ml-1 h-5 w-5" aria-hidden="true" />
            </Menu.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                <div className="px-1 py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        href="/docs/guide"
                        className={`${
                          active ? 'bg-gray-100' : ''
                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                      >
                        Guía
                      </Link>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        href="/blog"
                        className={`${
                          active ? 'bg-gray-100' : ''
                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                      >
                        Blog
                      </Link>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        href="/docs/api"
                        className={`${
                          active ? 'bg-gray-100' : ''
                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                      >
                        Documentación API
                      </Link>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        href="/changelog"
                        className={`${
                          active ? 'bg-gray-100' : ''
                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                      >
                        Changelog
                      </Link>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
          
          {user ? (
            <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
              Dashboard
            </Link>
          ) : (
            <>
              <Link href="/auth/signin" className="text-gray-600 hover:text-gray-900">
                Iniciar sesión
              </Link>
              <Link href="/auth/signup" className="btn-primary">
                Prueba Gratis
              </Link>
            </>
          )}
        </nav>
        
        {/* Mobile menu button */}
        <div className="md:hidden flex items-center">
          <button
            type="button"
            className="text-gray-500 hover:text-gray-600"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="sr-only">Abrir menú</span>
            {mobileMenuOpen ? (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link href="/affiliates" className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900">
              Afiliados
            </Link>
            <Link href="/pricing" className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900">
              Precios
            </Link>
            <div className="relative">
              <button
                type="button"
                className="block w-full text-left px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900"
              >
                Recursos
              </button>
              <div className="pl-4 space-y-1">
                <Link href="/docs/guide" className="block px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900">
                  Guía
                </Link>
                <Link href="/blog" className="block px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900">
                  Blog
                </Link>
                <Link href="/docs/api" className="block px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900">
                  Documentación API
                </Link>
                <Link href="/changelog" className="block px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900">
                  Changelog
                </Link>
              </div>
            </div>
            {user ? (
              <Link href="/dashboard" className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900">
                Dashboard
              </Link>
            ) : (
              <>
                <Link href="/auth/signin" className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900">
                  Iniciar sesión
                </Link>
                <Link href="/auth/signup" className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900">
                  Prueba Gratis
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
