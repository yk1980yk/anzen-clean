"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // 🔑 Supabase Auth を使った本物のログイン処理
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        setErrorMsg("ログインに失敗しました。メールアドレスまたはパスワードが正しくありません。");
        console.error("Auth error:", error.message);
      } else if (data.user) {
        // ログイン成功したらメインのマップへ遷移
        router.push("/map");
      }
    } catch (err) {
      setErrorMsg("通信エラーが発生しました。時間を置いて再度お試しください。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto w-full max-w-md text-center">
        <span style={{ fontSize: "56px" }}>🔐</span>
        <h2 className="mt-4 text-3xl font-black text-slate-900 tracking-tight">
          ANZEN アカウントログイン
        </h2>
        <p className="mt-2 text-sm text-slate-500 font-medium">
          登録済みのメールアドレスでログインしてください。
        </p>
      </div>

      <div className="mt-8 sm:mx-auto w-full max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10 border border-slate-100">
          
          {/* エラーメッセージ表示エリア */}
          {errorMsg && (
            <div className="mb-5 text-center bg-red-50 p-3 rounded-xl border border-red-100">
              <p className="text-red-600 text-xs font-bold">{errorMsg}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">
                メールアドレス
              </label>
              <input
                type="email"
                required
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-slate-200 px-4 py-3 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-slate-900 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">
                パスワード
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-slate-200 px-4 py-3 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-slate-900 text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-700 text-white active:scale-[0.98] transition shadow-md text-sm disabled:opacity-50"
            >
              {loading ? "サインイン中..." : "ログインする"}
            </button>
          </form>

          {/* 戻るリンク */}
          <div className="mt-6 text-center">
            <button 
              onClick={() => router.push("/")}
              className="text-xs font-bold text-indigo-500 hover:underline"
            >
              ← トップに戻る
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}