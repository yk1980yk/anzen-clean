"use client";

export default function TeamPage() {
  return (
    <div style={{ padding: "40px 20px", maxWidth: "900px", margin: "0 auto", fontFamily: "sans-serif", color: "#333", lineHeight: "1.8" }}>
      <h1 style={{ borderBottom: "2px solid #e11d48", paddingBottom: "10px", fontSize: "24px", fontWeight: "bold" }}>
        Terms of Service / 利用規約
      </h1>

      <p style={{ marginTop: "20px", fontSize: "14px" }}>
        These Terms of Service (hereinafter referred to as "Terms") govern the use of the crime prevention platform application "ANZEN" (hereinafter referred to as "Service") provided by Ark Co., Ltd. (hereinafter referred to as "Company").<br />
        <span style={{ color: "#666" }}>本規約は、株式会社Ark（以下、「当社」といいます。）が提供する防犯プラットフォーム「ANZEN」（以下、「本サービス」といいます。）の利用条件を定めるものです。</span>
      </p>

      <h2 style={{ marginTop: "30px", fontSize: "18px", fontWeight: "bold", borderLeft: "4px solid #e11d48", paddingLeft: "10px" }}>
        Article 1: Agreement / 第1条：規約への同意
      </h2>
      <p style={{ fontSize: "14px", marginTop: "10px" }}>
        By creating an account or logging into the Service, users are deemed to have agreed to all clauses of these Terms.<br />
        <span style={{ color: "#666" }}>ユーザーは、本サービスのアカウントを作成、またはログインした時点で、本規約のすべての条項に同意したものとみなされます。</span>
      </p>

      <h2 style={{ marginTop: "30px", fontSize: "18px", fontWeight: "bold", borderLeft: "4px solid #e11d48", paddingLeft: "10px" }}>
        Article 2: Prohibited Actions / 第2条：禁止事項
      </h2>
      <p style={{ fontSize: "14px", marginTop: "10px" }}>
        Users must not engage in any of the following activities:<br />
        <span style={{ color: "#666" }}>ユーザーは、本サービスの利用にあたり以下の行為を行ってはなりません：</span>
      </p>
      <ul style={{ paddingLeft: "20px", fontSize: "14px" }}>
        <li style={{ marginBottom: "8px" }}>
          Intentionally broadcasting false crime data, fake incident reports, or misleading information on the map.<br />
          <span style={{ color: "#666" }}>虚偽の防犯情報、不審者情報、デマ情報を意図的にマップ上へ投稿・配信する行為。</span>
        </li>
        <li style={{ marginBottom: "8px" }}>
          Using location-tracking features maliciously for stalking or unauthorized surveillance.<br />
          <span style={{ color: "#666" }}>他人の位置情報を不当に監視・追跡する行為、またはストーカー行為への悪用。</span>
        </li>
      </ul>

      <h2 style={{ marginTop: "30px", fontSize: "18px", fontWeight: "bold", borderLeft: "4px solid #e11d48", paddingLeft: "10px" }}>
        Article 3: Disclaimer / 第3条：免責事項
      </h2>
      <p style={{ fontSize: "14px", marginTop: "10px" }}>
        The Company does not guarantee the absolute accuracy, completeness, or real-time precision of location-tracking features, as they depend on satellite signal quality and network conditions. The Company shall not be liable for any direct or indirect safety hazards or losses arising from the use of this Application.<br />
        <span style={{ color: "#666" }}>本サービスは端末のGPS精度や通信環境に大きく依存するため、位置情報の完全なリアルタイム性や正確性を保証するものではありません。本アプリの利用、または利用できなかったことにより発生した被害やトラブルについて、当社は一切の責任を負いません。</span>
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