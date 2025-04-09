import { useState } from 'react';
import Layout from '../layout/Layout';
import Link from 'next/link';

export default function Pricing({ user }) {
  const [billingPeriod, setBillingPeriod] = useState('monthly');

  const plans = [
    {
      name: 'Free',
      description: 'Para comenzar a experimentar',
      monthlyPrice: 0,
      yearlyPrice: 0,
      features: [
        '100 mensajes por mes',
        '400 KB por agente',
        '1 miembro del equipo',
        '1 agente',
        '10 enlaces',
        'Soporte por email'
      ],
      cta: 'Comenzar gratis',
      highlight: false
    },
    {
      name: 'Hobby',
      description: 'Para uso personal o pequeños proyectos',
      monthlyPrice: 40,
      yearlyPrice: 384, // 20% de descuento
      features: [
        '2,000 mensajes por mes',
        '33,000 KB por agente',
        '1 miembro del equipo',
        '1 agente',
        '5 acciones',
        'Soporte prioritario'
      ],
      cta: 'Comenzar prueba gratuita',
      highlight: true
    },
    {
      name: 'Standard',
      description: 'Para negocios en crecimiento',
      monthlyPrice: 150,
      yearlyPrice: 1440, // 20% de descuento
      features: [
        '12,000 mensajes por mes',
        '100,000 KB por agente',
        '3 miembros del equipo',
        '2 agentes',
        '10 acciones',
        'Soporte prioritario'
      ],
      cta: 'Comenzar prueba gratuita',
      highlight: false
    },
    {
      name: 'Pro',
      description: 'Para empresas con necesidades avanzadas',
      monthlyPrice: 500,
      yearlyPrice: 4800, // 20% de descuento
      features: [
        '45,000 mensajes por mes',
        '500,000 KB por agente',
        '10 miembros del equipo',
        '3 agentes',
        '20 acciones',
        'Análisis avanzados',
        'Soporte prioritario 24/7'
      ],
      cta: 'Comenzar prueba gratuita',
      highlight: false
    }
  ];

  return (
    <Layout title="Precios" user={user}>
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Precios simples y transparentes</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Elige el plan que mejor se adapte a tus necesidades. Todos los planes incluyen una prueba gratuita de 7 días.
            </p>
            
            <div className="mt-8 flex justify-center">
              <div className="relative bg-gray-100 p-1 rounded-lg inline-flex">
                <button
                  onClick={() => setBillingPeriod('monthly')}
                  className={`px-4 py-2 text-sm font-medium rounded-md ${
                    billingPeriod === 'monthly'
                      ? 'bg-white shadow-sm text-gray-900'
                      : 'text-gray-700 hover:text-gray-900'
                  }`}
                >
                  Mensual
                </button>
                <button
                  onClick={() => setBillingPeriod('yearly')}
                  className={`px-4 py-2 text-sm font-medium rounded-md ${
                    billingPeriod === 'yearly'
                      ? 'bg-white shadow-sm text-gray-900'
                      : 'text-gray-700 hover:text-gray-900'
                  }`}
                >
                  Anual <span className="text-purple-600 font-semibold">-20%</span>
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`bg-white rounded-lg shadow-md overflow-hidden ${
                  plan.highlight ? 'ring-2 ring-purple-500' : ''
                }`}
              >
                {plan.highlight && (
                  <div className="bg-purple-500 text-white text-center py-2 text-sm font-medium">
                    Más popular
                  </div>
                )}
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900">{plan.name}</h2>
                  <p className="text-gray-600 mt-1">{plan.description}</p>
                  <div className="mt-4 flex items-baseline">
                    <span className="text-4xl font-extrabold text-gray-900">
                      ${billingPeriod === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice}
                    </span>
                    <span className="ml-1 text-xl font-medium text-gray-500">
                      /{billingPeriod === 'monthly' ? 'mes' : 'año'}
                    </span>
                  </div>
                  <ul className="mt-6 space-y-4">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start">
                        <svg className="h-5 w-5 text-green-500 shrink-0 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8">
                    <Link
                      href={plan.name === 'Free' ? '/auth/signup' : '/auth/signup?plan=' + plan.name.toLowerCase()}
                      className={`w-full btn-primary block text-center ${
                        plan.highlight ? 'bg-purple-600 hover:bg-purple-700' : ''
                      }`}
                    >
                      {plan.cta}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Preguntas frecuentes</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">¿Qué incluye la prueba gratuita?</h3>
                  <p className="text-gray-600">
                    La prueba gratuita de 7 días incluye todas las características del plan seleccionado sin restricciones. No se requiere tarjeta de crédito para comenzar.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">¿Puedo cambiar de plan en cualquier momento?</h3>
                  <p className="text-gray-600">
                    Sí, puedes actualizar o degradar tu plan en cualquier momento. Los cambios se aplicarán inmediatamente y se ajustará tu facturación de forma prorrateada.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">¿Qué métodos de pago aceptan?</h3>
                  <p className="text-gray-600">
                    Aceptamos todas las principales tarjetas de crédito y débito, incluyendo Visa, Mastercard, American Express y Discover.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">¿Ofrecen descuentos para startups o educación?</h3>
                  <p className="text-gray-600">
                    Sí, ofrecemos descuentos especiales para startups, instituciones educativas y organizaciones sin fines de lucro. Contáctanos para más información.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
