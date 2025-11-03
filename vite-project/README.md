# ポケモン検索

## 取得データ
プロパティ	内容
data	PokéAPIの pokemon エンドポイントから取得した元データ
id	ポケモンの種族ID（species ID）
name	日本語名 + フォルム名（例：ピカチュウ（キョダイマックス））
img	pokemon-form エンドポイントのスプライト情報（姿違いも含む）
abilities	日本語特性名の配列
types	日本語タイプ名の配列
forms	見た目だけ変わるフォルム情報の配列
{ formId, formName }
varieties	基本情報が変わるバリエーションの配列
{ formId, varietieName }
moves	日本語わざ名の配列