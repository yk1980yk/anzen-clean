"use client";

import { useState } from "react";

interface ProfileViewProps {
  myProfile: any;
  setMyProfile: (profile: any) => void;
  ageGroup: string;
  setAgeGroup: (age: string) => void;
  gender: string;
  setGender: (g: string) => void;
  livingStatus: string;
  setLivingStatus: (status: string) => void;
}

export default function ProfileView({
  myProfile,
  setMyProfile,
  ageGroup,
  setAgeGroup,
  gender,
  setGender,
  livingStatus,
  setLivingStatus,
}: ProfileViewProps) {
  // デモ用のサブスク購入状態管理
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = () => {
    if (isSubscribed) {
      alert("🔄 サブスクリプションの管理画面（App Store / Google Play）へ遷移します（デモ動作）");
    } else {
      setIsSubscribed(true);
      alert("🎉 プレミアムプランへのアップグレードが完了しました！\n【3大防衛システム】および【無制限のグループ作成】が有効化されました。");
    }
  };

  return (
    <div style={{ padding: "24px", color: "#333", height: "100%", overflowY: "auto", paddingBottom: "120px", background: "#f9fafb" }}>
      {/* ヘッダー */}
      <div style={{ textAlign: "center", marginBottom: "24px" }}>
        <div style={{ width: "70px", height: "70px", borderRadius: "50%", background: "#E11D48", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px", margin: "0 auto 12px" }}>👤</div>
        <h2 style={{ margin: "0 0 4px", fontSize: "20px", fontWeight: "bold" }}>{myProfile.name || "ゲストユーザー"}</h2>
        <p style={{ margin: 0, fontSize: "13px", color: "#666" }}>個人識別ID: <code style={{ background: "#eee", padding: "2px 6px", borderRadius: "4px", fontWeight: "bold" }}>{myProfile.myRandomId}</code></p>
      </div>

      {/* 👑 サブスクリプション（プレミアムプラン）導線セクション */}
      <div style={{ background: "white", borderRadius: "20px", padding: "20px", border: isSubscribed ? "2px solid #10B981" : "2px solid #E11D48", boxShadow: "0 4px 12px rgba(0,0,0,0.05)", marginBottom: "24px", position: "relative", overflow: "hidden" }}>
        {isSubscribed && (
          <div style={{ position: "absolute", top: "12px", right: "12px", background: "#10B981", color: "white", fontSize: "11px", fontWeight: "bold", padding: "4px 10px", borderRadius: "20px" }}>
            契約中
          </div>
        )}
        
        <h3 style={{ margin: "0 0 4px", fontSize: "16px", fontWeight: "bold", color: isSubscribed ? "#10B981" : "#E11D48", display: "flex", alignItems: "center", gap: "6px" }}>
          👑 プレミアムプラン {isSubscribed ? "(有効)" : ""}
        </h3>
        <p style={{ margin: "0 0 16px", fontSize: "12px", color: "#666" }}>大切な家族と自分を守るための、業界最高峰のセキュリティ</p>
        
        <div style={{ background: "#f9fafb", borderRadius: "12px", padding: "14px", marginBottom: "16px" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: "4px", marginBottom: "10px" }}>
            <span style={{ fontSize: "22px", fontWeight: "bold", color: "#111827" }}>月額 300円</span>
            <span style={{ fontSize: "12px", color: "#666" }}>(税込 / 初月無料キャンペーン中)</span>
          </div>
          
          <ul style={{ margin: 0, paddingLeft: "4px", listStyle: "none", display: "flex", flexDirection: "column", gap: "8px" }}>
            <li style={{ fontSize: "13px", display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ color: "#10B981", fontWeight: "bold" }}>✓</span> 見守りグループ作成：<strong style={{ color: "#111827" }}>無制限</strong> (無料版は1つ)
            </li>
            <li style={{ fontSize: "13px", display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ color: "#10B981", fontWeight: "bold" }}>✓</span> <strong>技術的防衛</strong>：位置偽装・遠隔デマ投稿ブロック
            </li>
            <li style={{ fontSize: "13px", display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ color: "#10B981", fontWeight: "bold" }}>✓</span> <strong>コミュニティ防衛</strong>：リアルタイム相互評価（通報機能）
            </li>
            <li style={{ fontSize: "13px", display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ color: "#10B981", fontWeight: "bold" }}>✓</span> 鉄道遅延の乗り入れ路線別ディープパルス通知
            </li>
          </ul>
        </div>

        <button 
          onClick={handleSubscribe} 
          style={{ 
            width: "100%", 
            background: isSubscribed ? "#4B5563" : "linear-gradient(135deg, #E11D48 0%, #BE123C 100%)", 
            color: "white", 
            border: "none", 
            padding: "14px", 
            borderRadius: "12px", 
            fontWeight: "bold", 
            fontSize: "14px", 
            cursor: "pointer", 
            boxShadow: isSubscribed ? "none" : "0 4px 12px rgba(225,29,72,0.3)",
            transition: "0.2s"
          }}
        >
          {isSubscribed ? "サブスクリプションを管理する" : "プレミアムプランにアップグレード (初月無料)"}
        </button>
      </div>

      {/* ユーザー属性設定セクション */}
      <div style={{ background: "white", borderRadius: "20px", padding: "20px", boxShadow: "0 4px 12px rgba(0,0,0,0.03)", marginBottom: "24px" }}>
        <h3 style={{ margin: "0 0 16px", fontSize: "15px", fontWeight: "bold", color: "#111827", borderBottom: "1px solid #eee", paddingBottom: "8px" }}>⚙️ 防犯パーソナライズ設定</h3>
        
        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", fontSize: "13px", fontWeight: "bold", color: "#4b5563", marginBottom: "6px" }}>年代</label>
          <select value={ageGroup} onChange={(e) => setAgeGroup(e.target.value)} style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid #ddd", fontSize: "14px", background: "#f9fafb" }}>
            {["10代", "20代", "30代", "40代", "50代", "60代以上"].map(a => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", fontSize: "13px", fontWeight: "bold", color: "#4b5563", marginBottom: "6px" }}>性別</label>
          <select value={gender} onChange={(e) => setGender(e.target.value)} style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid #ddd", fontSize: "14px", background: "#f9fafb" }}>
            {["女性", "男性", "回答しない"].map(g => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>

        <div>
          <label style={{ display: "block", fontSize: "13px", fontWeight: "bold", color: "#4b5563", marginBottom: "6px" }}>居住形態</label>
          <select value={livingStatus} onChange={(e) => setLivingStatus(e.target.value)} style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid #ddd", fontSize: "14px", background: "#f9fafb" }}>
            {["一人暮らし", "同居（家族・パートナー）", "その他"].map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* 防犯グッズ提携セクション */}
      <div style={{ background: "white", borderRadius: "20px", padding: "20px", boxShadow: "0 4px 12px rgba(0,0,0,0.03)" }}>
        <h3 style={{ margin: "0 0 6px", fontSize: "15px", fontWeight: "bold", color: "#111827" }}>🛡️ おすすめ防犯・防災グッズ</h3>
        <p style={{ margin: "0 0 16px", fontSize: "12px", color: "#666" }}>属性（{ageGroup}・{gender}・{livingStatus}）に合わせた最適アイテム</p>
        
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <a href="https://www.amazon.co.jp/s?k=防犯ブザー+高音度" target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px", borderRadius: "12px", border: "1px solid #eee", textDecoration: "none", color: "inherit", background: "#fff", transition: "0.2s" }}>
            <span style={{ fontSize: "24px" }}>🔊</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "13px", fontWeight: "bold", color: "#111827" }}>大音量防犯ブザー (防水・LEDライト付)</div>
              <div style={{ fontSize: "11px", color: "#666" }}>夜道の一人歩きや、いざという時の備えに</div>
            </div>
            <span style={{ color: "#9ca3af", fontSize: "14px" }}>➔</span>
          </a>

          <a href="https://www.amazon.co.jp/s?k=催涙スプレー+防犯" target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px", borderRadius: "12px", border: "1px solid #eee", textDecoration: "none", color: "inherit", background: "#fff", transition: "0.2s" }}>
            <span style={{ fontSize: "24px" }}>🧪</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "13px", fontWeight: "bold", color: "#111827" }}>護身用コンパクトスプレー</div>
              <div style={{ fontSize: "11px", color: "#666" }}>バッグやポケットに常備できる安心のサイズ感</div>
            </div>
            <span style={{ color: "#9ca3af", fontSize: "14px" }}>➔</span>
          </a>
        </div>
      </div>

      {/* 👑 スクロールして一番下にだけ現れる「うっとうしくない極小フッター導線」 */}
      <div style={{ marginTop: "40px", textAlign: "center", borderTop: "1px solid #e5e7eb", paddingTop: "20px" }}>
        <div style={{ display: "flex", justifyContent: "center", gap: "14px", marginBottom: "10px", flexWrap: "wrap" }}>
          <button 
            onClick={() => alert("📜 【利用規約】\n本サービスの利用条件、免責事項、グループ間での位置情報共有に関する同意条項が表示されます。")} 
            style={{ background: "none", border: "none", color: "#9CA3AF", fontSize: "11px", cursor: "pointer", textDecoration: "underline", padding: "2px 4px" }}
          >
            利用規約
          </button>
          <button 
            onClick={() => alert("🔒 【プライバシーポリシー】\n株式会社Arkが取得する位置情報、属性データの暗号化管理、および外部API連携に関する規約が表示されます。")} 
            style={{ background: "none", border: "none", color: "#9CA3AF", fontSize: "11px", cursor: "pointer", textDecoration: "underline", padding: "2px 4px" }}
          >
            プライバシーポリシー
          </button>
          <button 
            onClick={() => alert("⚖️ 【特定商取引法に基づく表記】\n販売業者: 株式会社Ark\n運営責任者: Ark代表\n所在地: 東京都北区\n対価: 月額300円(税込)\n決済方法: クレジットカード・アプリストア決済")} 
            style={{ background: "none", border: "none", color: "#9CA3AF", fontSize: "11px", cursor: "pointer", textDecoration: "underline", padding: "2px 4px" }}
          >
            特商法表記
          </button>
        </div>
        <p style={{ margin: 0, fontSize: "10px", color: "#9CA3AF", letterSpacing: "0.5px" }}>© 2026 Ark Co., Ltd. All rights reserved.</p>
      </div>
    </div>
  );
}