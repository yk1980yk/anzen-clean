"use client";

export default function LegalPage() {
  return (
    <div style={{ padding: "40px 20px", maxWidth: "900px", margin: "0 auto", fontFamily: "sans-serif", color: "#333", lineHeight: "1.8" }}>
      <h1 style={{ borderBottom: "2px solid #e11d48", paddingBottom: "10px", fontSize: "24px", fontWeight: "bold" }}>
        Specified Commercial Transactions Act / 特定商取引法に基づく表記
      </h1>
      
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px", fontSize: "13px" }}>
        <tbody>
          <tr>
            <th style={{ width: "35%", textAlign: "left", padding: "12px", borderBottom: "1px solid #eee", background: "#f9f9f9", fontWeight: "bold" }}>
              Seller / Company Name<br /><span style={{ color: "#666", fontWeight: "normal" }}>販売事業者・会社名</span>
            </th>
            <td style={{ padding: "12px", borderBottom: "1px solid #eee" }}>
              Ark Co., Ltd. / 株式会社Ark
            </td>
          </tr>
          <tr>
            <th style={{ textAlign: "left", padding: "12px", borderBottom: "1px solid #eee", background: "#f9f9f9", fontWeight: "bold" }}>
              Operation Manager<br /><span style={{ color: "#666", fontWeight: "normal" }}>運営責任者</span>
            </th>
            <td style={{ padding: "12px", borderBottom: "1px solid #eee" }}>
              Yuki Kuwahara / 桒原優樹
            </td>
          </tr>
          <tr>
            <th style={{ textAlign: "left", padding: "12px", borderBottom: "1px solid #eee", background: "#f9f9f9", fontWeight: "bold" }}>
              Address<br /><span style={{ color: "#666", fontWeight: "normal" }}>所在地</span>
            </th>
            <td style={{ padding: "12px", borderBottom: "1px solid #eee" }}>
              CD Building 6F, 1-64-11 Akabane, Kita-ku, Tokyo, 115-0045, Japan<br />
              〒115-0045 東京都北区赤羽1－64－11 CDビルディング 6階
            </td>
          </tr>
          <tr>
            <th style={{ textAlign: "left", padding: "12px", borderBottom: "1px solid #eee", background: "#f9f9f9", fontWeight: "bold" }}>
              Contact Email<br /><span style={{ color: "#666", fontWeight: "normal" }}>メールアドレス</span>
            </th>
            <td style={{ padding: "12px", borderBottom: "1px solid #eee" }}>
              info@ark-corp.tokyo
            </td>
          </tr>
          <tr>
            <th style={{ textAlign: "left", padding: "12px", borderBottom: "1px solid #eee", background: "#f9f9f9", fontWeight: "bold" }}>
              Price / 販売価格
            </th>
            <td style={{ padding: "12px", borderBottom: "1px solid #eee" }}>
              Displayed on the purchase screen (Premium Plan: 300 JPY/month, tax included).<br />
              各プラン購入画面に表示（プレミアムプラン：月額300円・消費税込み）。
            </td>
          </tr>
          <tr>
            <th style={{ textAlign: "left", padding: "12px", borderBottom: "1px solid #eee", background: "#f9f9f9", fontWeight: "bold" }}>
              Payment Methods<br /><span style={{ color: "#666", fontWeight: "normal" }}>お支払い方法</span>
            </th>
            <td style={{ padding: "12px", borderBottom: "1px solid #eee" }}>
              Credit Cards processed securely via Stripe (VISA, MasterCard, AMEX, JCB, etc.)<br />
              Stripe決済を介したクレジットカード決済
            </td>
          </tr>
          <tr>
            <th style={{ textAlign: "left", padding: "12px", borderBottom: "1px solid #eee", background: "#f9f9f9", fontWeight: "bold" }}>
              Cancellations & Refunds<br /><span style={{ color: "#666", fontWeight: "normal" }}>返品・キャンセル</span>
            </th>
            <td style={{ padding: "12px", borderBottom: "1px solid #eee" }}>
              Due to the nature of digital content, refunds or cancellations after purchase are not accepted. Users can cancel future renewals at any time from the settings.<br />
              デジタルコンテンツの特性上、決済完了後の返金・キャンセルには応じられません。次回以降の自動更新はいつでも設定から解約可能です。
            </td>
          </tr>
        </tbody>
      </table>

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