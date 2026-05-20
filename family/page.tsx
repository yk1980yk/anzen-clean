"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function FamilyPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [family, setFamily] = useState<any[]>([]);
  const [pending, setPending] = useState<any[]>([]);
  const [inviteCode, setInviteCode] = useState("");

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

  /* 家族一覧取得 */
  useEffect(() => {
    if (!userId) return;

    const fetchFamily = async () => {
      const { data, error } = await supabase
        .from("family_links")
        .select(
          `
          id,
          family_user_id,
          status,
          profiles:family_user_id (
            name,
            avatar_url
          )
        `
        )
        .eq("user_id", userId);

      if (error) console.error(error);

      if (data) {
        setFamily(data.filter((f) => f.status === "approved"));
        setPending(data.filter((f) => f.status === "pending"));
      }
    };

    fetchFamily();
  }, [userId]);

  /* 招待コード生成（= 自分の user_id） */
  const generateInviteCode = () => {
    if (!userId) return;
    setInviteCode(userId);
  };

  /* 招待コード入力 → 家族追加（pending） */
  const sendInvite = async () => {
    if (!userId) return;
    if (!inviteCode.trim()) return alert("招待コードを入力してください");

    const { error } = await supabase.from("family_links").insert({
      user_id: inviteCode, // 招待した側
      family_user_id: userId, // 自分
      status: "pending",
    });

    if (error) {
      console.error(error);
      return alert("招待に失敗しました");
    }

    alert("招待を送信しました（承認待ち）");
  };

  /* 承認 */
  const approve = async (id: string) => {
    const { error } = await supabase
      .from("family_links")
      .update({ status: "approved" })
      .eq("id", id);

    if (error) return alert("承認に失敗しました");
    alert("承認しました");
    location.reload();
  };

  /* 削除 */
  const remove = async (id: string) => {
    const { error } = await supabase
      .from("family_links")
      .delete()
      .eq("id", id);

    if (error) return alert("削除に失敗しました");
    alert("削除しました");
    location.reload();
  };

  return (
    <div style={{ padding: 20, maxWidth: 600, margin: "0 auto" }}>
      <h1 style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
        家族グループ
      </h1>

      {/* 招待コード生成 */}
      <button
        onClick={generateInviteCode}
        style={{
          padding: "10px 16px",
          background: "#2563EB",
          color: "white",
          borderRadius: 8,
          fontWeight: "bold",
          marginBottom: 20,
        }}
      >
        招待コードを生成
      </button>

      {inviteCode && (
        <div
          style={{
            padding: 12,
            background: "#f3f4f6",
            borderRadius: 8,
            marginBottom: 20,
          }}
        >
          <strong>あなたの招待コード:</strong>
          <div style={{ fontSize: 18, marginTop: 6 }}>{inviteCode}</div>
        </div>
      )}

      {/* 招待コード入力 */}
      <div style={{ marginBottom: 20 }}>
        <label style={{ fontWeight: "bold" }}>招待コードを入力</label>
        <input
          value={inviteCode}
          onChange={(e) => setInviteCode(e.target.value)}
          style={{
            width: "100%",
            padding: 10,
            marginTop: 6,
            border: "1px solid #ccc",
            borderRadius: 6,
          }}
        />
        <button
          onClick={sendInvite}
          style={{
            marginTop: 10,
            padding: "10px 16px",
            background: "#10b981",
            color: "white",
            borderRadius: 8,
            fontWeight: "bold",
          }}
        >
          招待を送信
        </button>
      </div>

      {/* 承認待ち */}
      <h2 style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
        承認待ち
      </h2>
      {pending.length === 0 && <p>承認待ちはありません。</p>}

      {pending.map((f) => (
        <div
          key={f.id}
          style={{
            padding: 12,
            border: "1px solid #ddd",
            borderRadius: 8,
            marginBottom: 10,
          }}
        >
          <div style={{ fontWeight: "bold" }}>
            {f.profiles?.name || "ユーザー"}
          </div>
          <button
            onClick={() => approve(f.id)}
            style={{
              marginTop: 8,
              padding: "6px 12px",
              background: "#2563EB",
              color: "white",
              borderRadius: 6,
              fontWeight: "bold",
            }}
          >
            承認
          </button>
        </div>
      ))}

      {/* 家族一覧 */}
      <h2 style={{ fontSize: 18, fontWeight: "bold", marginTop: 20 }}>
        家族一覧
      </h2>
      {family.length === 0 && <p>家族が登録されていません。</p>}

      {family.map((f) => (
        <div
          key={f.id}
          style={{
            padding: 12,
            border: "1px solid #ddd",
            borderRadius: 8,
            marginBottom: 10,
          }}
        >
          <div style={{ fontWeight: "bold" }}>
            {f.profiles?.name || "ユーザー"}
          </div>
          <button
            onClick={() => remove(f.id)}
            style={{
              marginTop: 8,
              padding: "6px 12px",
              background: "#dc2626",
              color: "white",
              borderRadius: 6,
              fontWeight: "bold",
            }}
          >
            削除
          </button>
        </div>
      ))}
    </div>
  );
}
