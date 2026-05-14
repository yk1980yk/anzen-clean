"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

export default function RoutesPage() {
  const [routes, setRoutes] = useState<any[]>([]);
  const [pointsCount, setPointsCount] = useState<Record<string, number>>({});
  const [distanceMap, setDistanceMap] = useState<Record<string, number>>({});

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

  /* ルート一覧取得 */
  useEffect(() => {
    const fetchRoutes = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("routes")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) console.error(error);
      if (data) setRoutes(data);
    };

    fetchRoutes();
  }, []);

  /* 各ルートのポイント数と距離を取得 */
  useEffect(() => {
    const loadPoints = async () => {
      const newCounts: Record<string, number> = {};
      const newDistances: Record<string, number> = {};

      for (const route of routes) {
        const { data: points } = await supabase
          .from("route_points")
          .select("lat, lng")
          .eq("route_id", route.id)
          .order("created_at", { ascending: true });

        if (points) {
          newCounts[route.id] = points.length;
          newDistances[route.id] = calcDistance(points);
        }
      }

      setPointsCount(newCounts);
      setDistanceMap(newDistances);
    };

    if (routes.length > 0) loadPoints();
  }, [routes]);

  return (
    <div style={{ padding: 20, maxWidth: 700, margin: "0 auto" }}>
      <h1 style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
        記録一覧
      </h1>

      {routes.length === 0 && <p>記録がありません。</p>}

      {routes.map((route) => (
        <div
          key={route.id}
          style={{
            padding: 16,
            border: "1px solid #ddd",
            borderRadius: 10,
            marginBottom: 16,
            background: "white",
          }}
        >
          {/* タイトル（日時） */}
          <div style={{ fontSize: 18, fontWeight: "bold", marginBottom: 6 }}>
            {route.title}
          </div>

          {/* ポイント数 */}
          <div style={{ fontSize: 14, marginBottom: 6 }}>
            ポイント数: {pointsCount[route.id] ?? "…"}
          </div>

          {/* 距離 */}
          <div style={{ fontSize: 14, marginBottom: 10 }}>
            距離: {distanceMap[route.id] ?? "…"} m
          </div>

          {/* 詳細ページへ */}
          <Link
            href={`/routes/${route.id}`}
            style={{
              display: "inline-block",
              padding: "8px 12px",
              background: "#2563EB",
              color: "white",
              borderRadius: 6,
              fontWeight: "bold",
              fontSize: 14,
            }}
          >
            詳細を見る
          </Link>
        </div>
      ))}
    </div>
  );
}
