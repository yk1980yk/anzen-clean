"use client";

interface LogViewProps {
  disasterSOS: any[];
  gender: string;
  livingStatus: string;
  handleFocusOnMap: (lat: number, lng: number) => void;
}

export default function LogView({ disasterSOS, gender, livingStatus, handleFocusOnMap }: LogViewProps) {
  return (
    <div style={{ padding: "20px", overflowY: "auto", height: "100%", paddingBottom: "100px" }}>
      {/* Amazonアフィリエイト連携 */}
      <div style={{ background: "linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%)", padding: "18px", borderRadius: "18px", marginBottom: "20px", border: "1px solid #FED7AA", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <h4 style={{ margin: "0 0 4px", fontSize: "15px", color: "#C2410C", fontWeight: "bold" }}>📦 周辺リスクに備える防犯対策</h4>
            <p style={{ fontSize: "12px", color: "#7C2D12", margin: "0 0 12px", lineHeight: "1.4" }}>
              現在、あなたと同じ【{gender} / {livingStatus}】の属性を狙ったトラブル報告が増加しています。Amazon評価4.5以上のおすすめ防犯ブザー・護身グッズはこちら。
            </p>
          </div>
          <span style={{ fontSize: "10px", background: "#FF9900", color: "white", padding: "2px 6px", borderRadius: "4px", fontWeight: "bold" }}>Amazon PR</span>
        </div>
        <button 
          style={{ width: "100%", background: "#FF9900", color: "white", border: "none", padding: "10px", borderRadius: "10px", fontWeight: "bold", fontSize: "13px", cursor: "pointer" }}
          onClick={() => window.open("https://www.amazon.co.jp/s?k=防犯ブザー+大音量", "_blank")}
        >
          Amazonで防犯グッズを見る
        </button>
      </div>

      <h2 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "15px" }}>周辺のリスク報告ログ</h2>
      {disasterSOS.map(sos => (
        <div key={sos.id} style={{ background: "white", padding: "15px", borderRadius: "15px", marginBottom: "12px", border: "1px solid #eee" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontWeight: "bold", fontSize: "14px" }}>{sos.profiles?.name || "匿名ユーザー"}</span>
            <span style={{ fontSize: "11px", color: "#999" }}>{sos.created_at ? new Date(sos.created_at).toLocaleTimeString() : "現在"}</span>
          </div>
          <p style={{ margin: "8px 0 12px", fontSize: "14px", lineHeight: "1.5", color: "#444" }}>{sos.content}</p>
          <button 
            onClick={() => handleFocusOnMap(sos.lat, sos.lng)}
            style={{ background: "#F3F4F6", border: "none", padding: "6px 12px", borderRadius: "8px", fontSize: "12px", fontWeight: "bold", color: "#2563EB", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}
          >
            🗺️ マップ上で位置を確認
          </button>
        </div>
      ))}
    </div>
  );
}