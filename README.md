# VisitPlus Korea Landing Page

韓国市場での名品出張鑑定サービスの需要検証用ランディングページ

## 技術スタック

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Database**: Supabase
- **Analytics**: Google Analytics 4
- **Deployment**: Vercel

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. Supabaseの設定

1. [Supabase](https://supabase.com)でプロジェクトを作成
2. `SUPABASE_SETUP.md`の手順に従ってテーブルを作成
3. APIキーを取得

### 3. 環境変数の設定

`.env.local`ファイルを作成：

```bash
cp .env.local.example .env.local
```

以下の値を設定：
- `NEXT_PUBLIC_SUPABASE_URL`: SupabaseプロジェクトのURL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabaseの公開キー
- `NEXT_PUBLIC_GA_MEASUREMENT_ID`: Google Analytics測定ID
- `RESEND_API_KEY`: (オプション) メール通知用

### 4. 開発サーバーの起動

```bash
npm run dev
```

http://localhost:3000 でアクセス可能

## デプロイ

### Vercelへのデプロイ

1. [Vercel](https://vercel.com)でプロジェクトをインポート
2. 環境変数を設定
3. デプロイ

## 主な機能

- **問い合わせフォーム**: 名前、メール、電話番号の収集
- **UTM追跡**: チラシ効果測定
- **データ保存**: Supabaseに自動保存
- **アクセス解析**: Google Analytics 4連携

## ドキュメント

- `SUPABASE_SETUP.md`: Supabaseセットアップガイド
- `GOOGLE_SHEETS_SETUP.md`: Google Sheets連携（レガシー）
- `KAKAO_BUSINESS_SETUP.md`: カカオトークビジネスアカウント設定

## データ確認方法

### Supabaseダッシュボード
1. Supabaseプロジェクトにログイン
2. Table Editorで`form_submissions`を確認

### SQLクエリ例
```sql
-- 最新の問い合わせ
SELECT * FROM form_submissions 
ORDER BY created_at DESC 
LIMIT 10;

-- UTMソース別集計
SELECT utm_source, COUNT(*) 
FROM form_submissions 
GROUP BY utm_source;
```

## 開発者向け

### コマンド
- `npm run dev`: 開発サーバー起動
- `npm run build`: プロダクションビルド
- `npm run lint`: ESLintチェック
- `npm run type-check`: TypeScriptチェック

### ファイル構成
```
/app
  ├─ layout.tsx          # 共通レイアウト
  ├─ page.tsx           # メインページ
  ├─ thanks/page.tsx    # 完了ページ
  └─ api/lead/route.ts  # フォームAPI
/components
  ├─ Hero.tsx           # ヒーローセクション
  ├─ ReservationForm.tsx # 問い合わせフォーム
  └─ FAQ.tsx            # よくある質問
/lib
  └─ supabase.ts        # Supabaseクライアント
```