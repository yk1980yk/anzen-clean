"use client";

export default function PrivacyPage() {
  return (
    <div style={{ padding: "40px 20px", maxWidth: "900px", margin: "0 auto", fontFamily: "sans-serif", color: "#333", lineHeight: "1.8" }}>
      <h1 style={{ borderBottom: "2px solid #e11d48", paddingBottom: "10px", fontSize: "24px", fontWeight: "bold" }}>
        Privacy Policy / プライバシーポリシー
      </h1>
      
      <p style={{ marginTop: "20px", fontSize: "14px" }}>
        Ark Co., Ltd. (hereinafter referred to as "the Company") handles users' personal information and personal data within the smartphone application "ANZEN" (hereinafter referred to as "the Application") and related web services (hereinafter collectively referred to as "the Service") as described in this Privacy Policy.<br />
        <span style={{ color: "#666" }}>株式会社Ark（以下、「当社」といいます。）は、スマートフォン向けアプリケーション「ANZEN」（以下、「本アプリ」といいます。）および関連Webサービス（以下、総称して「本サービス」といいます。）におけるユーザーの個人情報およびパーソナルデータの取り扱いについて、以下の通りプライバシーポリシーを定めます。</span>
      </p>

      <h2 style={{ marginTop: "30px", fontSize: "18px", fontWeight: "bold", borderLeft: "4px solid #e11d48", paddingLeft: "10px" }}>
        Article 1: Collected Information / 第1条：取得情報
      </h2>
      <div style={{ fontSize: "14px", marginTop: "10px" }}>
        <p><strong>1. Account Information / アカウント情報</strong></p>
        <p style={{ paddingLeft: "15px" }}>
          Email address, username, profile icon, and password required for registration and authentication.<br />
          <span style={{ color: "#666" }}>メールアドレス、ユーザー名、プロフィール画像、認証用パスワード等、会員登録に必要な情報。</span>
        </p>

        <p style={{ marginTop: "15px" }}><strong>2. Location Data (Critical) / 位置情報（重要）</strong></p>
        <p style={{ paddingLeft: "15px" }}>
          Since this is a next-generation crime prevention platform, the Application continuously collects and stores high-precision location data (GPS, Wi-Fi location, latitude, and longitude) from the user's device even in the background to enable monitoring group functions, emergency alerts, and displaying danger zones on the map.<br />
          <span style={{ color: "#666" }}>本アプリは次世代型防犯プラットフォームであるため、見守りグループ機能、緊急通報機能、およびマップ上への危険エリア表示、防犯アラート配信の目的で、バックグラウンド状態を含め、ユーザーの端末から送信される高精度な位置情報（GPS情報、Wi-Fi位置情報、緯度・経度）を取得・保持します。</span>
        </p>

        <p style={{ marginTop: "15px" }}><strong>3. Usage Logs & Device Info / 利用ログおよび端末情報</strong></p>
        <p style={{ paddingLeft: "15px" }}>
          Device identifiers, OS version, operation logs, access timestamps, and logs regarding emergency buzzer activation.<br />
          <span style={{ color: "#666" }}>端末識別子、OSバージョン、アプリ操作履歴、アクセス日時、および防犯ブザー等の利用ログ。</span>
        </p>
      </div>

      <h2 style={{ marginTop: "30px", fontSize: "18px", fontWeight: "bold", borderLeft: "4px solid #e11d48", paddingLeft: "10px" }}>
        Article 2: Purpose of Use / 第2条：利用目的
      </h2>
      <p style={{ fontSize: "14px", marginTop: "10px" }}>
        The Company uses the collected information for the following purposes:<br />
        <span style={{ color: "#666" }}>当社は、取得した情報を以下の目的のために利用します：</span>
      </p>
      <ul style={{ paddingLeft: "20px", fontSize: "14px" }}>
        <li style={{ marginBottom: "8px" }}>
          To provide and operate the core functions of the Service (real-time crime prevention map, monitoring circles, emergency reporting).<br />
          <span style={{ color: "#666" }}>本サービス（リアルタイム防犯マップ、見守りサークル、緊急報告共有等）の適切な提供および運用。</span>
        </li>
        <li style={{ marginBottom: "8px" }}>
          To securely process payments for the Premium Plan and manage automated subscriptions through Stripe, Inc.<br />
          <span style={{ color: "#666" }}>プレミアムプランの決済処理、購読確認、およびStripe, Inc.を通じたサブスクリプション管理の自動化。</span>
        </li>
        <li style={{ marginBottom: "8px" }}>
          To detect and prevent unauthorized access, fraudulent activities, or violations of the terms.<br />
          <span style={{ color: "#666" }}>本人確認、利用規約違反行為、または不正アクセス等のセキュリティ侵害行為の検知および防止。</span>
        </li>
      </ul>

      <h2 style={{ marginTop: "30px", fontSize: "18px", fontWeight: "bold", borderLeft: "4px solid #e11d48", paddingLeft: "10px" }}>
        Article 3: Data Security & Deletion / 第3条：安全管理とデータ削除
      </h2>
      <p style={{ fontSize: "14px", marginTop: "10px" }}>
        The Company implements advanced encryption (SSL/TLS) and access controls through Firebase/Supabase environments. When a user requests account deletion (termination), all personal information and historical location logs will be instantly and permanently purged from the server.<br />
        <span style={{ color: "#666" }}>当社は、SSL/TLS暗号化通信の徹底、Supabase/Firebase環境における高度なアクセスコントロール等、適切な安全管理措置を講じます。ユーザーがアカウントの削除（退会）を希望された場合は、即座にサーバーから個人情報および過去の位置情報ログが完全に消去される安全な設計を導入しています。</span>
      </p>

      <p style={{ marginTop: "40px", textAlign: "right", color: "#666", fontSize: "13px" }}>
        Ark Co., Ltd. / 株式会社Ark<br />
        Representative & Operation Manager: Yuki Kuwahara / 桒原優樹<br />
        Effective Date: May 19, 2026 / 改定・施行日：2026年5月19日
      </p>

      <div style={{ marginTop: "50px", borderTop: "1px solid #eee", paddingTop: "30px", textAlign: "center" }}>
        <button
          onClick={() => window.location.href = "/login/"}
          style={{ padding: "12px 36px", backgroundColor: "#e11d48", color: "#fff", border: "none", borderRadius: "12px", fontWeight: "bold", fontSize: "14px", cursor: "pointer", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
        >
          Return to Login / ログイン画面へ戻る
        </button>
      </div>
    </div>
  );
}