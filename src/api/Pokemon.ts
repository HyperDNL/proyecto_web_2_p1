import axios from "axios";

export const getPokemonRequests = async (
  pokemon: string | number = "pikachu"
) => await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);

export const getPokemonTypesRequests = async (type: string) =>
  await axios.get(`https://pokeapi.co/api/v2/type/${type}`);
