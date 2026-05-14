import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ★ Strict Mode OFF（Leaflet の二重描画防止）
  reactStrictMode: false,
};

export default nextConfig;
