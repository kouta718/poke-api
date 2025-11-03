// 日本語とIDの変換用JSONファイル作成用
import axios from "axios";
import { writeFileSync } from "fs";

const instance = axios.create({
  baseURL: "https://pokeapi.co/api/v2/",
});

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const generatePokemonMap = async () => {
  try {
    const maxId = 1025; //SV（モモワロウ）まで

    const map = {};

    for (let id = 1; id <= maxId; id++) {
      // 日本語名
      const speciesRes = await instance.get(`pokemon-species/${id}`);
      const jpNameObj = speciesRes.data.names.find(n => n.language.name === "ja");
      const baseName = jpNameObj?.name ?? '';

      map[baseName] = id;

      // API制限対策で少し休憩（負荷軽減）
      await sleep(10);

      // 進捗確認
      if(id % 50 === 0){
        console.log(`✅ ${baseName} まで取得完了`);
      }
    }

    writeFileSync("./src/data/pokemon-map.json", JSON.stringify(map, null, 2));
    console.log("✅ ポケモンの日本語マップを生成しました！");
  } catch (err) {
    console.error("マップ生成エラー:", err.message);
  }
};

generatePokemonMap();
