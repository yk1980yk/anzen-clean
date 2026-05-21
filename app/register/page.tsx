"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        setErrorMsg(error.message);
      } else if (data?.user) {
        setSuccessMsg("アカウント作成が成功しました！ログイン中...");
        // 登録成功したらそのまま自動的にログインさせてマップへ誘導します
        setTimeout(() => {
          router.push("/map");
        }, 1500);
      }
    } catch (err) {
      setErrorMsg("接続エラーが発生しました。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto w-full max-w-md text-center">
        <span style={{ fontSize: "56px" }}>✨</span>
        <h2 className="mt-4 text-3xl font-black text-slate-900 tracking-tight">
          ANZEN アカウント登録
        </h2>
        <p className="mt-2 text-sm text-slate-500 font-medium">
          メールアドレスを入力してアカウントを作成してください。
        </p>
      </div>

      <div className="mt-8 sm:mx-auto w-full max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10 border border-slate-100">
          <form className="space-y-5" onSubmit={handleRegister}>
            <div>
              <label className="block text-sm font-bold text-slate-700">
                メールアドレス
              </label>
              <div className="mt-1">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl shadow-sm text-sm focus:outline-none focus:border-indigo-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700">
                パスワード
              </label>
              <div className="mt-1">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl shadow-sm text-sm focus:outline-none focus:border-indigo-500 transition"
                />
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-50 text-red-700 text-xs font-bold rounded-xl border border-red-100">
                ⚠️ {errorMsg}
              </div>
            )}

            {successMsg && (
              <div className="p-3 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-xl border border-emerald-100">
                🎉 {successMsg}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl font-bold bg-emerald-600 text-white hover:bg-emerald-700 active:scale-[0.98] transition text-sm shadow-md flex justify-center items-center disabled:opacity-50"
              >
                {loading ? "処理中..." : "無料でアカウントを作成する"}
              </button>
            </div>
          </form>

          <div className="mt-6 border-t border-slate-100 pt-4 text-center">
            <button
              onClick={() => router.push("/")}
              className="text-xs font-bold text-slate-400 hover:text-slate-600 transition"
            >
              ← トップに戻る
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}