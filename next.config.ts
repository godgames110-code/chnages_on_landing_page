import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Garantir que está em modo produção
  productionBrowserSourceMaps: false,
};

export default nextConfig;
