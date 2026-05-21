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

interface RouteDetailClientProps {
  routeId: string;
}

export default function RouteDetailClient({ routeId }: RouteDetailClientProps) {
  const [points, setPoints] = useState<any[]>([]);
  const [distance, setDistance] = useState(0);
  const mapRef = useRef<any>(null);

  /* 🗺️ レイヤーコントロールメニュー自体の開閉状態 */
  const [isLayerMenuOpen, setIsLayerMenuOpen] = useState(false);

  /* トグルのON/OFF状態管理 */
  const [showDanger, setShowDanger] = useState(true);
  const [showTraffic, setShowTraffic] = useState(false);
  const [showDelay, setShowDelay] = useState(false);

  /* 距離計算ロジック */
  const calcDistance = (points: any[]) => {
    if (points.length < 2) return 0;
    const R = 6371e3; // metres
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

  /* Supabaseからのデータ取得 */
  useEffect(() => {
    const fetchPoints = async () => {
      if (!routeId || routeId === "default") return;
      
      const { data, error } = await supabase
        .from("route_points")
        .select("lat, lng")
        .eq("route_id", routeId)
        .order("created_at", { ascending: true });

      if (error) console.error(error);
      if (data && data.length > 0) {
        setPoints(data);
        setDistance(calcDistance(data));

        if (mapRef.current) {
          const bounds = data.map((p: any) => [p.lat, p.lng]);
          mapRef.current.fitBounds(bounds);
        }
      }
    };
    fetchPoints();
  }, [routeId]);

  const start = points[0];
  const end = points[points.length - 1];

  const handleEmergencyAlarm = () => {
    alert("📣 安全通報・情報共有フォームを開きます（モック）");
  };

  const handleCreatePost = () => {
    alert("＋ 新しいルート追加や気づきの投稿フォームを開きます。");
  };

  return (
    <div className="relative w-full overflow-hidden bg-slate-50" style={{ height: "100dvh" }}>
      
      {/* 🔙 左上：戻るボタン */}
      <Link
        href="/routes"
        className="absolute top-4 left-4 z-[1000] px-3 py-2 bg-white/95 backdrop-blur-sm rounded-xl border-2 border-slate-300 text-sm font-black shadow-md text-slate-800 hover:bg-slate-100 transition-all"
      >
        ← 戻る
      </Link>

      {/* 📏 左上：距離インフォメーション */}
      <div className="absolute top-4 left-24 z-[1000] px-3 py-2 bg-slate-900 text-white rounded-xl border border-slate-800 text-xs font-black shadow-md">
        ルート距離: {distance} m
      </div>

      {/* 🎛️ 右上：格納式レイヤーコントロール */}
      <div className="absolute top-4 right-4 z-[1000] flex flex-col items-end gap-2">
        <button
          onClick={() => setIsLayerMenuOpen(!isLayerMenuOpen)}
          className={`w-11 h-11 rounded-full shadow-xl flex items-center justify-center border-2 transition-all active:scale-95 ${
            isLayerMenuOpen 
              ? "bg-slate-900 text-white border-slate-950" 
              : "bg-white text-slate-800 border-slate-300 hover:bg-slate-50"
          }`}
        >
          {isLayerMenuOpen ? <span className="text-base font-black">✕</span> : <span className="text-xl">🗺️</span>}
        </button>

        {isLayerMenuOpen && (
          <div className="bg-white text-slate-900 shadow-2xl rounded-2xl p-3 flex flex-col gap-2 border-2 border-slate-200 min-w-[150px] animate-in fade-in slide-in-from-top-2 duration-150">
            <p className="text-[10px] font-black text-slate-400 px-1 border-b border-slate-100 pb-1 mb-0.5">表示レイヤー</p>
            
            <button 
              onClick={() => setShowDanger(!showDanger)}
              className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-left transition-all active:scale-95 ${
                showDanger ? "bg-red-100 text-red-900 font-black border border-red-300" : "text-slate-400 opacity-40 border border-transparent"
              }`}
            >
              <span className="text-base">🚨</span>
              <span className="text-xs">防犯・トラブル</span>
            </button>

            <button 
              onClick={() => setShowTraffic(!showTraffic)}
              className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-left transition-all active:scale-95 ${
                showTraffic ? "bg-blue-100 text-blue-900 font-black border border-blue-300" : "text-slate-400 opacity-40 border border-transparent"
              }`}
            >
              <span className="text-base">🚗</span>
              <span className="text-xs">渋滞・道路</span>
            </button>

            <button 
              onClick={() => setShowDelay(!showDelay)}
              className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-left transition-all active:scale-95 ${
                showDelay ? "bg-amber-100 text-amber-900 font-black border border-amber-300" : "text-slate-400 opacity-40 border border-transparent"
              }`}
            >
              <span className="text-base">🚃</span>
              <span className="text-xs">鉄道運行</span>
            </button>
          </div>
        )}
      </div>

      {/* 🛑 下部：丸型フローティングボタン */}
      <div className="absolute bottom-8 left-6 right-6 z-[1000] flex justify-between items-center pointer-events-none">
        <div className="pointer-events-auto">
          <button 
            onClick={handleEmergencyAlarm}
            className="w-14 h-14 bg-amber-500 active:bg-amber-600 text-white rounded-full shadow-2xl flex items-center justify-center border-4 border-white transform active:scale-95 transition-all text-2xl"
          >
            📣
          </button>
        </div>

        <div className="pointer-events-auto">
          <button 
            onClick={handleCreatePost}
            className="w-14 h-14 bg-blue-600 active:bg-blue-700 text-white rounded-full shadow-2xl flex items-center justify-center transform active:scale-95 transition-all text-2xl font-light border-4 border-white"
          >
            ＋
          </button>
        </div>
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

            <Marker position={[start.lat, start.lng]} />
            <Marker position={[end.lat, end.lng]} />

            {/* 白縁取り ＆ 濃い純青ルート線 */}
            <Polyline
              positions={points.map((p) => [p.lat, p.lng])}
              pathOptions={{ color: "#FFFFFF", weight: 10, opacity: 1.0 }}
            />
            <Polyline
              positions={points.map((p) => [p.lat, p.lng])}
              pathOptions={{ color: "#1D4ED8", weight: 5, opacity: 1.0 }}
            />
          </MapContainer>
        ) : (
          <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-500 text-sm font-black">
            ルートデータを読み込み中...
          </div>
        )}
      </div>
    </div>
  );
}