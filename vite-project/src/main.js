import "./style.css";

import { getPokemonId, getPokemonData } from "./modules/api.js";
import { extractData, showData } from "./modules/data.js";

const getInputName = (e) => {
  const form = new FormData(e.target);
  const pokeName = form.get("pokeName")?.trim().toLowerCase();
  return pokeName;
};

const submitHandler = async (e) => {
  e.preventDefault();
  const inputName = getInputName(e);
  const PokemonId = await getPokemonId(inputName);
  const pokemonData = await getPokemonData(PokemonId);
  const extractedData = await extractData(pokemonData);
  showData(extractedData);
};

document
  .querySelector("#js-form")
  .addEventListener("submit", (e) => submitHandler(e));
