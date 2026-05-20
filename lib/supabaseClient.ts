"use client";

import { createClient } from "@supabase/supabase-js";

// 環境変数の存在チェックを行い、型エラーを未然に防ぐ
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // 開発時に環境変数の設定漏れにすぐ気付けるようにする
  console.error(
    "Supabaseの環境変数が設定されていません。.env.local ファイルを確認してください。"
  );
}

/**
 * Supabaseクライアントの初期化
 * !（非null修飾子）を付けることで、TypeScriptに「必ず値がある」ことを伝え、
 * 他のファイルでsupabase.authなどを使う際の型エラーを抑制します。
 */
export const supabase = createClient(
  supabaseUrl!,
  supabaseAnonKey!
);