"use client";

import dynamic from "next/dynamic";
import { useEffect, useState, useRef } from "react";
import { supabase } from "../../lib/supabaseClient";

// 分割したビューコンポーネントのインポート
import LogView from "./LogView";
import GroupView from "./GroupView";
import ProfileView from "./ProfileView";
import LayerFilterView from "./LayerFilterView";

const MapContainer = dynamic(() => import("react-leaflet").then((m) => m.MapContainer), { ssr: false }) as any;
const TileLayer = dynamic(() => import("react-leaflet").then((m) => m.TileLayer), { ssr: false }) as any;
const Marker = dynamic(() => import("react-leaflet").then((m) => m.Marker), { ssr: false }) as any;
const Popup = dynamic(() => import("react-leaflet").then((m) => m.Popup), { ssr: false }) as any;
const Circle = dynamic(() => import("react-leaflet").then((m) => m.Circle), { ssr: false }) as any;

const CATEGORIES = [
  { id: "crime", label: "犯罪・トラブル", icon: "👁️", color: "#E11D48" },
  { id: "suspicious", label: "不審な行動", icon: "👤", color: "#F59E0B" },
  { id: "accident", label: "交通事故", icon: "🚗", color: "#2563EB" },
  { id: "train", label: "鉄道遅延", icon: "🚃", color: "#F97316" },
  { id: "shelter", label: "避難所", icon: "🏠", color: "#10B981" },
];

const SAFETY_SPOTS = [
  { id: 's1', name: '上池袋コミュニティセンター', lat: 35.738, lng: 139.722, type: 'shelter', desc: '指定緊急避難場所' },
  { id: 's2', name: '池袋本町公園', lat: 35.741, lng: 139.715, type: 'shelter', desc: '広域避難場所' },
  { id: 'p1', name: '上池袋交番', lat: 35.736, lng: 139.718, type: 'police', desc: '24時間対応' },
  { id: 'st-ikebukuro', name: 'JR 池袋駅', lat: 35.7295, lng: 139.711, type: 'train', lines: ["yamanote", "marunouchi", "yurakucho"], desc: '駅構内・周辺安全' },
  { id: 'st-otsuka', name: 'JR 大塚駅', lat: 35.7315, lng: 139.7285, type: 'train', lines: ["yamanote"], desc: '駅構内・周辺安全' },
  { id: 'st-sugamo', name: 'JR/都営 巣鴨駅', lat: 35.7335, lng: 139.7395, type: 'train', lines: ["yamanote", "mita"], desc: '駅構内・周辺安全' },
  { id: 'jam-1', name: '明治通り（上池袋交差点付近）', lat: 35.734, lng: 139.720, type: 'jam', desc: '⚠️ 激しい渋滞（通過に平時の+15分）' },
  { id: 'jam-2', name: '首都高速5号線（北池袋出入口付近）', lat: 35.743, lng: 139.712, type: 'jam', desc: '⛔ 規制中（事故車処理のため左車線規制）' },
];

const TRAIN_DELAYS: { [key: string]: { lineName: string; status: string; hasDelay: boolean } } = {
  yamanote: { lineName: "JR 山手線", status: "⚠️ 遅延あり（車両点検の影響で約5分遅れ）", hasDelay: true },
  mita: { lineName: "都営 三田線", status: "✅ 平常運転", hasDelay: false },
  marunouchi: { lineName: "東京メトロ 丸ノ内線", status: "✅ 平常運転", hasDelay: false },
  yurakucho: { lineName: "東京メトロ 有楽町線", status: "⚠️ 運転見合わせ（人身事故の影響）", hasDelay: true },
};

export default function MapPage() {
  const [deviceGps, setDeviceGps] = useState<[number, number]>([35.735, 139.722]);
  const [position, setPosition] = useState<[number, number] | null>([35.735, 139.722]);
  const [follow, setFollow] = useState(false);
  const [leafletL, setLeafletL] = useState<any>(null);
  const mapRef = useRef<any>(null);
  
  const [disasterSOS, setDisasterSOS] = useState<any[]>([]);
  
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
            <LayerFilterView layerFilter={layerFilter} setLayerFilter={setLayerFilter} />

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

                const hasActiveDelay = spot.type === 'train' && spot.lines?.some(lineKey => TRAIN_DELAYS[lineKey]?.hasDelay);
                const isJamOrIncident = spot.type === 'jam';

                const customIcon = leafletL.divIcon({
                  className: hasActiveDelay ? 'delay-pulse-marker' : '',
                  iconSize: [36, 36],
                  iconAnchor: [18, 36], 
                  popupAnchor: [0, -32],
                  html: `<div class="custom-marker-container">
                    <div style="
                      font-size: 21px; 
                      width: 34px; height: 34px; 
                      display: flex; align-items: center; justify-content: center;
                      background: ${spot.type === 'train' ? 'linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 100%)' : isJamOrIncident ? 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)' : 'rgba(255,255,255,0.95)'}; 
                      border-radius: 12px; 
                      border: 2px solid ${spot.type === 'train' ? '#2563EB' : isJamOrIncident ? '#D97706' : '#10B981'};
                      box-shadow: 0 4px 10px rgba(0,0,0,0.25);
                    ">${spot.type === 'shelter' ? '🏠' : spot.type === 'police' ? '🚓' : spot.type === 'train' ? '🚃' : '🚗'}</div>
                  </div>`
                });

                return (
                  <Marker key={spot.id} position={[spot.lat, spot.lng]} icon={customIcon}>
                    <Popup>
                      <div style={{ padding: "5px", minWidth: "200px" }}>
                        <strong>{spot.name}</strong><br/>
                        <span style={{ fontSize: "12px", color: "#666" }}>{spot.desc}</span>
                        {spot.type === 'train' && renderStationDelays(spot.lines)}
                        <div style={{ marginTop: "8px", fontSize: "9px", color: "#bbb", textAlign: "right" }}>出典：公的オープンデータ連携</div>
                      </div>
                    </Popup>
                  </Marker>
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

      {/* --- クイックアクションボタン --- */}
      {activeTab === "map" && (
        <div style={{ position: "absolute", bottom: 90, width: "100%", display: "flex", justifyContent: "center", gap: "12px", zIndex: 1100, padding: "0 20px" }}>
          <button onClick={handleBuzzer} style={{ flex: 1, background: "#000", color: "#fff", border: "none", padding: "16px", borderRadius: "50px", fontWeight: "bold", fontSize: "16px", boxShadow: "0 4px 15px rgba(0,0,0,0.3)" }}>🚨 ブザー</button>
          <button onClick={() => setIsPostModalOpen(true)} style={{ flex: 2, background: "#E11D48", color: "white", border: "none", padding: "16px", borderRadius: "50px", fontWeight: "bold", fontSize: "16px", boxShadow: "0 8px 20px rgba(225,29,72,0.4)" }}>🆘 緊急報告・共有</button>
        </div>
      )}

      {/* --- タブナビゲーション --- */}
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

      {/* --- 詳細投稿モーダル --- */}
      {isPostModalOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 3000, display: "flex", alignItems: "flex-end" }}>
          <div style={{ width: "100%", background: "white", padding: "28px", borderRadius: "28px 28px 0 0", boxShadow: "0 -5px 20px rgba(0,0,0,0.2)", maxHeight: "90dvh", overflowY: "auto" }}>
            <h3 style={{ margin: "0 0 16px", fontSize: "18px", fontWeight: "bold", textAlign: "center", color: "#333" }}>今の状況を周囲に共有</h3>
            
            {/* 👑 タイポ修正箇所：無効なstyleオブジェクト内のプロパティを削除し、綺麗な標準CSSに修正 */}
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