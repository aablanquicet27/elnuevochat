module.exports = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['images.unsplash.com'],
  },
  // Configuración para asegurar compatibilidad con Vercel
  webpack: (config) => {
    return config;
  },
}
