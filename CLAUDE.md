CLAUDE.md – VisitPlus Korea LP プロジェクト永続コンテキスト

1. このプロジェクトは何をする？

日本発リユース企業 VisitPlus は、韓国市場での 名品訪問感定・即時買取 サービス需要を検証するため、Next.js 製ランディングページと予約フォームを構築します。G‑market で販売した商品に同梱した QR から LP に誘導し、ユーザーが訪問買取を申し込むと、韓国内の古物許可業者に業務委託して実際の査定・買取を行います。

2. コードベースの概要

フレームワーク: Next.js 14 (App Router / Edge Runtime)

言語: TypeScript 5

UI: Tailwind CSS 3 + shadcn/ui

배포: Vercel (Preview → Production)

서드파티: HubSpot CRM (リード登録)、Resend (自動応答メール)、Amazon S3 (画像アップロード)、Sentry (監視)

3. 使用技術一覧

カテゴリ

技術

主な役割

SSR/SSG

Next.js 14

LP 表示、Edge API

型安全

TypeScript 5

開発効率・品質向上

UI

Tailwind CSS 3

ユーティリティファーストスタイル

フォーム

HubSpot Free

リード&CRM 連携

メール

Resend

確認メール送信

ストレージ

Amazon S3

画像アップロード

監視

Sentry

エラー収集

分析

GA4 / GTM / Naver Analytics

KPI 追跡・リマーケ

4. アーキテクチャパターン

Static + Edge: LP 本体は SSG、フォーム送信は Edge Route /api/lead → 低レイテンシ

コンポーネント分割: Hero, TrustBadges, ReservationForm, FAQ など UI/ロジック分離

三層責務: UI → API(Edge) → 外部サービス(HubSpot/S3)

5. 主要エントリポイント

ファイル

役割

app/layout.tsx

全ページ共通 HTML/Meta/TailwindProvider

app/page.tsx

ランディングページ本体

app/thanks/page.tsx

フォーム送信後の完了ページ

app/api/lead/route.ts

Edge Runtime POST API → HubSpot 登録

6. フォルダ構成

/app
  ├─ layout.tsx
  ├─ page.tsx
  ├─ thanks/page.tsx
  ├─ api/lead/route.ts
/components
  ├─ Hero.tsx
  ├─ TrustBadges.tsx
  ├─ ReservationForm.tsx
  ├─ FAQ.tsx
/lib
  ├─ analytics.ts
  ├─ hubspot.ts
/public
  └─ og/hero.png

7. データモデル & 外部 API

Lead (HubSpot Contact)

{
  "firstname": "홍길동",
  "phone": "+82 10-1234-5678",
  "category": "Hermes Bag",
  "area": "서울 강남구",
  "imageUrls": ["https://s3…"],
  "utm_source": "flyer",
  "utm_medium": "qr",
  "utm_campaign": "korea_visit_test"
}

8. エラー処理

Edge API 内 try/catch → Sentry.captureException(err)

フォーム送信失敗時は toast でユーザー通知

9. 認証

フォームは公開。

HubSpot API キーは .env の HUBSPOT_API_KEY で管理し、Vercel 環境変数に登録。

10. 今後の To‑Do

韓国の 고물업 허가保有業者リストアップ & 引受契約テンプレ準備

배송비 포함 국제물류フローの試算

LINE VOOM / Kakao 채널公式アカウント運用設計

このファイルは新しい Claude セッション毎に読み込まれ、プロジェクト文脈を保持します。変更が生じた場合は随時アップデートしてください。

