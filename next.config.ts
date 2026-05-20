import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ★ Strict Mode OFF（Leaflet の二重描画防止機能：残してあります）
  reactStrictMode: false,

  // ★ 本番公開用（Firebase Hosting）の静的書き出し設定を追加
  output: "export",

  // 👑 すべてのページをフォルダ形式（index.html）に強制統一し、Firebaseとの404競合を根絶する設定
  trailingSlash: true,

  // 画像最適化機能を静的エクスポートに適合させる設定
  images: {
    unoptimized: true,
  },
};

export default nextConfig;