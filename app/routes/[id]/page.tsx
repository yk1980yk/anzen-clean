"use client";

import dynamic from "next/dynamic";
import { useEffect, useState, useRef, ComponentType } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

/* Leaflet（SSR無効 & キャスト） */
const MapContainer = dynamic(
  () => import("react-leaflet").then((m) => m.MapContainer),
  { ssr: false }
) as ComponentType<any>;

const TileLayer = dynamic(
  () => import("react-leaflet").then((m) => m.TileLayer),
  { ssr: false }
) as ComponentType<any>;

const Marker = dynamic(
  () => import("react-leaflet").then((m) => m.Marker),
  { ssr: false }
) as ComponentType<any>;

const Polyline = dynamic(
  () => import("react-leaflet").then((m) => m.Polyline),
  { ssr: false }
) as ComponentType<any>;

export default function RouteDetailPage({ params }: { params: { id: string } }) {
  const routeId = params.id;

  const [points, setPoints] = useState<any[]>([]);
  const [distance, setDistance] = useState(0);
  const mapRef = useRef<any>(null);

  /* トグルのON/OFF状態管理 */
  const [showDanger, setShowDanger] = useState(true);
  const [showTraffic, setShowTraffic] = useState(false);
  const [showDelay, setShowDelay] = useState(false);

  /* 距離計算（メートル） */
  const calcDistance = (points: any[]) => {
    if (points.length < 2) return 0;
    const R = 6371e3;
    const toRad = (x: number) => (x * Math.PI) / 180;
    let total = 0;

    for (let i = 1; i < points.length; i++) {
      const p1 = points[i - 1];
      const p2 = points[i];
      const φ1 = toRad(p1.lat);
      const φ2 = toRad(p2.lat);
      const Δφ = toRad(p2.lat - p1.lat);
      const Δλ = toRad(p2.lng - p1.lng);

      const a =
        Math.sin(Δφ / 2) ** 2 +
        Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      total += R * c;
    }
    return Math.round(total);
  };

  /* ルートポイント取得 */
  useEffect(() => {
    const fetchPoints = async () => {
      const { data, error } = await supabase
        .from("route_points")
        .select("lat, lng")
        .eq("route_id", routeId)
        .order("created_at", { ascending: true });

      if (error) console.error(error);
      if (data) {
        setPoints(data);
        setDistance(calcDistance(data));
      }
    };
    fetchPoints();
  }, [routeId]);

  const start = points[0];
  const end = points[points.length - 1];

  // 緊急・防犯ボタン押下時の処理
  const handleEmergencyAlarm = () => {
    alert("🚨 防犯アラームが作動しました！グループメンバーに現在地を通知します。");
  };

  // 日常・投稿プラスボタン押下時の処理
  const handleCreatePost = () => {
    alert("＋ 新しい安全情報（気づき）の投稿フォームを開きます。");
  };

  return (
    <div className="relative w-full overflow-hidden bg-slate-50" style={{ height: "100dvh" }}>
      
      {/* 🔙 戻るボタン */}
      <Link
        href="/routes"
        className="absolute top-4 left-4 z-[1000] px-3 py-2 bg-white/90 backdrop-blur-sm rounded-xl border border-slate-200 text-sm font-bold shadow-md text-slate-700 hover:bg-slate-50 transition-all"
      >
        ← 戻る
      </Link>

      {/* 📏 距離・安全情報レイヤー（簡易表示） */}
      <div className="absolute top-4 left-24 z-[1000] px-3 py-2 bg-white/90 backdrop-blur-sm rounded-xl border border-slate-200 text-xs font-bold shadow-md text-slate-600">
        ルート距離: {distance} m
      </div>

      {/* 👑 右上：スマート・フィルター・トグルバー（視覚化） */}
      <div className="absolute top-4 right-4 z-[1000] bg-white/95 backdrop-blur-md shadow-lg rounded-full px-3 py-1.5 flex items-center gap-3 border border-slate-200/80">
        {/* 事件・事故 */}
        <button 
          onClick={() => setShowDanger(!showDanger)}
          className={`flex flex-col items-center p-1 rounded-full transition-all ${showDanger ? "opacity-100 scale-105" : "opacity-30"}`}
        >
          <span className="text-lg">🚨</span>
          <span className="text-[9px] font-black text-red-600">事件事故</span>
        </button>
        <div className="h-4 w-[1px] bg-slate-300"></div>

        {/* 渋滞 */}
        <button 
          onClick={() => setShowTraffic(!showTraffic)}
          className={`flex flex-col items-center p-1 rounded-full transition-all ${showTraffic ? "opacity-100 scale-105" : "opacity-30"}`}
        >
          <span className="text-lg">🚗</span>
          <span className="text-[9px] font-black text-blue-600">渋滞</span>
        </button>
        <div className="h-4 w-[1px] bg-slate-300"></div>

        {/* 遅延 */}
        <button 
          onClick={() => setShowDelay(!showDelay)}
          className={`flex flex-col items-center p-1 rounded-full transition-all ${showDelay ? "opacity-100 scale-105" : "opacity-30"}`}
        >
          <span className="text-lg">🚃</span>
          <span className="text-[9px] font-black text-amber-600">遅延</span>
        </button>
      </div>

      {/* 🛑 左下：緊急防犯アラームボタン（最優先・赤色） */}
      <div className="absolute bottom-6 left-4 z-[1000]">
        <button 
          onClick={handleEmergencyAlarm}
          className="w-16 h-16 bg-red-600 active:bg-red-700 text-white rounded-full shadow-2xl flex flex-col items-center justify-center border-4 border-white transform active:scale-95 transition-all"
        >
          <span className="text-xl">⚠️</span>
          <span className="text-[10px] font-black tracking-tighter">防犯</span>
        </button>
      </div>

      {/* 📝 右下：日常・投稿プラスボタン（青色） */}
      <div className="absolute bottom-6 right-4 z-[1000]">
        <button 
          onClick={handleCreatePost}
          className="w-14 h-14 bg-blue-600 active:bg-blue-700 text-white rounded-full shadow-xl flex items-center justify-center transform active:scale-95 transition-all text-3xl font-light border-2 border-white"
        >
          ＋
        </button>
      </div>

      {/* 🗺️ 中央：メインマップ表示エリア */}
      <div className="w-full h-full z-0">
        {points.length > 0 ? (
          <MapContainer
            center={[start.lat, start.lng]}
            zoom={16}
            whenCreated={(map: any) => (mapRef.current = map)}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            {/* 開始地点 */}
            <Marker position={[start.lat, start.lng]} />

            {/* 終了地点 */}
            <Marker position={[end.lat, end.lng]} />

            {/* ルート線 */}
            <Polyline
              positions={points.map((p) => [p.lat, p.lng])}
              pathOptions={{ color: "#2563EB", weight: 5 }}
            />
          </MapContainer>
        ) : (
          <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400 text-sm font-medium">
            ルートデータを読み込み中...
          </div>
        )}
      </div>
    </div>
  );
}