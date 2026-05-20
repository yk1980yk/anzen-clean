"use client";

interface LayerFilterViewProps {
  layerFilter: {
    crime: boolean;
    shelter: boolean;
    train: boolean;
    jam: boolean;
  };
  setLayerFilter: (filter: any) => void;
}

export default function LayerFilterView({ layerFilter, setLayerFilter }: LayerFilterViewProps) {
  // フィルターボタンの定義
  const FILTERS = [
    { id: "crime", label: "防犯・トラブル", icon: "⚠️" },
    { id: "shelter", label: "避難所・交番", icon: "🏠" },
    { id: "train", label: "鉄道運行", icon: "🚃" },
    { id: "jam", label: "渋滞・道路", icon: "🚗" },
  ];

  const toggleFilter = (filterId: string) => {
    setLayerFilter({
      ...layerFilter,
      [filterId]: !(layerFilter as any)[filterId]
    });
  };

  return (
    <div style={{
      position: "absolute",
      top: "20px",
      right: "20px",
      zIndex: 1200,
      display: "flex",
      flexDirection: "column",
      gap: "6px",
      background: "rgba(255,255,255,0.95)",
      padding: "10px",
      borderRadius: "14px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
      border: "1px solid #eee"
    }}>
      <div style={{ fontSize: "10px", fontWeight: "bold", color: "#9CA3AF", marginBottom: "2px", paddingLeft: "4px" }}>
        🗺️ 表示レイヤー
      </div>
      
      {FILTERS.map(filter => {
        const isActive = (layerFilter as any)[filter.id];
        return (
          <button
            key={filter.id}
            onClick={() => toggleFilter(filter.id)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              border: "none",
              padding: "6px 12px",
              borderRadius: "8px",
              fontSize: "12px",
              fontWeight: "bold",
              background: isActive ? "#F3F4F6" : "transparent",
              color: isActive ? "#111827" : "#9CA3AF",
              cursor: "pointer",
              transition: "0.2s"
            }}
          >
            <span>{filter.icon}</span>
            <span>{filter.label}</span>
          </button>
        );
      })}
    </div>
  );
}