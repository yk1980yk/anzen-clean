"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function HomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  // 🔐 すでにログインしているセッションがあれば自動でマップへリダイレクト
  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          router.push("/map");
        }
      } catch (error) {
        console.error("セッション確認エラー:", error);
      } finally {
        setLoading(false);
      }
    };
    checkUserSession();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-sans text-sm font-medium text-slate-400">
        読み込み中...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto w-full max-w-md text-center">
        <span style={{ fontSize: "56px" }}>🚨</span>
        <h2 className="mt-4 text-3xl font-black text-slate-900 tracking-tight">
          ANZEN プラットフォーム
        </h2>
        <p className="mt-2 text-sm text-slate-500 font-medium">
          あなたの毎日に、確かな安心と気づきを。
        </p>
      </div>

      <div className="mt-8 sm:mx-auto w-full max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10 border border-slate-100 flex flex-col gap-5">
          
          {/* メイン認証導線 */}
          <div className="flex flex-col gap-3">
            <button
              onClick={() => router.push("/login")}
              className="w-full py-3.5 rounded-xl font-bold bg-indigo-600 text-white hover:bg-indigo-700 active:scale-[0.98] transition text-sm shadow-md text-center block"
            >
              🔐 アカウントにログイン / 新規登録
            </button>

            <button
              onClick={() => router.push("/map")}
              className="w-full py-3.5 rounded-xl font-bold bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 active:scale-[0.98] transition text-sm shadow-sm text-center block"
            >
              🗺️ ログインせずに直接マップを見る（ゲスト利用）
            </button>
          </div>

          <div className="relative flex items-center justify-center my-1">
            <div className="absolute w-full border-t border-slate-100"></div>
            <span className="relative bg-white px-3 text-xs text-slate-400 font-bold uppercase tracking-wider">メンバーシップ</span>
          </div>

          {/* 一般公開用のサブスクリプション導線 */}
          <div>
            <button
              onClick={() => window.location.href = "https://buy.stripe.com/test_xxxxxxxxxxxx"} // 👈 本物のStripeテスト決済URLに書き換えてください
              className="w-full py-3.5 rounded-xl font-bold bg-gradient-to-r from-slate-800 to-slate-900 text-white hover:opacity-95 active:scale-[0.98] transition text-sm shadow-md text-center block"
            >
              💳 プレミアムプラン（月額300円）に加入する
            </button>
          </div>

          {/* 各種規約（すっきりしたフッターリンクに変更） */}
          <div className="border-t border-slate-100 pt-5 mt-2 flex justify-around text-xs font-semibold text-slate-400">
            <button onClick={() => router.push("/privacy")} className="hover:text-slate-600 transition">プライバシーポリシー</button>
            <span>•</span>
            <button onClick={() => router.push("/team")} className="hover:text-slate-600 transition">利用規約</button>
            <span>•</span>
            <button onClick={() => router.push("/legal")} className="hover:text-slate-600 transition">特定商取引法表記</button>
          </div>

          <p className="text-center text-[10px] text-slate-400 mt-2 font-medium">
            &copy; Ark Co., Ltd. All Rights Reserved.
          </p>

        </div>
      </div>
    </div>
  );
}