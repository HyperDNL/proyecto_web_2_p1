import React, { useState } from "react";
import axios from "axios";
import Pokemon from "../interfaces/PokemonInterface";
import Types from "../interfaces/TypesInterface";
import DescriptionPokemon from "../interfaces/DescriptionInterface";
import { useNavigate } from "react-router-dom";
import { Loader } from "../components/Loader";

export const HomeScreen = () => {
  const [pokemon, setPokemon] = useState<Pokemon>();
  const [description, setDescription] = useState<DescriptionPokemon>();
  const [types, setTypes] = useState<Types[]>();
  const [evolutionPokemon, setEvolutionPokemon] = useState<Pokemon[]>();
  const [searchPokemon, setSearchPokemon] = useState<string | number>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoadedData, setIsLoadedData] = useState<boolean>(false);

  const navigate = useNavigate();

  const getPokemon = async (search: string | number) => {
    const arrayTypes: Types[] = [];

    await axios
      .get(`https://pokeapi.co/api/v2/pokemon/${search}`)
      .then(async (pokemonRes) => {
        pokemonRes?.data.types.map(async (value: any) => {
          await axios
            .get(value?.type.url)
            .then((res) => arrayTypes.push(res.data))
            .catch((err) => console.log(err));
          setTypes([...arrayTypes]);
        });

        await axios
          .get(`https://pokeapi.co/api/v2/pokemon-species/${search}`)
          .then(async (speciesRes) => {
            await axios
              .get(speciesRes?.data.evolution_chain.url)
              .then(async (evoChainRes) => {
                const arrayEvolutions: Pokemon[] = [];

                const firstEvolution = await axios
                  .get(
                    `https://pokeapi.co/api/v2/pokemon/${evoChainRes?.data.chain.species.name}`
                  )
                  .then((res) => res.data)
                  .catch((err) => console.log(err));
                arrayEvolutions.push(firstEvolution);
                setEvolutionPokemon([...arrayEvolutions]);

                evoChainRes?.data.chain.evolves_to.map(async (value: any) => {
                  await axios
                    .get(
                      `https://pokeapi.co/api/v2/pokemon/${value.species.name}`
                    )
                    .then((res) => arrayEvolutions.push(res.data))
                    .catch((err) => console.log(err));
                  setEvolutionPokemon([...arrayEvolutions]);
                });

                evoChainRes?.data.chain.evolves_to.map((value: any) =>
                  value.evolves_to.map(async (value: any) => {
                    await axios
                      .get(
                        `https://pokeapi.co/api/v2/pokemon/${value.species.name}`
                      )
                      .then((res) => arrayEvolutions.push(res.data))
                      .catch((err) => console.log(err));
                    setEvolutionPokemon([...arrayEvolutions]);
                  })
                );
                setIsLoading(false);
                setIsLoadedData(true);
              });
            setDescription({
              flavor_text_entries: speciesRes?.data.flavor_text_entries,
            });
          });
        setPokemon(pokemonRes.data);
      })
      .catch(() => navigate("/not-found"));
  };

  const orderedMoves = pokemon?.moves.sort(({ move: nameA }, { move: nameB }) =>
    nameA.name.localeCompare(nameB.name)
  );

  const _description = description?.flavor_text_entries.find(
    ({ language }) => language.name === "es"
  );

  const pokemonData = {
    id: pokemon?.id,
    name: pokemon?.name,
    img: pokemon?.sprites.other.dream_world.front_default,
    description: _description?.flavor_text,
    moves: orderedMoves,
    type: pokemon?.types,
    damage: types,
    evolution: evolutionPokemon,
  };

  const search = () => {
    getPokemon(searchPokemon);
    setIsLoading(true);
  };

  return (
    <div className="h-full text-lg text-white">
      <div className="flex justify-center m-8">
        <label
          htmlFor="default-search"
          className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
        >
          Search
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg
              aria-hidden="true"
              className="w-5 h-5 text-gray-500 dark:text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
          </div>
          <div className="w-96">
            <input
              type="search"
              value={searchPokemon}
              id="default-search"
              className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Encuentra a tu Pokemon"
              onChange={(event) => {
                setSearchPokemon(event.target.value);
              }}
              required
            ></input>
            <button
              type="submit"
              className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              onClick={search}
            >
              Buscar
            </button>
          </div>
        </div>
      </div>
      {isLoadedData ? (
        !isLoading ? (
          <>
            <div className="flex justify-center m-8">
              <img src={pokemonData.img} alt="imagePokemon"></img>
            </div>
            <div className="flex justify-center m-8">
              <dl>
                <dt>Nombre</dt>
                <dd className="px-1.5 ring-1 ring-slate-200 rounded text-xl">
                  {pokemonData.name}
                </dd>

                <dt className="mt-2">Tipo(s)</dt>
                <dd className="px-1.5 ring-1 ring-slate-200 rounded text-xl">
                  {pokemonData.type?.map((value, i) => (
                    <h1 key={i}>{value.type.name}</h1>
                  ))}
                </dd>

                <dt className="mt-2">Descripción</dt>
                <dd className="px-1.5 ring-1 ring-slate-200 rounded text-xl">
                  {pokemonData.description}
                </dd>

                <dt className="mt-2">Movimientos</dt>
                <dd className="px-1.5 ring-1 ring-slate-200 rounded text-xl">
                  {pokemonData.moves?.map((value, i) => (
                    <h1 key={i}>{value.move.name}</h1>
                  ))}
                </dd>

                <dt className="mt-2">Daños</dt>
                <dd className="px-1.5 ring-1 ring-slate-200 rounded text-xl">
                  {pokemonData.damage?.map((value, i) => (
                    <div key={i}>
                      <h1>El tipo: {value.name}</h1>
                      <h1>
                        Causa el doble de daño a:{" "}
                        {value.damage_relations.double_damage_to.map(
                          (value) => `${value.name}, `
                        )}
                      </h1>
                      <h1>
                        Recibe el doble de daño de:{" "}
                        {value.damage_relations.double_damage_from.map(
                          (value) => `${value.name}, `
                        )}
                      </h1>
                      <h1>
                        Causa la mitad de daño a:{" "}
                        {value.damage_relations.half_damage_to.map(
                          (value) => `${value.name}, `
                        )}
                      </h1>
                      <h1>
                        Recibe la mitad de daño de:{" "}
                        {value.damage_relations.half_damage_from.map(
                          (value) => `${value.name}, `
                        )}
                      </h1>
                      <h1>
                        No causa daño a:{" "}
                        {value.damage_relations.no_damage_to.map(
                          (value) => `${value.name}, `
                        )}
                      </h1>
                      <h1>
                        No recibe daño de:{" "}
                        {value.damage_relations.no_damage_from.map(
                          (value) => `${value.name}, `
                        )}
                      </h1>
                    </div>
                  ))}
                </dd>
                <dt className="mt-2">Cadena Evolutiva</dt>
                {pokemonData.evolution?.map((value, i) => (
                  <dd
                    key={i}
                    className="px-1.5 ring-1 ring-slate-200 rounded text-xl"
                  >
                    <dt className="mt-2">Nombre</dt>
                    <dd className="px-1.5 ring-1 ring-slate-200 rounded text-xl">
                      {value.name}
                    </dd>
                    <dt className="mt-2">Tipo(s)</dt>
                    <dd className="px-1.5 ring-1 ring-slate-200 rounded text-xl">
                      {value.types.map((value) => (
                        <h1>{value.type.name}</h1>
                      ))}
                    </dd>
                    <div className="flex justify-center m-8">
                      <img
                        src={value.sprites.other.dream_world.front_default}
                        alt="imagePokemon"
                      />
                    </div>
                    <br></br>
                  </dd>
                ))}
              </dl>
            </div>
          </>
        ) : (
          <div className="flex justify-center align-center">
            <Loader />
          </div>
        )
      ) : null}
    </div>
  );
};
