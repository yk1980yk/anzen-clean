"use client";

import { useState } from "react";

interface GroupViewProps {
  myProfile: any;
  groups: any[];
  activeGroupId: string;
  setActiveGroupId: (id: string) => void;
  targetIdInput: string;
  setTargetIdInput: (val: string) => void;
  handleAddGroupMember: (e: React.FormEvent) => void;
  toggleGroupStatus: (groupId: string, memberId: string) => void;
  handleCreateGroup: (groupName: string) => boolean;
}

export default function GroupView({
  myProfile,
  groups,
  activeGroupId,
  setActiveGroupId,
  targetIdInput,
  setTargetIdInput,
  handleAddGroupMember,
  toggleGroupStatus,
  handleCreateGroup
}: GroupViewProps) {
  const [newGroupName, setNewGroupName] = useState("");
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);

  const activeGroup = groups.find(g => g.id === activeGroupId) || groups[0];

  const onCreateGroupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;
    
    const success = handleCreateGroup(newGroupName);
    if (success) {
      setNewGroupName("");
    } else {
      setIsPaywallOpen(true);
    }
  };

  return (
    <div style={{ padding: "20px", overflowY: "auto", height: "100%", paddingBottom: "100px" }}>
      <h2 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "5px" }}>グループ・見守り管理</h2>
      <p style={{ fontSize: "12px", color: "#666", marginBottom: "20px" }}>用途に合わせて複数のグループを作成し、安全ラインを構築できます。</p>

      {/* 自分のID表示 */}
      <div style={{ background: "white", padding: "12px", borderRadius: "16px", border: "1px solid #eee", marginBottom: "20px", textAlign: "center" }}>
        <div style={{ fontSize: "11px", color: "#999", marginBottom: "2px" }}>あなたの共有用マイID</div>
        <div style={{ fontSize: "18px", fontWeight: "bold", letterSpacing: "2px", color: "#111827" }}>{myProfile.myRandomId}</div>
      </div>

      {/* グループ作成フォーム */}
      <form onSubmit={onCreateGroupSubmit} style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
        <input 
          type="text" 
          placeholder="新しいグループ名（例: 恋人、友達）"
          value={newGroupName}
          onChange={(e) => setNewGroupName(e.target.value)}
          style={{ flex: 1, padding: "12px", borderRadius: "12px", border: "1px solid #ddd", fontSize: "14px", outline: "none" }}
        />
        <button type="submit" style={{ background: "#E11D48", color: "white", border: "none", padding: "0 16px", borderRadius: "12px", fontWeight: "bold", fontSize: "13px", cursor: "pointer" }}>作成</button>
      </form>

      {/* グループ切り替えタブ */}
      <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "10px", marginBottom: "20px" }}>
        {groups.map(g => (
          <button
            key={g.id}
            onClick={() => setActiveGroupId(g.id)}
            style={{
              padding: "8px 16px",
              borderRadius: "20px",
              border: activeGroupId === g.id ? "none" : "1px solid #ddd",
              background: activeGroupId === g.id ? "#000" : "white",
              color: activeGroupId === g.id ? "white" : "#4B5563",
              fontWeight: "bold",
              fontSize: "13px",
              whiteSpace: "nowrap",
              cursor: "pointer"
            }}
          >
            {g.name} ({g.members.length}人)
          </button>
        ))}
      </div>

      {/* 選択中のグループの管理セクション */}
      {activeGroup && (
        <div style={{ background: "white", padding: "20px", borderRadius: "20px", border: "1px solid #eee" }}>
          <h3 style={{ fontSize: "15px", fontWeight: "bold", marginBottom: "12px", color: "#111827" }}>
            👥 「{activeGroup.name}」のメンバー
          </h3>

          {/* メンバー追加フォーム */}
          <form onSubmit={handleAddGroupMember} style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
            <input 
              type="text" 
              placeholder="相手のIDを入力してグループに追加"
              value={targetIdInput}
              onChange={(e) => setTargetIdInput(e.target.value)}
              style={{ flex: 1, padding: "10px 14px", borderRadius: "10px", border: "1px solid #ddd", fontSize: "13px", outline: "none" }}
            />
            <button type="submit" style={{ background: "#000", color: "white", border: "none", padding: "0 14px", borderRadius: "10px", fontWeight: "bold", fontSize: "13px", cursor: "pointer" }}>追加</button>
          </form>

          {activeGroup.members.length === 0 ? (
            <div style={{ textAlign: "center", color: "#999", fontSize: "13px", padding: "10px 0" }}>まだメンバーがいません。上のフォームから追加してください。</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {activeGroup.members.map((m: any) => (
                <div key={m.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#F9FAFB", padding: "12px", borderRadius: "12px", border: "1px solid #F3F4F6" }}>
                  <div>
                    <div style={{ fontWeight: "bold", fontSize: "13px" }}>{m.name}</div>
                    <div style={{ fontSize: "11px", color: "#999" }}>ID: {m.randomId}</div>
                  </div>
                  <button 
                    onClick={() => toggleGroupStatus(activeGroup.id, m.id)} 
                    style={{ background: m.is_active ? "#2563EB" : "#E5E7EB", color: m.is_active ? "white" : "#6B7280", border: "none", padding: "6px 12px", borderRadius: "8px", fontWeight: "bold", fontSize: "12px", cursor: "pointer" }}
                  >
                    {m.is_active ? "緊急通知オン" : "通知オフ"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* サブスク誘導ポップアップ */}
      {isPaywallOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 4000, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
          <div style={{ background: "white", width: "100%", maxWidth: "340px", padding: "25px", borderRadius: "24px", textAlign: "center", boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}>
            <div style={{ fontSize: "40px", marginBottom: "10px" }}>👑</div>
            <h3 style={{ margin: "0 0 10px", fontSize: "18px", fontWeight: "bold", color: "#111827" }}>プレミアムプラン限定機能</h3>
            <p style={{ fontSize: "13px", color: "#4B5563", margin: "0 0 20px", lineHeight: "1.5" }}>
              無料版では作成できるグループは1つまでです。<br/>
              <strong>月額 300円の「家族・仲間見守りパック」</strong>に登録すると、グループ作成が無限になり、メンバーのリアルタイム異常検知アラートが有効になります。
            </p>
            <button 
              onClick={() => alert("💰 決済画面への接続デモ（月額300円のサブスク契約）")}
              style={{ width: "100%", background: "#E11D48", color: "white", border: "none", padding: "14px", borderRadius: "12px", fontWeight: "bold", fontSize: "15px", marginBottom: "10px", cursor: "pointer" }}
            >
              プレミアムプランに登録する
            </button>
            <button 
              onClick={() => setIsPaywallOpen(false)}
              style={{ background: "none", border: "none", color: "#9CA3AF", fontSize: "13px", cursor: "pointer" }}
            >
              今は戻る
            </button>
          </div>
        </div>
      )}
    </div>
  );
}