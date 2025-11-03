# pokeAPIメモ

---

> ベースURL
> 
> 
> `https://pokeapi.co/api/v2/`
> 

---

## 概要

このメモでは、ポケモン検索アプリで使用した PokéAPI のデータ構造や取得方法 を整理しています。
API から取得できる情報のうち、ポケモン個体情報に関する部分に絞ってまとめています。

※ 本メモの内容のうち、アプリで実際に使用したのは一部です。

| エンドポイント | 内容 | 特徴 |
| --- | --- | --- |
| `/pokemon` | ポケモンの基本情報 | 英語のみ。図鑑的データを取得。 |
| `/pokemon-species` | 種別情報 | 多言語対応。進化・分類・説明など。 |
| `/pokemon-form` | フォルム情報 | 姿・形違いのデータ。 |

---

## `/pokemon/{id or name}`

> 全国図鑑ベースの基本情報。英語データ中心。
> 
> 
> 多言語情報を取得したい場合は `/pokemon-species` へ。
> 

### 主な項目

| 項目 | 内容 |
| --- | --- |
| `id` | 全国図鑑番号（姿違い含む） |
| `name` | 英語名（小文字） |
| `abilities` | 特性データ。`is_hidden: true` なら夢特性。 |
| `types` | タイプ情報 |
| `stats` | 種族値（HP・攻撃・防御など） |
| `moves` | 覚える技リスト |
| `game_indices` | 各シリーズの内部インデックス |
| `forms` | ステータスが同一の姿違い一覧（URL配列） |
| `species` | 種別データ（多言語など）のURL |
| `sprites` | 各種画像（下記参照） |
| `cries` | 鳴き声（音声URL） |

### `moves` の補足

| プロパティ | 内容 |
| --- | --- |
| `level_learned_at` | レベルで覚える場合はレベル値、それ以外は 0 |
| `move_learn_method.name` | 技の習得方法（下表参照） |

| name | 意味 |
| --- | --- |
| level-up | レベルアップで習得 |
| machine | わざマシン |
| egg | タマゴ技 |
| tutor | 技教え |
| form-change | フォルム変化で習得 |

### `sprites` の構成

| key | 内容 |
| --- | --- |
| `dream_world` | SVGイラスト |
| `home` | 3Dモデル風イラスト |
| `official-artwork` | 高画質公式アート |
| `showdown` | アニメGIF（対戦用） |

画像の向きと色違い：

- `front_default`：通常の前向き画像
- `front_shiny`：色違いの前向き画像
- `back_default`：通常の後ろ向き画像
- `back_shiny`：色違いの後ろ向き画像

---

## `/pokemon-species/{id or name}`

> 多言語・分類・進化などを扱う「種別情報」。
> 
> 
> `/pokemon` では取得できない図鑑説明などを含む。
> 

### 主な項目

| 項目 | 内容 |
| --- | --- |
| `id` | 全国図鑑番号（フォルム違いは対象外） |
| `name` | 英語名 |
| `names` | 多言語名（日本語など） |
| `flavor_text_entries` | 図鑑説明（バージョン別） |
| `genera` | 「○○ポケモン」の分類（多言語対応） |
| `generation` | 登場世代（例：generation-iii） |
| `varieties` | 種内のフォルム一覧（ステータスが異なる場合あり） |
| `pokedex_numbers` | 各地方の図鑑番号 |
| `evolution_chain` | 進化情報のURL |

### `names`などの多言語対応データの取得できる言語

各言語は `language.name` プロパティに2文字コードで指定されます。

---

## ■ 言語一覧（9種類）

| コード | 言語名 | 日本語表記 | 備考・特徴 |
| --- | --- | --- | --- |
| `ja` | Japanese | 日本語 | 通常の日本語データ。`names`や`genera`などで多く使う。 |
| `ja-Hrkt` | Japanese (Hiragana/Katakana) | 日本語（カタカナ） | 図鑑説明などに多い。`flavor_text_entries`ではこちらが主。 |
| `en` | English | 英語 | ベース言語。API内部構造でもメイン基準。 |
| `fr` | French | フランス語 | 欧州向けデータ。 |
| `de` | German | ドイツ語 | 欧州向けデータ。 |
| `es` | Spanish | スペイン語 | 南欧・中南米向け。 |
| `it` | Italian | イタリア語 | 欧州向けデータ。 |
| `ko` | Korean | 韓国語 | 東アジア向け。 |
| `zh-Hant` | Chinese (Traditional) | 中国語（繁体字） | 台湾・香港向け。 |
| `zh-Hans` | Chinese (Simplified) | 中国語（簡体字） | 中国本土向け。 |

> PokeAPIで安定して取得できるのはこの9種
> 
> 
> `ja` と `ja-Hrkt` は別の扱いなので区別が必要です。
> 

---

## `/pokemon-form/{id or name}`

> 同じポケモンでも姿・形が異なる「フォーム情報」。
> 
> 
> 例：ロトム（ヒートロトムなど）、カラナクシ（ひがしのすがた）など。
> 

### 主な項目

| 項目 | 内容 |
| --- | --- |
| `id` | `/pokemon` とは異なるID体系（フォーム登録順） |
| `name` | 英語名 |
| `form_name` | フォルムの英語名（通常は null） |
| `form_names` | 多言語のフォルム名（通常は null） |
| `pokemon` | 対応する `/pokemon/{id}` のURL |
| `sprites` | フォルム画像（公式アートは含まれない） |
| `types` | タイプ情報 |
| `version_group` | 登場したゲームバージョン群 |

---

## IDの違いまとめ

| 種類 | 内容 | IDの扱い |
| --- | --- | --- |
| `pokemon` | 図鑑＋フォルム込み | 10001以降に姿違いIDあり |
| `species` | 図鑑番号（フォルムなし） | 全国図鑑基準 |
| `form` | フォルム登録順 | 他のIDと一致しない場合あり |

例：ヒートロトムの場合

- `/pokemon/10008`
- `/pokemon-species/479`（ロトム本体）
- `/pokemon-form/10058`

---

## 関連の流れ例

```
/pokemon/{id}
  └── species.url → /pokemon-species/{id}
       ├── evolution_chain.url → 進化データ
       ├── varieties → 他フォーム一覧
       └── names → 多言語名

```

---

---

## 探索のコツ

- 各データには `url` プロパティが含まれており、そこから関連データを再帰的に取得できる。
- 構造はフォルダ階層に似ており、「上位（species）」→「下位（form）」の関係をたどると理解しやすい。

---

### 備考

- `species` → `pokemon` → `form` の順に詳細化される構造。
- ロトムのようにフォームごとにタイプや画像が違う場合は、`form` を参照する。
- 多言語データ（日本語名など）は `species` の `names` に格納されている。
=======
# pokeapi-raid
>>>>>>> parent of 4b722b1 (no message)
