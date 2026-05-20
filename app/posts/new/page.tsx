"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function NewPostPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("incident");
  const [visibility, setVisibility] = useState("all");

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

  /* 投稿処理 */
  const handleSubmit = async () => {
    if (!title.trim()) return alert("タイトルを入力してください");
    if (!position) return alert("現在地が取得できません");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return alert("ログインが必要です");

    const { error } = await supabase.from("posts").insert({
      user_id: user.id,
      title,
      description,
      category,
      visibility,
      lat: position[0],
      lng: position[1],
    });

    if (error) {
      console.error(error);
      return alert("投稿に失敗しました");
    }

    alert("投稿が完了しました！");
    router.push("/map"); // マップ画面へ遷移
  };

  return (
    <div style={{ padding: 20, maxWidth: 600, margin: "0 auto" }}>
      <h1 style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
        新規投稿
      </h1>

      {/* タイトル */}
      <label style={{ fontWeight: "bold" }}>タイトル</label>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{
          width: "100%",
          padding: 10,
          marginTop: 6,
          marginBottom: 16,
          border: "1px solid #ccc",
          borderRadius: 6,
        }}
      />

      {/* 説明 */}
      <label style={{ fontWeight: "bold" }}>説明</label>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={4}
        style={{
          width: "100%",
          padding: 10,
          marginTop: 6,
          marginBottom: 16,
          border: "1px solid #ccc",
          borderRadius: 6,
        }}
      />

      {/* カテゴリ */}
      <label style={{ fontWeight: "bold" }}>カテゴリ</label>
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        style={{
          width: "100%",
          padding: 10,
          marginTop: 6,
          marginBottom: 16,
          border: "1px solid #ccc",
          borderRadius: 6,
        }}
      >
        <option value="incident">事件</option>
        <option value="suspicious">不審者</option>
        <option value="danger">危険</option>
      </select>

      {/* 公開範囲（不完全だった構文をクリーンに修復しました） */}
      <label style={{ fontWeight: "bold" }}>公開範囲</label>
      <select
        value={visibility}
        onChange={(e) => setVisibility(e.target.value)}
        style={{
          width: "100%",
          padding: 10,
          marginTop: 6,
          marginBottom: 16,
          border: "1px solid #ccc",
          borderRadius: 6,
        }}
      >
        <option value="all">全体</option>
        <option value="nearby">近くの人</option>
        <option value="family_nearby">家族・近くの人</option>
      </select>

      {/* 位置情報ステータス */}
      <p style={{ fontSize: 14, color: position ? "green" : "orange", marginBottom: 20 }}>
        {position
          ? `📍 位置情報取得済み (${position[0].toFixed(4)}, ${position[1].toFixed(4)})`
          : "⏳ 位置情報を取得中..."}
      </p>

      {/* 送信ボタン */}
      <button
        onClick={handleSubmit}
        style={{
          width: "100%",
          padding: 14,
          background: "#E11D48",
          color: "white",
          border: "none",
          borderRadius: 6,
          fontSize: 16,
          fontWeight: "bold",
          cursor: "pointer",
        }}
      >
        投稿する
      </button>
    </div>
  );
}