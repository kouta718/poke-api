import { getPokemonData } from "./api.js";

export const extractData = (pokemonData) => {

  const id = pokemonData.id;
  const name = pokemonData.name;
  const forms = pokemonData.forms;
  const varieties = pokemonData.varieties;
  const defaultImg = pokemonData.img.front_default;
  const shinyImg = pokemonData.img.front_shiny;
  const types = pokemonData.types;
  const abilities = pokemonData.abilities;
  const stats = {};
    pokemonData.data.stats.forEach(st => { stats[st.stat.name] = st.base_stat; });
  const moves = pokemonData.moves;

  return {id, name, forms, varieties, defaultImg, shinyImg, types, abilities, stats, moves};
};

export const showData = async (data) => {

  // 特性と技のドロップダウンを作成
  const abilitiesOptions = data.abilities
    .map(abilities => `<option value="${abilities}">${abilities}</option>`)
    .join("");
  const moveOptions = data.moves
    .map(move => `<option value="${move}">${move}</option>`)
    .join("");

  const htmlData = `<dl>
    <dt>図鑑番号: ${data.id}</dt>
    <dt>名前: ${data.name}</dt>
    <dd>
      <div>
        <label for="form-select">フォルム:</label>
        <select id="form-select" name="form"></select>
      </div>
    </dd>
    <dd><img src="${data.defaultImg}" alt=""><img src="${data.shinyImg}" alt=""></dd>
    <dd>タイプ: ${data.types}</dd>
    <dd>
      特性:
      <select id="abilities-select">
        ${abilitiesOptions}
      </select>
    </dd>
    <dd>種族値:
      H: ${data.stats.hp},
      A: ${data.stats.attack},
      B: ${data.stats.defense},
      C: ${data.stats["special-attack"]},
      D: ${data.stats["special-defense"]},
      S: ${data.stats.speed}
    </dd>
    <dd>
      技一覧:
      <select id="move-select">
        ${moveOptions}
      </select>
    </dd>
  </dl>`
  document.querySelector("#js-result").innerHTML = htmlData;

  // フォルム切り替え
  const select = document.getElementById("form-select");

  // 選択肢を追加(なぜかformとvariationのどちらかに姿が入ってる)
  data.forms.forEach((form, index) => {
    const option = document.createElement("option");
    option.value = form.formId;           // ← valueにIDを入れる
    option.textContent = form.formName;   // ← 表示名
    select.appendChild(option);
  });

  data.varieties.forEach((varietie, index) => {
    if ([...select.options].some(opt => opt.value == varietie.formId)) return; // ← 重複回避
    // 通常のフォルムを除外
    if (varietie.varietieName === "" && index === 0) return;
    const option = document.createElement("option");
    // キョダイマックスは日本語表記がない
    if (/gigantamax/i.test(varietie.varietieName)) {
      varietie.varietieName = `キョダイマックス`;
    }
    option.value = varietie.formId;           // ← valueにIDを入れる
    option.textContent = varietie.varietieName;   // ← 表示名
    select.appendChild(option);
  });

  // 🔹 選ばれたらIDを返す
  select.addEventListener("change", async (e)=> {
    const selectedId = e.target.value;

    // データを再取得
    const newData = await getPokemonData(selectedId);

    // データ抽出＆再表示
    const data = extractData(newData);
    await showData(data);
  });
}