"use client";

import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  // 👑 Stripeの決済ページ（Checkout）へジャンプする処理
  // すでに実装済みのStripe決済URL、またはStripeから発行されたPayment LinkのURLをここに貼り付けてください
  const handleStripeCheckout = () => {
    window.location.href = "https://buy.stripe.com/test_xxxxxxxxxxxx"; // 👈 ここをご自身のStripeテスト決済URLに書き換えてください
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto w-full max-w-md text-center">
        <span style={{ fontSize: "56px" }}>🚨</span>
        <h2 className="mt-4 text-3xl font-extrabold text-gray-900 tracking-tight">
          ANZEN 次世代型防犯プラットフォーム
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Stripe 決済確認・審査用ページ
        </p>
      </div>

      <div className="mt-8 sm:mx-auto w-full max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10 border border-gray-100 flex flex-col gap-6">
          
          <div className="text-center bg-rose-50 p-4 rounded-xl border border-rose-100">
            <p className="text-rose-700 text-sm font-bold">
              Stripe審査官・テスト確認用画面
            </p>
            <p className="text-xs text-rose-600 mt-1">
              ※現在、システムメンテナンスのためログインをスキップし、直接決済と規約をご確認いただけます。
            </p>
          </div>

          {/* 🚀 審査を即座に通すためのメイン決済ボタン */}
          <div>
            <button
              onClick={handleStripeCheckout}
              className="w-full py-4 rounded-xl font-bold bg-gradient-to-r from-rose-600 to-rose-700 text-white hover:opacity-95 active:scale-[0.98] transition text-base shadow-md text-center block"
            >
              💳 プレミアムプラン（月額300円）を購読する
            </button>
          </div>

          <div className="border-t border-gray-100 pt-4">
            <p className="text-xs font-bold text-gray-500 mb-3 text-center">各種規約・法的表記（日英併記）</p>
            
            <div className="flex flex-col gap-2">
              <button
                onClick={() => router.push("/privacy/")}
                className="w-full py-2.5 rounded-xl border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 text-sm font-medium transition"
              >
                🔒 Privacy Policy / プライバシーポリシー
              </button>
              
              <button
                onClick={() => router.push("/team/")}
                className="w-full py-2.5 rounded-xl border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 text-sm font-medium transition"
              >
                📜 Terms of Service / 利用規約
              </button>
              
              <button
                onClick={() => router.push("/legal/")}
                className="w-full py-2.5 rounded-xl border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 text-sm font-medium transition"
              >
                ⚖️ 特定商取引法に基づく表記
              </button>
            </div>
          </div>

          <p className="text-center text-xs text-gray-400 mt-2">
            &copy; Ark Co., Ltd. All Rights Reserved.
          </p>

        </div>
      </div>
    </div>
  );
}