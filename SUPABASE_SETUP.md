# Supabase セットアップガイド

## 1. Supabaseプロジェクトの作成

1. [Supabase](https://supabase.com) にアクセス
2. アカウントを作成（GitHubアカウントでログイン可能）
3. 「New project」をクリック
4. プロジェクト情報を入力：
   - Project name: `visitplus-kr`
   - Database Password: 強力なパスワードを生成
   - Region: `Northeast Asia (Tokyo)`を選択
5. 「Create new project」をクリック

## 2. データベーステーブルの作成

### SQLエディタで以下を実行：

```sql
-- フォーム送信データを格納するテーブル
CREATE TABLE form_submissions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  ip_address TEXT,
  user_agent TEXT
);

-- インデックスの作成（検索性能向上）
CREATE INDEX idx_form_submissions_created_at ON form_submissions(created_at DESC);
CREATE INDEX idx_form_submissions_email ON form_submissions(email);

-- Row Level Security (RLS) の有効化
ALTER TABLE form_submissions ENABLE ROW LEVEL SECURITY;

-- INSERTのみ許可するポリシー（匿名ユーザー）
CREATE POLICY "Allow anonymous inserts" ON form_submissions
  FOR INSERT TO anon
  WITH CHECK (true);

-- SELECTは認証済みユーザーのみ（管理画面用）
CREATE POLICY "Allow authenticated select" ON form_submissions
  FOR SELECT TO authenticated
  USING (true);
```

## 3. 環境変数の取得

1. Supabaseダッシュボードで「Settings」→「API」に移動
2. 以下の値をコピー：
   - `Project URL`（例：https://xxxxx.supabase.co）
   - `anon public`キー（公開可能なキー）

## 4. 環境変数の設定

### `.env.local`に追加：
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### `.env.example`に追加：
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 5. Supabaseクライアントのインストール

```bash
npm install @supabase/supabase-js
```

## 6. Supabaseクライアントの作成

### `/lib/supabase.ts`を作成：
```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// フォームデータの型定義
export type FormSubmission = {
  id?: string
  name: string
  email: string
  phone: string
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  created_at?: string
  ip_address?: string
  user_agent?: string
}
```

## 7. APIルートの更新

`/app/api/lead/route.ts`をSupabase対応に更新（このガイドの実装後に自動で行われます）

## 8. データの確認方法

### Supabaseダッシュボード
1. 「Table Editor」に移動
2. `form_submissions`テーブルを選択
3. 送信されたデータを確認

### SQLクエリでの確認
```sql
-- 最新10件を取得
SELECT * FROM form_submissions 
ORDER BY created_at DESC 
LIMIT 10;

-- 今日の送信数
SELECT COUNT(*) FROM form_submissions 
WHERE created_at >= CURRENT_DATE;

-- UTMソース別の集計
SELECT utm_source, COUNT(*) as count 
FROM form_submissions 
GROUP BY utm_source;
```

## 9. データのエクスポート

### CSV形式でダウンロード
1. Table Editorで`form_submissions`を開く
2. 「Export」ボタンをクリック
3. CSV形式を選択してダウンロード

### Google Sheetsとの連携（オプション）
1. Google Sheets の拡張機能から「Supabase Connector」をインストール
2. Supabaseの認証情報を設定
3. 定期的にデータを同期

## 10. セキュリティのベストプラクティス

1. **環境変数の管理**
   - `.env.local`は絶対にGitにコミットしない
   - Vercelのダッシュボードで環境変数を設定

2. **Row Level Security**
   - 上記のSQLで設定済み
   - 匿名ユーザーはINSERTのみ可能

3. **レート制限**
   - Supabaseのダッシュボードで設定可能
   - 必要に応じてAPI呼び出し制限を設定

## 11. トラブルシューティング

### データが保存されない
- 環境変数が正しく設定されているか確認
- ブラウザのコンソールでエラーを確認
- Supabaseのログを確認（Dashboard → Logs）

### CORS エラー
- SupabaseのダッシュボードでCORS設定を確認
- 通常は自動で設定されているはず

### 接続エラー
- Supabaseプロジェクトが一時停止していないか確認
- 無料プランは1週間アクセスがないと一時停止される