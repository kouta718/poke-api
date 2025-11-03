import axios from 'axios';
import pokemonMap from '../../src/data/pokemon-map.json' assert { type: 'json' };

const instance = axios.create({
  baseURL: 'https://pokeapi.co/api/v2/',
  timeout: 5000,
});

// 日本語からIDに変換
export const getPokemonId = async (jpName) => {
  return pokemonMap[jpName] ?? null;
}

// 日本語取得
export const getPokemonData = async (id) => {
  try {
    // ポケモン基本データ
    const res = await instance.get(`pokemon-form/${id}`);
    const pokeRes = await instance.get(res.data.pokemon.url)
    const pokemon = pokeRes.data;

    // 名前
    const speciesRes = await instance.get(pokemon.species.url);
    const speciesId = speciesRes.data.id;
    const jpNameObj = speciesRes.data.names.find(n => n.language.name === "ja");
    let jpName = jpNameObj?.name ?? pokemon.name;

    // フォルム名
    const formNameObj =
      res.data.form_names.find(n => n.language.name === "ja") ??
      res.data.form_names.find(n => n.language.name === "ja-Hrkt") ??
      res.data.form_names.find(n => n.language.name === "en");
    let formName = formNameObj ? formNameObj.name : '';
    if (/gigantamax/i.test(formName)) {
      formName = `キョダイマックス`;
    }
    if (formName !== ""){
      jpName += ` (${formName})`;
    }

    // 画像
    const imgs = res.data.sprites; // 姿違いを取得するためにpokemon-formからエンドポイントをとる

    // 特性
    const jpAbilities = await Promise.all(
      pokemon.abilities.map(async a => {
        const abilityRes = await instance.get(a.ability.url);
        return abilityRes.data.names.find(n => n.language.name === "ja").name;
      })
    );

    // タイプ
    const jpTypes = await Promise.all(
      pokemon.types.map(async a => {
        const typeRes = await instance.get(a.type.url);
        return typeRes.data.names.find(n => n.language.name === "ja").name;
      })
    );

    // フォルム（見た目だけ変わるポケモン）
    const jpForms = (
      await Promise.all(
        pokemon.forms.map(async a => {
          const formRes = await instance.get(a.url);
          const formId = formRes.data.id;

          const formNameObj =
            formRes.data.form_names.find(n => n.language.name === "ja") ??
            formRes.data.form_names.find(n => n.language.name === "ja-Hrkt") ??
            formRes.data.form_names.find(n => n.language.name === "en");

          if (!formNameObj?.name) return null; // ← 🔹名前なければ捨てる

          return {
            formId,
            formName: formNameObj.name
          };
        })
      )
    ).filter(v => v !== null); // ← 🔹null除外


    // フォルム（基本情報が変わるポケモン）
    const jpVarieties = (
      await Promise.all(
        speciesRes.data.varieties.map(async v => {
          try {
            const varietiePokeRes = await instance.get(v.pokemon.url);

            // forms配列がない or 空なら破棄
            if (!varietiePokeRes.data.forms?.[0]?.url) return null;

            const formUrl = varietiePokeRes.data.forms[0].url;
            const formRes = await instance.get(formUrl);
            const formId = formRes.data.id;

            const varietieNameObj =
              formRes.data.form_names.find(n => n.language.name === "ja") ??
              formRes.data.form_names.find(n => n.language.name === "ja-Hrkt") ??
              formRes.data.form_names.find(n => n.language.name === "en");

            if (!varietieNameObj?.name) return null; // ← 🔹ないなら非表示

            return {
              formId,
              varietieName: varietieNameObj.name
            };
          } catch {
            return null; // ← 🔹APIエラー時破棄（メガ系の不整合対策）
          }
        })
      )
    ).filter(v => v !== null);

    const jpMoves = await Promise.all(
      pokemon.moves.map(async a => {
        const moveRes = await instance.get(a.move.url);
        return moveRes.data.names.find(n => n.language.name === "ja").name;
      })
    );

    return { data:pokemon, id: speciesId, name: jpName, img:imgs, abilities: jpAbilities, types: jpTypes, forms: jpForms, varieties: jpVarieties, moves: jpMoves};


  } catch (error) {
    console.error(error);
    alert("ポケモンが見つかりませんでした\n日本語（カタカナ）で入力してください");
  }
};
