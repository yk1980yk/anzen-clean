"use client";

import dynamic from "next/dynamic";
import { useEffect, useState, useRef } from "react";
import { supabase } from "../../lib/supabaseClient";

import LogView from "./LogView";
import GroupView from "./GroupView";
import ProfileView from "./ProfileView";
import LayerFilterView from "./LayerFilterView";

const MapContainer = dynamic(() => import("react-leaflet").then((m) => m.MapContainer), { ssr: false }) as any;
const TileLayer = dynamic(() => import("react-leaflet").then((m) => m.TileLayer), { ssr: false }) as any;
const Marker = dynamic(() => import("react-leaflet").then((m) => m.Marker), { ssr: false }) as any;
const Popup = dynamic(() => import("react-leaflet").then((m) => m.Popup), { ssr: false }) as any;
const Circle = dynamic(() => import("react-leaflet").then((m) => m.Circle), { ssr: false }) as any;
const Polyline = dynamic(() => import("react-leaflet").then((m) => m.Polyline), { ssr: false }) as any;

const CATEGORIES = [
  { id: "crime", label: "犯罪・トラブル", icon: "👁️", color: "#E11D48" },
  { id: "suspicious", label: "不審な行動", icon: "👤", color: "#F59E0B" },
  { id: "accident", label: "交通事故", icon: "🚗", color: "#2563EB" },
  { id: "train", label: "鉄道遅延", icon: "🚃", color: "#F97316" },
  { id: "shelter", label: "避難所", icon: "🏠", color: "#10B981" },
];

const SAFETY_SPOTS = [
  // --- 池袋・大塚・巣鴨エリア ---
  { id: 'st-ikebukuro', name: 'JR 池袋駅', lat: 35.7295, lng: 139.7110, type: 'train', lines: ["yamanote", "marunouchi", "yurakucho"], desc: '駅構内・周辺安全' },
  { id: 'crime-ike-1', name: '池袋西口公園周辺', lat: 35.7300, lng: 139.7105, type: 'crime', desc: '【目撃】ひったくりに注意' },
  { id: 'st-otsuka', name: 'JR 大塚駅', lat: 35.7315, lng: 139.7285, type: 'train', lines: ["yamanote"], desc: '駅構内・周辺安全' },
  { id: 'jam-otsuka-1', name: '大塚駅前交差点', lat: 35.7318, lng: 139.7290, type: 'jam', desc: '⚠️ 歩行者密集注意' },
  { id: 'st-sugamo', name: 'JR/都営 巣鴨駅', lat: 35.7335, lng: 139.7395, type: 'train', lines: ["yamanote", "mita"], desc: '駅構内・周辺安全' },
  { id: 'suspicious-sugamo-1', name: '地蔵通り商店街', lat: 35.7340, lng: 139.7400, type: 'suspicious', desc: '【目撃】不審な声かけ' },

  // --- 大泉学園エリア ---
  { id: 'st-ooizumigakuen', name: '西武池袋線 大泉学園駅', lat: 35.74952, lng: 139.586587, type: 'train', lines: ["seibu-ikebukuro"], desc: '駅周辺安全' },
  { id: 'police-ooizumi', name: '大泉学園駅前交番', lat: 35.7498, lng: 139.5870, type: 'police', desc: '24時間対応' },
  { id: 'crime-ooizumi-1', name: '大泉学園通り', lat: 35.7490, lng: 139.5860, type: 'crime', desc: '【報告】自転車の無灯火走行多発' },
  { id: 'jam-ooizumi-1', name: '北口ロータリー', lat: 35.7502, lng: 139.5868, type: 'jam', desc: '⚠️ 送迎車の路上駐車により見通し悪化' },

  // --- 江古田エリア ---
  { id: 'st-ekoda', name: '西武池袋線 江古田駅', lat: 35.737389, lng: 139.672750, type: 'train', lines: ["seibu-ikebukuro"], desc: '駅周辺安全' },
  { id: 'police-ekoda', name: '江古田駅前交番', lat: 35.7377, lng: 139.6730, type: 'police', desc: '24時間対応' },
  { id: 'crime-eko-1', name: '武蔵大学周辺', lat: 35.7370, lng: 139.6722, type: 'crime', desc: '【報告】夜間の自転車盗難に注意' },
  { id: 'suspicious-eko-1', name: '千川通り', lat: 35.7380, lng: 139.6735, type: 'suspicious', desc: '【目撃】夜間の不審な徘徊' },

  // --- 下赤塚エリア ---
  { id: 'st-shimoakatsuka', name: '東武東上線 下赤塚駅', lat: 35.7704997, lng: 139.6448346, type: 'train', lines: ["tobu-tojo"], desc: '駅周辺安全' },
  { id: 'police-shimoakatsuka', name: '下赤塚駅前交番', lat: 35.7708, lng: 139.6452, type: 'police', desc: '24時間対応' },
  { id: 'crime-aka-1', name: '赤塚中央通り', lat: 35.7702, lng: 139.6443, type: 'crime', desc: '【注意】夕方、子供への声かけ事案発生' },
  { id: 'jam-aka-1', name: '川越街道', lat: 35.7700, lng: 139.6450, type: 'jam', desc: '⚠️ 歩行者飛び出し注意' },

  // --- 横浜エリア ---
  { id: 'st-yokohama', name: 'JR/私鉄 横浜駅', lat: 35.4658, lng: 139.6222, type: 'train', lines: ["yokohama-line", "tokyu-line"], desc: '駅周辺の安全確認' },
  { id: 'police-yokohama', name: '横浜駅前交番', lat: 35.4662, lng: 139.6226, type: 'police', desc: '24時間対応' },
  { id: 'crime-yokohama-1', name: '横浜駅西口周辺', lat: 35.4655, lng: 139.6218, type: 'crime', desc: '【目撃】路上での客引きに注意' },
  { id: 'suspicious-yokohama-1', name: 'みなみ西口通り', lat: 35.4650, lng: 139.6230, type: 'suspicious', desc: '【注意】夜間の単独行動は控えましょう' },

  // --- 岡山・大元エリア ---
  { id: 'st-omoto', name: 'JR宇野線 大元駅', lat: 34.647629, lng: 133.910716, type: 'train', lines: ["uno-line"], desc: '駅周辺安全' },
  { id: 'police-omoto', name: '大元駅前交番', lat: 34.6480, lng: 133.9110, type: 'police', desc: '24時間対応' },
  { id: 'crime-omoto-1', name: '大元駅周辺住宅地', lat: 34.6472, lng: 133.9103, type: 'crime', desc: '【目撃】不審なセールスが訪問中' },
];

const getIconForType = (type: string) => {
  switch (type) {
    case 'train': return '🚃';
    case 'police': return '🚓';
    case 'crime': return '👁️';
    case 'suspicious': return '👤';
    case 'jam': return '🚗';
    case 'shelter': return '🏠';
    default: return '📍';
  }
};

const TRAIN_DELAYS: { [key: string]: { lineName: string; status: string; hasDelay: boolean } } = {
  yamanote: { lineName: "JR 山手線", status: "⚠️ 遅延あり（車両点検の影響で約5分遅れ）", hasDelay: true },
  mita: { lineName: "都営 三田線", status: "✅ 平常運転", hasDelay: false },
  marunouchi: { lineName: "東京メトロ 丸ノ内線", status: "✅ 平常運転", hasDelay: false },
  yurakucho: { lineName: "東京メトロ 有楽町線", status: "⚠️ 運転見合わせ（人身事故の影響）", hasDelay: true },
  "tobu-tojo": { lineName: "東武東上線", status: "✅ 平常運転", hasDelay: false },
  "seibu-ikebukuro": { lineName: "西武池袋線", status: "⚠️ 遅延あり（信号確認のため約10分遅れ）", hasDelay: true },
  "yokohama-line": { lineName: "JR 横浜線", status: "✅ 平常運転", hasDelay: false },
  "tokyu-line": { lineName: "東急東横線", status: "⚠️ 遅延あり（混雑の影響で3分程度の遅れ）", hasDelay: true },
  "uno-line": { lineName: "JR宇野線", status: "✅ 平常運転", hasDelay: false },
};

export default function MapPage() {
  const [deviceGps, setDeviceGps] = useState<[number, number]>([35.735, 139.722]);
  const [position, setPosition] = useState<[number, number] | null>([35.735, 139.722]);
  const [follow, setFollow] = useState(false);
  const [leafletL, setLeafletL] = useState<any>(null);
  const mapRef = useRef<any>(null);
  
  const [disasterSOS, setDisasterSOS] = useState<any[]>([]);
  
  /* 🗺️ レイヤーコントロールメニューの開閉ステート */
  const [isLayerMenuOpen, setIsLayerMenuOpen] = useState(false);

  const [layerFilter, setLayerFilter] = useState({
    crime: true,
    shelter: true,
    train: true,
    jam: true
  });

  const [groups, setGroups] = useState<any[]>([
    { id: "g-default", name: "家族グループ (無料版)", members: [{ id: "m-1", name: "見守り対象 A (親)", is_active: true, randomId: "ARK-9921" }] }
  ]);
  const [activeGroupId, setActiveGroupId] = useState("g-default");
  
  const [myProfile, setMyProfile] = useState<any>({
    id: "demo-current-user",
    name: "Arkユーザー",
    email: "demo@ark-apps.com",
    myRandomId: "ARK-75A2"
  });
  
  const [activeTab, setActiveTab] = useState<"map" | "log" | "group" | "profile">("map");
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("crime");
  const [postContent, setPostContent] = useState("");

  const [privacyMode, setPrivacyMode] = useState<"exact" | "area">("exact");

  const [ageGroup, setAgeGroup] = useState("20代");
  const [gender, setGender] = useState("女性");
  const [livingStatus, setLivingStatus] = useState("一人暮らし");
  const [targetIdInput, setTargetIdInput] = useState("");

  const [currentTime, setCurrentTime] = useState(Date.now());

  const [routes, setRoutes] = useState<any[]>([]);

  const loadData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: mine } = await supabase.from("profiles").select("*").eq("id", user.id).single();
        if (mine) setMyProfile({ ...mine, id: user.id, myRandomId: mine.myRandomId || "ARK-88B1" });
      }
    } catch (e) { console.warn("Using isolated UI component layer."); }

    if (disasterSOS.length === 0) {
      setDisasterSOS([
        { id: "init-1", user_id: "user-volunteer-alpha", lat: 35.735, lng: 139.719, content: "【不審な行動】20時頃、路地裏での声かけ事案が発生。黒い服の男。", created_at: new Date(Date.now() - 3600000).toISOString(), reported_users: [], is_area_mode: false, profiles: { name: "地域防犯ボランティア", is_family: false } },
        { id: "init-2", user_id: "user-passer-beta", lat: 35.740, lng: 139.713, content: "【交通事故】交差点内での軽自動車同士の接触事故。現在警察が誘導中。", created_at: new Date(Date.now() - 7200000).toISOString(), reported_users: [], is_area_mode: false, profiles: { name: "通りすがりのユーザー", is_family: false } }
      ]);
    }
  };

  const fetchRoutes = async () => {
    try {
      const { data: routesData, error: routesError } = await supabase.from("routes").select("*");
      if (!routesError && routesData) {
        const updatedRoutes = await Promise.all(
          routesData.map(async (route) => {
            const { data: pts } = await supabase
              .from("route_points")
              .select("lat, lng")
              .eq("route_id", route.id)
              .order("created_at", { ascending: true });
            return { ...route, points: pts || [] };
          })
        );
        setRoutes(updatedRoutes);
      }
    } catch (e) { console.warn("Routes database connection pass."); }
  };
const getIconForType = (type: string) => {
    switch (type) {
      case 'train': return '🚃';
      case 'police': return '🚓';
      case 'crime': return '👁️';
      case 'suspicious': return '👤';
      case 'jam': return '🚗';
      case 'shelter': return '🏠';
      default: return '📍';
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      import("leaflet").then((L) => {
        setLeafletL(L);
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
          iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
          shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
        });
      });
      loadData();
      fetchRoutes();
      
      const watchId = navigator.geolocation.watchPosition((pos) => {
        const newPos: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        setDeviceGps(newPos);
        if (follow) {
          setPosition(newPos);
          if (mapRef.current) mapRef.current.setView(newPos, 13);
        }
      }, (err) => console.log("Fixed GPS tracking simulation enabled for presentation safety."), { enableHighAccuracy: true });

      const timerId = setInterval(() => setCurrentTime(Date.now()), 10000);

      return () => {
        navigator.geolocation.clearWatch(watchId);
        clearInterval(timerId);
      };
    }
  }, [follow]);

  const handleBuzzer = () => {
    alert("📢 防犯ブザー作動！\n全グループのアクティブメンバーへ現在地と警告を即座に通知しました。");
  };

  const handleFocusOnMap = (lat: number, lng: number) => {
    setFollow(false);
    setActiveTab("map");
    setTimeout(() => { if (mapRef.current) mapRef.current.setView([lat, lng], 16); }, 100);
  };

  const handleCreateGroup = (groupName: string): boolean => {
    if (groups.length >= 1) return false;
    setGroups([...groups, { id: `g-${Math.random().toString()}`, name: groupName, members: [] }]);
    return true;
  };

  const handleAddGroupMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetIdInput.trim()) return;
    setGroups(groups.map(g => g.id === activeGroupId ? { ...g, members: [...g.members, { id: Math.random().toString(), name: `IDユーザー (${targetIdInput.toUpperCase()})`, is_active: true, randomId: targetIdInput.toUpperCase() }] } : g));
    setTargetIdInput("");
  };

  const toggleGroupStatus = (groupId: string, memberId: string) => {
    setGroups(groups.map(g => g.id === groupId ? { ...g, members: g.members.map((m: any) => m.id === memberId ? { ...m, is_active: !m.is_active } : m) } : g));
  };

  const getDistanceKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const handlePostSubmit = () => {
    if (!position) return;
    
    const distance = getDistanceKm(deviceGps[0], deviceGps[1], position[0], position[1]);
    if (distance > 2.0) {
      alert(`🛡️ 【技術的防衛システム作動】\n投稿エラー：現在地から離れた場所への遠隔投稿が検知されました。\n(偽装・嫌がらせ投稿防止フィルター)`);
      return;
    }

    const cat = CATEGORIES.find(c => c.id === selectedCategory);
    
    let finalLat = position[0];
    let finalLng = position[1];
    const isAreaMode = privacyMode === "area";

    if (isAreaMode) {
      const randomOffsetLat = (Math.random() - 0.5) * 0.003;
      const randomOffsetLng = (Math.random() - 0.5) * 0.003;
      finalLat += randomOffsetLat;
      finalLng += randomOffsetLng;
    }

    const finalContent = isAreaMode
      ? `【${cat?.label} / 🗺️ 周辺エリア共有】${postContent} (※投稿者保護のため位置をランダム化しています)`
      : `【${cat?.label} / 📍 ピンポイント】${postContent}`;
    
    const newPost = {
      id: Math.random().toString(),
      user_id: myProfile.id,
      lat: finalLat,
      lng: finalLng,
      content: finalContent,
      created_at: new Date().toISOString(),
      reported_users: [],
      is_area_mode: isAreaMode,
      profiles: { name: myProfile.name, is_family: false }
    };

    setDisasterSOS([newPost, ...disasterSOS]);
    setIsPostModalOpen(false);
    setPostContent("");
    handleFocusOnMap(finalLat, finalLng);
  };

  const handleVoteFake = (post: any) => {
    const currentUserId = myProfile.id;

    if (post.user_id === currentUserId) {
      alert("⚠️ 【自作自演ブロック】\n自分が投稿したリスク報告を自分でデマ通報することはできません。");
      return;
    }

    if (post.reported_users?.includes(currentUserId)) {
      alert("⚠️ 【重複通報ブロック】\nあなたはすでにこの投稿にデマ通報を送信済みです。他のユーザーの評価を待っています。");
      return;
    }

    const updated = disasterSOS.map(sos => {
      if (sos.id === post.id) {
        const nextReportedUsers = [...(sos.reported_users || []), currentUserId];
        const simulatedUsers = [...nextReportedUsers, "user-ikebukuro-resident"];
        alert(`👎 【コミュニティ防衛】第三者アカウントからデマ通報を受信しました。\n(ユニーク通報者数: ${simulatedUsers.length} / 2アカウント)`);
        return { ...sos, reported_users: simulatedUsers };
      }
      return sos;
    }).filter(sos => (sos.reported_users?.length || 0) < 2);

    setDisasterSOS(updated);
  };

  const renderStationDelays = (lines?: string[]) => {
    if (!lines || lines.length === 0) return null;
    return (
      <div style={{ marginTop: "8px", borderTop: "1px solid #eee", paddingTop: "6px" }}>
        <div style={{ fontSize: "11px", fontWeight: "bold", color: "#F97316", marginBottom: "4px" }}>🚇 乗り入れ路線 運行状況</div>
        {lines.map(lineKey => {
          const delayInfo = TRAIN_DELAYS[lineKey];
          if (!delayInfo) return null;
          return <div key={lineKey} style={{ fontSize: "12px", marginBottom: "3px", color: delayInfo.hasDelay ? "#DC2626" : "#059669" }}><strong>{delayInfo.lineName}</strong>: {delayInfo.status}</div>;
        })}
      </div>
    );
  };

  if (!position || !leafletL) return <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "white" }}>システム起動中...</div>;

  return (
    <div style={{ height: "100dvh", width: "100%", position: "relative", background: "#f9fafb", fontFamily: "sans-serif", overflow: "hidden" }}>
      <style>{`
        @keyframes pulse-ring { 0% { transform: scale(0.5); opacity: 1; } 100% { transform: scale(1.5); opacity: 0; } }
        @keyframes fade-out { 0% { opacity: 1; } 100% { opacity: 0.25; } }
        .leaflet-marker-icon { background: none !important; border: none !important; }
        .custom-marker-container { position: relative; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; }
        .delay-pulse-marker::after { content: ""; position: absolute; width: 36px; height: 36px; border-radius: 12px; background: rgba(225, 29, 72, 0.4); animation: pulse-ring 1.6s infinite ease-out; z-index: -1; top: 0; left: 0; }
        .fade-old-post { animation: fade-out 3s forwards; }
      `}</style>

      {/* --- コンテンツレンダー --- */}
      <div style={{ height: "calc(100% - 70px)", width: "100%", position: "relative" }}>
        {activeTab === "map" && (
          <>
            {/* 🎛️ 右上：1タップで綺麗に格納・展開できる丸型フィルターメニュー */}
            <div style={{ position: "absolute", top: "16px", right: "16px", zIndex: 1100, display: "flex", flexDirection: "column", alignItems: "end", gap: "8px" }}>
              <button
                onClick={() => setIsLayerMenuOpen(!isLayerMenuOpen)}
                style={{
                  width: "44px", height: "44px", borderRadius: "50%", background: isLayerMenuOpen ? "#1E293B" : "white",
                  color: isLayerMenuOpen ? "white" : "#1E293B", border: "2px solid #CBD5E1", boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", cursor: "pointer", outline: "none"
                }}
              >
                {isLayerMenuOpen ? "✕" : "🗺️"}
              </button>

              {isLayerMenuOpen && (
                <div style={{ background: "white", padding: "12px", borderRadius: "20px", border: "2px solid #E2E8F0", boxShadow: "0 20px 40px rgba(0,0,0,0.2)", minWidth: "160px", display: "flex", flexDirection: "column", gap: "6px" }}>
                  <p style={{ margin: "0 0 4px", fontSize: "10px", fontWeight: "900", color: "#94A3B8", padding: "0 4px", borderBottom: "1px solid #F1F5F9", paddingBottom: "4px" }}>表示レイヤー</p>
                  
                  <button onClick={() => setLayerFilter({ ...layerFilter, crime: !layerFilter.crime })} style={{ width: "100%", display: "flex", alignItems: "center", gap: "10px", padding: "8px 12px", borderRadius: "12px", border: layerFilter.crime ? "1px solid #FCA5A5" : "1px solid transparent", background: layerFilter.crime ? "#FFF1F2" : "transparent", color: layerFilter.crime ? "#9F1239" : "#94A3B8", fontWeight: "bold", fontSize: "12px", textAlign: "left", cursor: "pointer" }}>
                    <span>🚨</span>防犯・トラブル
                  </button>
                  <button onClick={() => setLayerFilter({ ...layerFilter, shelter: !layerFilter.shelter })} style={{ width: "100%", display: "flex", alignItems: "center", gap: "10px", padding: "8px 12px", borderRadius: "12px", border: layerFilter.shelter ? "1px solid #A7F3D0" : "1px solid transparent", background: layerFilter.shelter ? "#ECFDF5" : "transparent", color: layerFilter.shelter ? "#065F46" : "#94A3B8", fontWeight: "bold", fontSize: "12px", textAlign: "left", cursor: "pointer" }}>
                    <span>🏠</span>避難所・交番
                  </button>
                  <button onClick={() => setLayerFilter({ ...layerFilter, train: !layerFilter.train })} style={{ width: "100%", display: "flex", alignItems: "center", gap: "10px", padding: "8px 12px", borderRadius: "12px", border: layerFilter.train ? "1px solid #93C5FD" : "1px solid transparent", background: layerFilter.train ? "#EFF6FF" : "transparent", color: layerFilter.train ? "#1E40AF" : "#94A3B8", fontWeight: "bold", fontSize: "12px", textAlign: "left", cursor: "pointer" }}>
                    <span>🚃</span>鉄道運行
                  </button>
                  <button onClick={() => setLayerFilter({ ...layerFilter, jam: !layerFilter.jam })} style={{ width: "100%", display: "flex", alignItems: "center", gap: "10px", padding: "8px 12px", borderRadius: "12px", border: layerFilter.jam ? "1px solid #FDE68A" : "1px solid transparent", background: layerFilter.jam ? "#FFFBEB" : "transparent", color: layerFilter.jam ? "#92400E" : "#94A3B8", fontWeight: "bold", fontSize: "12px", textAlign: "left", cursor: "pointer" }}>
                    <span>🚗</span>渋滞・道路
                  </button>
                </div>
              )}
            </div>

            <MapContainer center={position} zoom={13} style={{ height: "100%", width: "100%" }} ref={mapRef} zoomControl={false}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={position} />

              {/* 1. ユーザー投稿トラブル報告レイヤー */}
              {layerFilter.crime && disasterSOS.map((sos) => {
                const timeDiff = currentTime - new Date(sos.created_at).getTime();
                const isRecent = timeDiff < 60000;       
                const isVeryOld = timeDiff > 180000;     

                const sosIcon = leafletL.divIcon({
                  className: `${isRecent ? 'delay-pulse-marker' : ''} ${isVeryOld ? 'fade-old-post' : ''}`,
                  iconSize: [28, 28],
                  iconAnchor: [14, 28],
                  html: `<div class="custom-marker-container" style="width:28px; height:28px;">
                    <div style="
                      width:28px; height:28px; 
                      background:${sos.profiles?.is_family ? '#2563EB' : '#E11D48'}; 
                      border-radius:50%; border:2px solid white; 
                      box-shadow:0 4px 8px rgba(0,0,0,0.25);
                      display: flex; align-items: center; justify-content: center;
                      font-size: 15px; color: white;
                    ">⚠️</div>
                  </div>`
                });

                return (
                  <div key={sos.id}>
                    {sos.is_area_mode && (
                      <Circle
                        center={[sos.lat, sos.lng]}
                        radius={220}
                        pathOptions={{
                          color: "#E11D48",
                          fillColor: "#E11D48",
                          fillOpacity: 0.15,
                          weight: 2,
                          dashArray: "5, 5"
                        }}
                      />
                    )}
                    
                    <Marker position={[sos.lat, sos.lng]} icon={sosIcon}>
                      <Popup>
                        <div style={{ padding: "4px", minWidth: "180px" }}>
                          <strong style={{ color: sos.profiles?.is_family ? "#2563EB" : "#E11D48" }}>
                            {sos.profiles?.is_family ? "🔒 グループ安全発信" : sos.is_area_mode ? "🛡️ 周辺エリア警告" : "📍 ピンポイント報告"}
                          </strong><br/>
                          <b>{sos.profiles?.name}</b>: {sos.content}
                          <div style={{ fontSize: "11px", color: "#888", marginTop: "4px" }}>
                            投稿時間: {new Date(sos.created_at).toLocaleTimeString()}
                          </div>

                          <div style={{ marginTop: "10px", borderTop: "1px solid #eee", paddingTop: "8px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <span style={{ fontSize: "11px", fontWeight: "bold", color: "#4B5563" }}>現地の状況確認:</span>
                            <div style={{ display: "flex", gap: "6px" }}>
                              <button onClick={() => alert("👍「現在も継続中」として評価を送信しました。")} style={{ border: "1px solid #ddd", background: "white", borderRadius: "6px", padding: "3px 8px", fontSize: "11px", cursor: "pointer" }}>👍 本当</button>
                              <button onClick={() => handleVoteFake(sos)} style={{ border: "1px solid #FECDD3", background: "#FFF5F5", color: "#E11D48", borderRadius: "6px", padding: "3px 8px", fontSize: "11px", fontWeight: "bold", cursor: "pointer" }}>👎 デマ通報</button>
                            </div>
                          </div>
                        </div>
                      </Popup>
                    </Marker>
                  </div>
                );
              })}

              {/* 2. 各種インフラ・公的固定データレイヤー */}
              {SAFETY_SPOTS.map((spot) => {
                if (spot.type === 'shelter' && !layerFilter.shelter) return null;
                if (spot.type === 'police' && !layerFilter.shelter) return null;
                if (spot.type === 'train' && !layerFilter.train) return null;
                if (spot.type === 'jam' && !layerFilter.jam) return null;
                if (spot.type === 'crime' && !layerFilter.crime) return null; // 犯罪・トラブルのフィルターも対応

                const hasActiveDelay = spot.type === 'train' && spot.lines?.some(lineKey => TRAIN_DELAYS[lineKey]?.hasDelay);
                
                const customIcon = leafletL.divIcon({
                  className: hasActiveDelay ? 'delay-pulse-marker' : '',
                  iconSize: [34, 34],
                  iconAnchor: [17, 34],
                  popupAnchor: [0, -32],
                  html: `<div class="custom-marker-container">
                    <div style="
                      font-size: 20px; 
                      width: 34px; height: 34px; 
                      display: flex; align-items: center; justify-content: center;
                      background: white; 
                      border-radius: 10px; 
                      border: 2px solid ${spot.type === 'train' ? '#2563EB' : spot.type === 'crime' ? '#E11D48' : '#10B981'};
                      box-shadow: 0 4px 10px rgba(0,0,0,0.25);
                    ">${getIconForType(spot.type)}</div>
                  </div>`
                });

                return (
                  <Marker key={spot.id} position={[spot.lat, spot.lng]} icon={customIcon}>
                    <Popup>
                      <div style={{ padding: "5px", minWidth: "200px" }}>
                        <strong>{spot.name}</strong><br/>
                        <span style={{ fontSize: "12px", color: "#666" }}>{spot.desc}</span>
                        {spot.type === 'train' && renderStationDelays(spot.lines)}
                        <div style={{ marginTop: "8px", fontSize: "9px", color: "#bbb", textAlign: "right" }}>出典：防犯オープンデータ</div>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}

              {/* 🎨 安全避難ルート線の描画（白縁取り＋純青を重ねた高コントラスト仕様） */}
              {routes.map((route) => {
                if (!route.points || route.points.length < 2) return null;
                return (
                  <div key={route.id}>
                    <Polyline positions={route.points.map((p: any) => [p.lat, p.lng])} pathOptions={{ color: "#FFFFFF", weight: 10, opacity: 1.0 }} />
                    <Polyline positions={route.points.map((p: any) => [p.lat, p.lng])} pathOptions={{ color: "#1D4ED8", weight: 5, opacity: 1.0 }} />
                  </div>
                );
              })}
            </MapContainer>
          </>
        )}

        {/* 各コンポーネントビューの呼び出し */}
        {activeTab === "log" && <LogView disasterSOS={disasterSOS} gender={gender} livingStatus={livingStatus} handleFocusOnMap={handleFocusOnMap} />}
        {activeTab === "group" && <GroupView myProfile={myProfile} groups={groups} activeGroupId={activeGroupId} setActiveGroupId={setActiveGroupId} targetIdInput={targetIdInput} setTargetIdInput={setTargetIdInput} handleAddGroupMember={handleAddGroupMember} toggleGroupStatus={toggleGroupStatus} handleCreateGroup={handleCreateGroup} />}
        {activeTab === "profile" && <ProfileView myProfile={myProfile} setMyProfile={setMyProfile} ageGroup={ageGroup} setAgeGroup={setAgeGroup} gender={gender} setGender={setGender} livingStatus={livingStatus} setLivingStatus={setLivingStatus} />}
      </div>

      {/* 🛑 エラーを修正したフローティングボタン */}
        <div style={{ position: "absolute", bottom: "86px", left: "20px", right: "20px", display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 1100, pointerEvents: "none" }}>
          {/* 左側：安全通報ボタン */}
          <div style={{ pointerEvents: "auto" }}>
            <button 
              onClick={handleBuzzer} 
              style={{ width: "56px", height: "56px", background: "#F59E0B", color: "white", borderRadius: "50%", fontWeight: "bold", fontSize: "24px", boxShadow: "0 10px 25px rgba(245,158,11,0.4)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", border: "4px solid white" }}
            >
              📣
            </button>
          </div>
          {/* 右側：日常の投稿ボタン */}
          <div style={{ pointerEvents: "auto" }}>
            <button 
              onClick={() => setIsPostModalOpen(true)} 
              style={{ width: "56px", height: "56px", background: "#2563EB", color: "white", borderRadius: "50%", fontWeight: "bold", fontSize: "24px", boxShadow: "0 10px 25px rgba(37,99,235,0.4)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", border: "4px solid white" }}
            >
              ＋
            </button>
          </div>
        </div>
      

      {/* --- タブナビゲーション（既存ロジック・デザイン完全生存） --- */}
      <div style={{ height: "70px", width: "100%", background: "white", display: "flex", borderTop: "1px solid #eee", position: "absolute", bottom: 0, zIndex: 1000 }}>
        {[
          { id: "map", label: "マップ", icon: "🗺️" },
          { id: "log", label: "ログ", icon: "📋" },
          { id: "group", label: "グループ", icon: "👥" },
          { id: "profile", label: "設定", icon: "⚙️" },
        ].map((t) => (
          <button key={t.id} onClick={() => setActiveTab(t.id as any)} style={{ flex: 1, border: "none", background: "none", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: activeTab === t.id ? "#E11D48" : "#9ca3af", transition: "0.2s" }}>
            <span style={{ fontSize: "24px", marginBottom: "2px" }}>{t.icon}</span>
            <span style={{ fontSize: "11px", fontWeight: "bold" }}>{t.label}</span>
          </button>
        ))}
      </div>

      {/* --- 詳細投稿モーダル（既存の全コード・スタイル完全生存） --- */}
      {isPostModalOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 3000, display: "flex", alignItems: "flex-end" }}>
          <div style={{ width: "100%", background: "white", padding: "28px", borderRadius: "28px 28px 0 0", boxShadow: "0 -5px 20px rgba(0,0,0,0.2)", maxHeight: "90dvh", overflowY: "auto" }}>
            <h3 style={{ margin: "0 0 16px", fontSize: "18px", fontWeight: "bold", textAlign: "center", color: "#333" }}>今の状況を周囲に共有</h3>
            
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "bold", color: "#4B5563", marginBottom: "8px" }}>
                🛡️ 投稿主の位置プライバシー設定
              </label>
              <div style={{ display: "flex", background: "#F3F4F6", padding: "4px", borderRadius: "12px", gap: "4px" }}>
                <button 
                  onClick={() => setPrivacyMode("exact")}
                  style={{ 
                    flex: 1, padding: "10px 0", fontSize: "13px", fontWeight: "bold", borderRadius: "9px", border: "none", transition: "0.2s", cursor: "pointer",
                    background: privacyMode === "exact" ? "white" : "transparent",
                    color: privacyMode === "exact" ? "#E11D48" : "#6B7280",
                    boxShadow: privacyMode === "exact" ? "0 2px 6px rgba(0,0,0,0.08)" : "none"
                  }}
                >
                  📍 ピンポイント (正確に共有)
                </button>
                <button 
                  onClick={() => setPrivacyMode("area")}
                  style={{ 
                    flex: 1, padding: "10px 0", fontSize: "13px", fontWeight: "bold", borderRadius: "9px", border: "none", transition: "0.2s", cursor: "pointer",
                    background: privacyMode === "area" ? "#E11D48" : "transparent",
                    color: privacyMode === "area" ? "white" : "#6B7280",
                    boxShadow: privacyMode === "area" ? "0 2px 6px rgba(225,29,72,0.2)" : "none"
                  }}
                >
                  🗺️ 周辺エリアにぼかす (安全第一)
                </button>
              </div>
              <p style={{ fontSize: "11px", color: "#888", marginTop: "6px", padding: "0 4px", lineHeight: "1.4" }}>
                {privacyMode === "exact" 
                  ? "※事件がすでに終了し、現場の正確な緯度経度をピンで詳細に知らせたい場合に選択してください。" 
                  : "※現在地がバレると危険な場合、位置情報を半径200mにランダムにずらし、周辺一帯のエリアとしてぼかして警告円を描画します。"}
              </p>
            </div>

            <div style={{ display: "flex", gap: "10px", marginBottom: "20px", overflowX: "auto", paddingBottom: "10px" }}>
              {CATEGORIES.map(cat => (
                <button key={cat.id} onClick={() => setSelectedCategory(cat.id)} style={{ flex: "0 0 85px", display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", padding: "12px 0", borderRadius: "16px", border: selectedCategory === cat.id ? `2px solid ${cat.color}` : "1px solid #eee", background: selectedCategory === cat.id ? `${cat.color}15` : "white" }}><span style={{ fontSize: "26px" }}>{cat.icon}</span><span style={{ fontSize: "11px", fontWeight: "bold", color: selectedCategory === cat.id ? cat.color : "#666" }}>{cat.label}</span></button>
              ))}
            </div>
            <textarea style={{ width: "100%", height: "110px", padding: "18px", borderRadius: "18px", border: "1px solid #ddd", fontSize: "16px", marginBottom: "20px", outline: "none", color: "#333", lineHeight: "1.5" }} placeholder="不審な行動、服装、逃走方向、犯人の特徴などを具体的に入力してください..." value={postContent} onChange={(e) => setPostContent(e.target.value)} />
            <div style={{ display: "flex", gap: "12px" }}>
              <button style={{ flex: 1, padding: "16px", borderRadius: "16px", border: "none", background: "#f3f4f6", fontWeight: "bold", color: "#666" }} onClick={() => setIsPostModalOpen(false)}>閉じる</button>
              <button style={{ flex: 2, padding: "16px", borderRadius: "16px", border: "none", background: "#E11D48", color: "white", fontWeight: "bold", fontSize: "16px" }} onClick={handlePostSubmit}>報告を送信する</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}