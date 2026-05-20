"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
// 👑 パスエラーの原因を100%根絶するため、2つ上の階層（../../lib/...）から確実に接続する記述に直しました
import { supabase } from "../../lib/supabaseClient";

export default function AdminPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreateAccount = async () => {
    if (loading) return;

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      // Supabase Authentication にユーザーを登録
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) {
        setError(`アカウント作成エラー: ${authError.message}`);
        setLoading(false);
        return;
      }

      setSuccess(`アカウント「${username}」の作成に成功しました！ログイン画面からログインしてテストしてください。`);
      
      // フォームをクリア
      setEmail("");
      setPassword("");
      setUsername("");

    } catch (err) {
      setError("通信エラーが発生しました。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto w-full max-w-md text-center">
        <span style={{ fontSize: "56px" }}>👑</span>
        <h2 className="mt-4 text-3xl font-extrabold text-gray-900 tracking-tight">
          ANZEN 管理システム
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          テスト環境：新規ユーザー作成・設定画面
        </p>
      </div>

      <div className="mt-8 sm:mx-auto w-full max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10 border border-gray-100 flex flex-col gap-5">
          
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              アカウント名（表示名）
            </label>
            <input
              type="text"
              placeholder="例：テストユーザー"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border border-gray-300 px-4 py-3 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white text-gray-900 text-base"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              テスト用メールアドレス
            </label>
            <input
              type="email"
              placeholder="test@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 px-4 py-3 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white text-gray-900 text-base"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              パスワード（6文字以上）
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 px-4 py-3 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white text-gray-900 text-base"
            />
          </div>

          {error && (
            <div className="bg-red-50 p-3 rounded-xl border border-red-100">
              <p className="text-red-600 text-sm text-center font-medium">{error}</p>
            </div>
          )}

          {success && (
            <div className="bg-green-50 p-3 rounded-xl border border-green-100">
              <p className="text-green-600 text-sm text-center font-medium">{success}</p>
            </div>
          )}

          <button
            onClick={handleCreateAccount}
            disabled={loading || !email || !password || !username}
            className={`w-full py-3.5 rounded-xl font-bold transition flex justify-center items-center text-base shadow-md ${
              loading || !email || !password || !username
                ? "bg-gray-300 text-gray-500 cursor-not-allowed shadow-none"
                : "bg-gradient-to-r from-rose-600 to-rose-700 text-white hover:opacity-95 active:scale-[0.98]"
            }`}
          >
            {loading ? "作成中..." : "テストアカウントを新規発行"}
          </button>

          <button
            onClick={() => window.location.href = "/login/"}
            className="w-full py-3 rounded-xl font-bold border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 active:scale-[0.98] transition text-sm"
          >
            ログイン画面に戻る
          </button>

        </div>
      </div>
    </div>
  );
}