/** @type {import('next').NextConfig} */
const nextConfig = {
  // Move serverComponentsExternalPackages to root level
  serverExternalPackages: ['@genkit-ai/core', '@genkit-ai/flow'],
  // Add headers for camera permissions
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Permissions-Policy',
            value: 'camera=(self), microphone=(self)'
          }
        ]
      }
    ]
  }
}

module.exports = nextConfig 