# Energio Tool Hub

GitHub Pages 向けの完全静的なアプリ一覧ハブです。現在は HTML + CSS + 最小限のバニラ JS 構成で、検索とタグ（OR 条件）フィルタが動作します。フレームワーク（React/Tailwind 等）は不使用です。


## 現在実装済みの機能
- カード型 UI でアプリ一覧を表示（4件のデモ）
  - バッジ / アプリ名 / 見出し / 説明（3行でトリム）/ タグ / CTA「開く」
  - カード全体クリックで遷移（相対 URL）
- 検索（クライアントサイド）
  - 対象: name / headline / description / tags（小文字化・部分一致）
  - 入力のたびに即時反映
- タグフィルタ（OR 条件、複数選択可）
  - タグボタンをクリックで選択/解除
  - 上部に「選択中タグ」チップを表示し、× で解除
- レスポンシブレイアウト
  - 1（モバイル）/ 2（タブレット）/ 3（PC）カラムのグリッド
- デザイン
  - キーカラー: 赤系（フォーカス/CTA/ホバー）
  - 背景: ラディアルの赤系グラデ＋ライトなグリッドの装飾
  - ヘッダー: 半透明＋ブラーのガラス風、ブランド下にさりげない赤グラデの下線
  - アクセシビリティ: フォーカスリング、キーボード操作でタグ選択可


## 現在のエントリ URI
- ルート: `index.html`（単一ページ）
- About: ヘッダーの About はダミー（別ページは未作成）


## 未実装・差分（PRD との違い）
- public/data.json の fetch による動的描画: 未実装（デモ用として index.html に静的カードを直書き、バニラ JS でフィルタ）
- LocalStorage の「お気に入り」: 未実装
- 「最近使った」履歴: 未実装
- Loading スケルトン / Error + Retry UI: 未実装（fetch がないため不要）
- HashRouter ルーティング: 未実装（単一ページ）


## 推奨次ステップ
1. public/data.json を用いた動的生成に切り替え（fetch → カード DOM を生成）
   - 取得失敗時のエラー表示 / リトライも同時実装
   - 並び順: `order` 昇順 → `name` で安定ソート
2. お気に入り（LocalStorage）機能の追加
   - key: `solar_tools_hub_favorites_v1`
   - 表示は先頭に「お気に入り」セクション、または優先ソート
3. 「最近使った」履歴（LocalStorage / 上限 5 件）
4. about.html の追加（本ページの目的・注意事項）
5. README の手順に沿って、カードの管理を data.json 中心に移行


## 使い方（現在の静的版でアプリを増やす）
1. index.html のカードを複製して編集
2. 各カードに以下の data 属性を付与してください（検索/タグ用）
   - `data-name`: 表示名
   - `data-desc`: 検索対象になる説明テキスト（headline や shortDescription の要約で可）
   - `data-tags`: カンマ区切りのタグ（例: `回路設計,ストリング,レイアウト`）
3. タグのボタンに追加したい語があれば、Controls セクションの `#tagList` に `<button class="tag" data-tag="...">...</button>` を追加


## data.json を使う動的版へ移行する場合のメモ
- データソース: `public/data.json`
- 型（想定）:
  - `site.title: string`
  - `site.subtitle: string`
  - `site.footerNote: string`
  - `apps: App[]`
  - `App`:
    - `id: string`（ユニーク）
    - `name: string`
    - `headline: string`
    - `shortDescription: string`
    - `tags: string[]`
    - `badge: string`（任意）
    - `href: string`（相対 or 絶対）
    - `external: boolean`
    - `order: number`
    - `updatedAt: string`（YYYY-MM-DD 任意）


## ファイル構成
- `index.html`（メインページ、検索/タグフィルタをバニラ JS で実装）
- `css/style.css`（レイアウト、装飾、赤系テーマ、背景デコレーション）
- `js/static-filter.js`（検索・タグ OR フィルタのロジック）
- `public/data.json`（将来的に fetch で参照するデータ。現状は未使用）
- `README.md`（本ファイル）


## デプロイ
To deploy your website and make it live, please go to the Publish tab where you can publish your project with one click. The Publish tab will handle all deployment processes automatically and provide you with the live website URL.
