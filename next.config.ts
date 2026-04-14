import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Zorg dat de docs/ map meegenomen wordt in de Vercel serverless bundle
  outputFileTracingIncludes: {
    '/api/download/[leadId]': ['./docs/**'],
    '/': ['./docs/**'],
    '/admin/upload': ['./docs/**'],
  },
};

export default nextConfig;
