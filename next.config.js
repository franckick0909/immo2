/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "res.cloudinary.com",
      "lh3.googleusercontent.com",
      "avatars.githubusercontent.com",
    ],
  },
  async headers() {
    return [
      {
        // Appliquer ces en-têtes à toutes les routes
        source: "/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "*", // Autoriser toutes les origines pour les requêtes API
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, PUT, DELETE, OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization",
          },
          {
            key: "Access-Control-Allow-Credentials",
            value: "true",
          },
          {
            key: "Access-Control-Max-Age",
            value: "86400", // 24 heures
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains",
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      // Redirection de vercel.app vers le domaine principal
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "immo2-franckicks.vercel.app",
          },
        ],
        destination: "https://immo1.shop/:path*",
        permanent: true,
      },
      // Forcer HTTPS
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "immo1.shop",
          },
        ],
        missing: [
          {
            type: "header",
            key: "x-forwarded-proto",
            value: "https",
          },
        ],
        destination: "https://immo1.shop/:path*",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
