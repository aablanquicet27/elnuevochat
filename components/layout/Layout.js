import Head from 'next/head';
import Header from './Header';
import Footer from './Footer';

export default function Layout({ children, title, description, user }) {
  const pageTitle = title ? `${title} - Chatbase Clone` : 'Chatbase Clone | La plataforma completa para agentes de IA basados en chat';
  const pageDescription = description || 'Chatbase es la plataforma completa para construir y desplegar Agentes de IA para tu negocio para manejar soporte al cliente e impulsar más ingresos.';

  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Header user={user} />

      <main className="flex-grow">
        {children}
      </main>

      <Footer />
    </div>
  );
}
