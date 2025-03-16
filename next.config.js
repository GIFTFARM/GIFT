/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'nft.fragment.com',
        pathname: '/gift/**',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'ipfs.io',
        pathname: '/ipfs/**',
      },
    ],
  },
  // Добавляем заголовки для Telegram Web App
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://telegram.org https://*.telegram.org; connect-src 'self' https://*.ton.org https://*.tonapi.io https://api.tonkeeper.com https://toncenter.com https://*.toncenter.com wss://*.toncenter.com https://tonapi.io https://api.ton.cat https://api.ton.sh https://telegram.org https://*.telegram.org; img-src 'self' blob: data: https://nft.fragment.com https://placehold.co https://ipfs.io https://telegram.org https://*.telegram.org; style-src 'self' 'unsafe-inline'; font-src 'self' data:; frame-src 'self' https://telegram.org https://*.telegram.org https://tonkeeper.com https://*.tonkeeper.com https://tonhub.com https://*.tonhub.com;",
          },
          {
            key: 'X-Frame-Options',
            value: 'ALLOW-FROM https://telegram.org',
          },
        ],
      },
    ];
  },
}

module.exports = nextConfig 