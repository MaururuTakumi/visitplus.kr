# Google Sheets フォーム連携設定ガイド

## 1. Google Sheetsの準備

1. 新しいGoogle Sheetsを作成
2. シート名を「フォーム回答」に変更
3. 1行目にヘッダーを追加：
   - A1: タイムスタンプ
   - B1: 名前
   - C1: メールアドレス
   - D1: 電話番号
   - E1: UTMソース
   - F1: UTMメディア
   - G1: UTMキャンペーン

## 2. Google Apps Script (GAS) の設定

1. Google Sheetsで「拡張機能」→「Apps Script」を開く

2. 以下のコードを貼り付け：

```javascript
function doPost(e) {
  try {
    // リクエストの検証
    const data = JSON.parse(e.postData.contents);
    
    // スプレッドシートを取得
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('フォーム回答');
    
    // タイムスタンプを追加
    const timestamp = new Date();
    const formattedTimestamp = Utilities.formatDate(timestamp, 'Asia/Seoul', 'yyyy-MM-dd HH:mm:ss');
    
    // データを配列に整形
    const rowData = [
      formattedTimestamp,
      data.name || '',
      data.email || '',
      data.phone || '',
      data.utm_source || '',
      data.utm_medium || '',
      data.utm_campaign || ''
    ];
    
    // シートに追加
    sheet.appendRow(rowData);
    
    // 成功レスポンス
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'success',
        message: '문의가 접수되었습니다.'
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // エラーレスポンス
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'error',
        message: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// テスト用のGET関数
function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({
      status: 'ok',
      message: 'Google Apps Script is running'
    }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

3. 「デプロイ」→「新しいデプロイ」をクリック

4. 設定：
   - 種類：「ウェブアプリ」
   - 実行するユーザー：「自分」
   - アクセスできるユーザー：「全員」
   
5. 「デプロイ」をクリックしてURLをコピー

## 3. 環境変数の設定

Vercelプロジェクトに以下の環境変数を追加：

```
GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/[YOUR_SCRIPT_ID]/exec
```

## 4. CORS対応について

Google Apps ScriptはCORSヘッダーを設定できないため、以下の対応が必要：

### オプション1: サーバーサイドから送信（推奨）
Next.jsのAPI Route (`/api/lead`) からGASにPOSTリクエストを送信

### オプション2: JSONP（非推奨）
クライアントサイドから直接送信する場合はJSONPを使用

## 5. テスト方法

1. GASエディタで「実行」ボタンをクリックして権限を承認
2. デプロイURLにブラウザでアクセスして動作確認
3. フォームから実際にデータを送信してシートに記録されることを確認

## 6. セキュリティ考慮事項

- GAS URLは公開されるため、重要な処理は行わない
- バリデーションは必ずサーバーサイドでも実施
- レート制限を考慮（1日あたりの実行数に制限あり）