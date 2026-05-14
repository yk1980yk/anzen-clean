"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

export default function DangerAreasPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [areas, setAreas] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [position, setPosition] = useState<[number, number] | null>(null);

  /* ログインユーザー取得 */
  useEffect(() => {
    const loadUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) setUserId(user.id);
    };
    loadUser();
  }, []);

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

  /* 危険エリア一覧取得 */
  useEffect(() => {
    if (!userId) return;

    const fetchAreas = async () => {
      const { data, error } = await supabase
        .from("danger_areas")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) console.error(error);
      if (data) setAreas(data);
    };

    fetchAreas();
  }, [userId]);

  /* 危険エリア追加 */
  const addArea = async () => {
    if (!title.trim()) return alert("タイトルを入力してください");
    if (!position) return alert("現在地が取得できません");

    const { error } = await supabase.from("danger_areas").insert({
      user_id: userId,
      title,
      lat: position[0],
      lng: position[1],
    });

    if (error) {
      console.error(error);
      return alert("追加に失敗しました");
    }

    alert("危険エリアを追加しました");
    location.reload();
  };

  /* 削除 */
  const removeArea = async (id: string) => {
    const { error } = await supabase
      .from("danger_areas")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(error);
      return alert("削除に失敗しました");
    }

    alert("削除しました");
    location.reload();
  };

  return (
    <div style={{ padding: 20, maxWidth: 700, margin: "0 auto" }}>
      <h1 style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
        危険エリア管理
      </h1>

      {/* 新規追加 */}
      <div style={{ marginBottom: 20 }}>
        <label style={{ fontWeight: "bold" }}>タイトル</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{
            width: "100%",
            padding: 10,
            marginTop: 6,
            border: "1px solid #ccc",
            borderRadius: 6,
          }}
        />

        <div style={{ marginTop: 10, marginBottom: 10 }}>
          <strong>現在地:</strong>{" "}
          {position ? `${position[0]}, ${position[1]}` : "取得中..."}
        </div>

        <button
          onClick={addArea}
          style={{
            padding: "10px 16px",
            background: "#dc2626",
            color: "white",
            borderRadius: 8,
            fontWeight: "bold",
          }}
        >
          危険エリアを追加
        </button>
      </div>

      {/* 一覧 */}
      <h2 style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
        登録済みエリア
      </h2>

      {areas.length === 0 && <p>登録された危険エリアはありません。</p>}

      {areas.map((area) => (
        <div
          key={area.id}
          style={{
            padding: 16,
            border: "1px solid #ddd",
            borderRadius: 10,
            marginBottom: 16,
            background: "white",
          }}
        >
          <div style={{ fontSize: 18, fontWeight: "bold", marginBottom: 6 }}>
            {area.title}
          </div>

          <div style={{ fontSize: 14, marginBottom: 10 }}>
            {area.lat}, {area.lng}
          </div>

          {/* 地図で見る */}
          <Link
            href={`/map?lat=${area.lat}&lng=${area.lng}`}
            style={{
              display: "inline-block",
              padding: "8px 12px",
              background: "#2563EB",
              color: "white",
              borderRadius: 6,
              fontWeight: "bold",
              fontSize: 14,
              marginRight: 10,
            }}
          >
            地図で見る
          </Link>

          {/* 削除 */}
          <button
            onClick={() => removeArea(area.id)}
            style={{
              padding: "8px 12px",
              background: "#dc2626",
              color: "white",
              borderRadius: 6,
              fontWeight: "bold",
              fontSize: 14,
            }}
          >
            削除
          </button>
        </div>
      ))}
    </div>
  );
}
