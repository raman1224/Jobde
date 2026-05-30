// // // next.config.js
// // /** @type {import('next').NextConfig} */
// // const nextConfig = {
// //   images: {
// //     domains: ['res.cloudinary.com', 'avatars.githubusercontent.com', 'lh3.googleusercontent.com'],
// //   },
// //   typescript: {
// //     ignoreBuildErrors: false,
// //   },
// //   eslint: {
// //     ignoreDuringBuilds: false,
// //   },
// //   swcMinify: true,
// //   compiler: {
// //     removeConsole: process.env.NODE_ENV === 'production',
// //   },
// //   experimental: {
// //     // turbo: {
// //     //   resolveExtensions: ['.tsx', '.ts', '.jsx', '.js', '.json'],
// //     // },
// //     optimizePackageImports: ['@radix-ui/react-icons', 'lucide-react', 'framer-motion'],
// //   },
// // }
// // export default nextConfig
// // // module.exports = nextConfig



// import nextPWA from 'next-pwa'

// const withPWA = nextPWA({
//   dest: 'public',
//   disable: process.env.NODE_ENV === 'development',
// })

// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   images: {
//     domains: [
//       'res.cloudinary.com',
//       'avatars.githubusercontent.com',
//       'lh3.googleusercontent.com',
//     ],
//   },

//   typescript: {
//     ignoreBuildErrors: false,
//   },

//   eslint: {
//     ignoreDuringBuilds: false,
//   },

//   swcMinify: true,

//   compiler: {
//     removeConsole: process.env.NODE_ENV === 'production',
//   },

//   experimental: {
//     optimizePackageImports: [
//       '@radix-ui/react-icons',
//       'lucide-react',
//       'framer-motion',
//     ],
//   },
// }

// export default withPWA(nextConfig)


// next.config.mjs - OPTIMIZED FOR PRODUCTION
/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "export",
  images: {
    domains: ['res.cloudinary.com', 'avatars.githubusercontent.com', 'lh3.googleusercontent.com'],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  swcMinify: true,
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  productionBrowserSourceMaps: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react', 'framer-motion', '@radix-ui/react-icons'],
  },
  headers: async () => {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          }
        ]
      }
    ]
  },
}

export default nextConfig