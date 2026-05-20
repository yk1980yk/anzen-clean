"use client";

import { useState } from "react";

// ゲーミフィケーションのステータス型定義
interface GuardianStatus {
  rank: 'ブロンズ' | 'シルバー' | 'ゴールド';
  score: number;
  helpedCount: number;
  weeklyReports: number; // 今週のアクション数（情報の確認・ON/OFFなど）
  totalPosts: number;    // 総投稿数
}

export default function ProfilePage() {
  // 💰 今後はSupabaseやFirestore等のリアルタイムStateと同期
  const [status] = useState<GuardianStatus>({
    rank: 'シルバー',
    score: 1250,
    helpedCount: 12,
    weeklyReports: 8,
    totalPosts: 4,
  });

  // 🏅 ランクに応じたグラデーション・カラーテーマを動的に決定するマップ
  const rankThemes = {
    ブロンズ: {
      bg: "from-amber-700 to-amber-900",
      badge: "bg-amber-100 text-amber-800",
      progress: "w-[35%]",
      nextRank: "シルバー",
    },
    シルバー: {
      bg: "from-slate-400 to-slate-600",
      badge: "bg-slate-100 text-slate-800",
      progress: "w-[65%]",
      nextRank: "ゴールド",
    },
    ゴールド: {
      bg: "from-yellow-500 via-amber-500 to-yellow-600",
      badge: "bg-yellow-100 text-yellow-900 border border-yellow-300",
      progress: "w-[100%]",
      nextRank: "マックス",
    },
  };

  const currentTheme = rankThemes[status.rank];

  return (
    <div className="p-5 bg-slate-50 min-h-screen text-slate-800 pb-24">
      
      {/* 👤 1. ユーザー基本情報ヘッダー */}
      <div className="flex items-center gap-4 mb-6 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div className="w-14 h-14 bg-gradient-to-tr from-indigo-100 to-blue-50 rounded-full flex items-center justify-center text-2xl shadow-inner">
          👤
        </div>
        <div>
          <h2 className="text-base font-bold tracking-tight">ガーディアン代表</h2>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs text-slate-500">所属: ファミリーグループ（2人）</span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
          </div>
        </div>
      </div>

      {/* 🎖️ 2. ヒーローカード（現在の称号と経験値バー） */}
      <div className={`bg-gradient-to-br ${currentTheme.bg} rounded-2xl p-5 text-white shadow-lg shadow-slate-200 mb-4 transition-all duration-500`}>
        <div className="flex justify-between items-start mb-2">
          <p className="text-[11px] font-bold opacity-80 uppercase tracking-wider">防犯ステータス</p>
          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full shadow-sm ${currentTheme.badge}`}>
            RANK UPまであと {(2000 - status.score) > 0 ? 2000 - status.score : 0} pt
          </span>
        </div>
        
        <div className="flex items-baseline gap-1.5 mb-4">
          <span className="text-2xl font-black tracking-tight">{status.rank}・ガーディアン</span>
        </div>
        
        {/* レベル/経験値プログレスバー */}
        <div className="mb-5">
          <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden p-[1px]">
            <div className={`bg-white h-full rounded-full transition-all duration-1000 ${currentTheme.progress}`}></div>
          </div>
          <div className="flex justify-between text-[10px] mt-1.5 opacity-80 font-mono">
            <span>{status.score} pt</span>
            <span>次：{currentTheme.nextRank}</span>
          </div>
        </div>

        {/* 💡 コアインセンティブ：街を救った実感を伝えるエリア */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-3.5 border border-white/10">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-sm">🛡️</span>
            <p className="text-[11px] font-bold opacity-90">直近の安全貢献実績</p>
          </div>
          <p className="text-xs font-medium leading-relaxed opacity-95">
            あなたのアクション（情報の共有や周辺通知）により、街のユーザー <span className="text-yellow-300 font-extrabold text-lg bg-white/10 px-1.5 py-0.5 rounded-md mx-0.5">{status.helpedCount}人</span> の危険回避をサポートした可能性があります！
          </p>
        </div>
      </div>

      {/* 📊 3. 貢献リポートグリッド（行動のスコア化） */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <p className="text-[11px] text-slate-400 font-bold">今週のアクティビティ</p>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-xl font-black text-indigo-600">{status.weeklyReports}</span>
            <span className="text-[10px] font-bold text-slate-400">回確認</span>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <p className="text-[11px] text-slate-400 font-bold">総トラブル投稿数</p>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-xl font-black text-emerald-600">{status.totalPosts}</span>
            <span className="text-[10px] font-bold text-slate-400">レポート</span>
          </div>
        </div>
      </div>

      {/* 🎁 4. 将来用のポイント交換（おまけ特典枠） */}
      <div className="border border-dashed border-slate-200 rounded-xl p-4 flex justify-between items-center bg-white shadow-sm">
        <div className="flex items-center gap-3">
          <div className="text-xl">🎟️</div>
          <div>
            <p className="text-[11px] text-slate-400 font-bold leading-none mb-1">パトロールポイント</p>
            <p className="text-base font-black text-slate-700">{status.score} <span className="text-[10px] text-slate-400 font-medium">pt</span></p>
          </div>
        </div>
        <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-1 rounded-md font-bold tracking-tighter">
          将来特典と交換可能
        </span>
      </div>

    </div>
  );
}