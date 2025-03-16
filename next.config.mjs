/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Отключаем строгие проверки ESLint при сборке
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Отключаем строгие проверки TypeScript при сборке
    ignoreBuildErrors: true,
  },
  // Настройка для GitHub Pages
  output: 'export',
  // Отключаем оптимизацию изображений, так как она не работает при статическом экспорте
  images: {
    unoptimized: true,
  },
  // Базовый путь для GitHub Pages (если репозиторий не использует custom domain)
  // Закомментируйте эту строку, если вы используете custom domain
  // basePath: '/gift-farm',
};

export default nextConfig; 