/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // The location data is read from disk at runtime, so it has to be included
    // in the traced output of every route that renders it.
    outputFileTracingIncludes: {
      '/**/*': ['./data/locations/**/*'],
    },
  },
}

export default nextConfig
