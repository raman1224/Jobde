// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['res.cloudinary.com', 'avatars.githubusercontent.com', 'lh3.googleusercontent.com'],
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  experimental: {
    // turbo: {
    //   resolveExtensions: ['.tsx', '.ts', '.jsx', '.js', '.json'],
    // },
    optimizePackageImports: ['@radix-ui/react-icons', 'lucide-react', 'framer-motion'],
  },
}
export default nextConfig
// module.exports = nextConfig