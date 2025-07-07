# Google Apps Script 動作確認ガイド

## 提供されたURL
```
https://script.google.com/a/macros/buysell-technologies.com/s/AKfycbx6XelzuEb4_7T2TYo8ZqyhFtBPfT46T4jLU3fOGuNWJeBGVGLQDf1FZjUdZ8Q3NJW47Q/exec
```

## 1. URLの確認ポイント

### ✅ 正しい形式
- Google Apps ScriptのWeb App URLとして正しい形式です
- `/a/macros/buysell-technologies.com/` は組織アカウントを示しています

### ⚠️ 確認が必要な点
1. **デプロイ設定**
   - 「実行するユーザー」: 「自分」になっているか
   - 「アクセスできるユーザー」: 「全員」になっているか

2. **スクリプトの内容**
   - `doPost(e)` 関数が実装されているか
   - 必要なフィールドを処理しているか

## 2. テスト方法

### ブラウザでのテスト
```bash
# ブラウザでアクセスしてGETリクエストをテスト
# 以下のようなレスポンスが返ればOK
{
  "status": "ok",
  "message": "Google Apps Script is running"
}
```

### curlでのテスト
```bash
curl -L -X POST \
  'https://script.google.com/a/macros/buysell-technologies.com/s/AKfycbx6XelzuEb4_7T2TYo8ZqyhFtBPfT46T4jLU3fOGuNWJeBGVGLQDf1FZjUdZ8Q3NJW47Q/exec' \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "テスト太郎",
    "email": "test@example.com",
    "phone": "010-1234-5678",
    "utm_source": "test",
    "utm_medium": "curl",
    "utm_campaign": "verification"
  }'
```

## 3. 環境変数の設定

`.env.local` ファイルに追加：
```env
GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/a/macros/buysell-technologies.com/s/AKfycbx6XelzuEb4_7T2TYo8ZqyhFtBPfT46T4jLU3fOGuNWJeBGVGLQDf1FZjUdZ8Q3NJW47Q/exec
```

## 4. スプレッドシートの確認

1. Google Sheetsを開く
2. 以下のヘッダーがあることを確認：
   - A1: タイムスタンプ
   - B1: 名前
   - C1: メールアドレス
   - D1: 電話番号
   - E1: UTMソース
   - F1: UTMメディア
   - G1: UTMキャンペーン

## 5. トラブルシューティング

### エラー: "Script function not found: doGet"
→ GASに`doGet()`関数を追加

### エラー: "Authorization required"
→ デプロイ設定で「全員」にアクセス許可

### データが記録されない
→ シート名が「フォーム回答」になっているか確認

## 6. URLの問題が発生した場合

### 現在のURL
```
https://script.google.com/a/macros/buysell-technologies.com/s/AKfycbx6XelzuEb4_7T2TYo8ZqyhFtBPfT46T4jLU3fOGuNWJeBGVGLQDf1FZjUdZ8Q3NJW47Q/exec
```

このURLでエラーが出る場合は、以下を確認してください：

1. **デプロイ設定の確認**
   - Google Apps Scriptエディタで「デプロイ」→「デプロイを管理」
   - 現在のデプロイの設定を確認
   - 「アクセスできるユーザー」が「全員」になっているか

2. **新しいデプロイの作成**
   - 「新しいデプロイ」をクリック
   - 種類：「ウェブアプリ」
   - 実行するユーザー：「自分」
   - アクセスできるユーザー：「全員」
   - デプロイ後、新しいURLをコピー

3. **組織の制限**
   - `/a/macros/buysell-technologies.com/` の部分は組織アカウントを示しています
   - 組織の設定で外部アクセスが制限されている可能性があります
   - その場合は、個人のGoogleアカウントで新しいスプレッドシートとGASを作成することを推奨

## 7. 代替案：個人アカウントでの設定

組織の制限でアクセスできない場合：

1. 個人のGoogleアカウントでログイン
2. 新しいGoogle Sheetsを作成
3. Apps Scriptを開いて同じコードを貼り付け
4. デプロイして新しいURLを取得
5. そのURLを環境変数に設定

## 8. 本番環境での使用

1. 正しく動作するURLを確認
2. Vercelの環境変数に追加
3. デプロイ後、フォームから実際にテスト送信
4. Google Sheetsでデータが記録されることを確認