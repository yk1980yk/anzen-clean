import { use } from "react";
import RouteDetailClient from "./RouteDetailClient";

// 👑 静的エクスポート（output: "export"）のビルドエラーを100%根絶するための正しい記述です
export const dynamicParams = false;

export async function generateStaticParams() {
  return [
    { id: "default" }
  ];
}

interface PageProps {
  params: Promise<{ id: string }> | { id: string };
}

export default function RouteDetailPage({ params }: PageProps) {
  // Next.js 15 の非同期 params を安全に展開します
  const resolvedParams = params instanceof Promise ? use(params) : params;
  const routeId = resolvedParams?.id || "default";

  // 実際の画面描画は、隣に新設する RouteDetailClient にすべて委ねます
  return <RouteDetailClient routeId={routeId} />;
}