"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

export default function PostsPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [position, setPosition] = useState<[number, number] | null>(null);

  /* 現在地取得 */
  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition([pos.coords.latitude, pos.coords.longitude]);
      },
      (err) => console.error("位置情報エラー:", err),
      { enableHighAccuracy: true }
    );
  }, []);

  /* 投稿一覧取得 */
  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from("posts")
        .select(
          `
          *,
          profiles:user_id (
            name,
            avatar_url
          )
        `
        )
        .order("created_at", { ascending: false });

      if (error) console.error(error);
      if (data) setPosts(data);
    };

    fetchPosts();
  }, []);

  /* 距離計算（メートル） */
  const calcDistance = (
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
  ) => {
    const R = 6371e3;
    const toRad = (x: number) => (x * Math.PI) / 180;

    const φ1 = toRad(lat1);
    const φ2 = toRad(lat2);
    const Δφ = toRad(lat2 - lat1);
    const Δλ = toRad(lng2 - lng1);

    const a =
      Math.sin(Δφ / 2) ** 2 +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return Math.round(R * c);
  };

  return (
    <div style={{ padding: 20, maxWidth: 700, margin: "0 auto" }}>
      <h1 style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
        投稿一覧
      </h1>

      {/* 新規投稿ボタン */}
      <Link
        href="/posts/new"
        style={{
          display: "inline-block",
          padding: "10px 16px",
          background: "#2563EB",
          color: "white",
          borderRadius: 8,
          fontWeight: "bold",
          marginBottom: 20,
        }}
      >
        ＋ 新規投稿
      </Link>

      {/* 投稿リスト */}
      {posts.length === 0 && <p>投稿がありません。</p>}

      {posts.map((post) => {
        const avatar =
          post.profiles?.avatar_url ||
          "https://cdn-icons-png.flaticon.com/512/456/456212.png";

        const name = post.profiles?.name || "匿名ユーザー";

        const distance =
          position &&
          calcDistance(position[0], position[1], post.lat, post.lng);

        return (
          <div
            key={post.id}
            style={{
              padding: 16,
              border: "1px solid #ddd",
              borderRadius: 10,
              marginBottom: 16,
              background: "white",
            }}
          >
            {/* 投稿者 */}
            <div style={{ display: "flex", alignItems: "center", marginBottom: 10 }}>
              <img
                src={avatar}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  marginRight: 10,
                  objectFit: "cover",
                }}
              />
              <div>
                <div style={{ fontWeight: "bold" }}>{name}</div>
                <div style={{ fontSize: 12, opacity: 0.7 }}>
                  {new Date(post.created_at).toLocaleString()}
                </div>
              </div>
            </div>

            {/* タイトル */}
            <div style={{ fontSize: 18, fontWeight: "bold", marginBottom: 6 }}>
              {post.title}
            </div>

            {/* 説明（短縮） */}
            <div style={{ fontSize: 14, opacity: 0.8, marginBottom: 10 }}>
              {post.description?.slice(0, 80)}
              {post.description?.length > 80 && "…"}
            </div>

            {/* カテゴリ */}
            <div
              style={{
                display: "inline-block",
                padding: "4px 8px",
                background: "#eee",
                borderRadius: 6,
                fontSize: 12,
                marginBottom: 10,
              }}
            >
              {post.category}
            </div>

            {/* 距離 */}
            {distance && (
              <div style={{ fontSize: 14, marginBottom: 10 }}>
                距離: {distance}m
              </div>
            )}

            {/* 地図で見る */}
            <Link
              href={`/map?lat=${post.lat}&lng=${post.lng}`}
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
              地図で見る
            </Link>
          </div>
        );
      })}
    </div>
  );
}
