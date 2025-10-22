/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['@prisma/client'],
  // Оптимизация для SPA
  compress: true,
  poweredByHeader: false,
  // Предзагрузка всех маршрутов для мгновенной навигации
  reactStrictMode: true,
}

module.exports = nextConfig
