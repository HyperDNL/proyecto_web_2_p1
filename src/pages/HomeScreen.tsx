import React,{ useEffect, useState } from "react";
import axios from "axios";
import Pokemon from "../interfaces/PokemonInterface";
import Types from "../interfaces/TypesInterface";
import DescriptionPokemon from "../interfaces/DescriptionInterface";


export const HomeScreen = () => {

  const [pokemon, setPokemon] = useState<Pokemon>(); // Estado de la información general del Pokemon
  const [description, setDescription] = useState<DescriptionPokemon>(); // Estado que almacena las descripciones
  const [types, setTypes] = useState<Types[]>(); // Estado de la información de los tipos del Pokemon
  const [evolutionPokemon, setEvolutionPokemon] = useState<Pokemon[]>(); // Estado que almacena las evoluciones
  const [Loading, setLoading] = useState<boolean>(true); // Estado que almacena las evoluciones

  const getPokemon = async (search: string | number) => {
    const arrayTypes: Types[] = []; // Arreglo para guardar cada iteración de los tipos de cada Pokemon

    const [pokemonRes, speciesRes] = await Promise.all([
      axios
        .get(`https://pokeapi.co/api/v2/pokemon/${search}`)
        .then((res) => res.data)
        .catch((err) => console.log(err.message)),
      axios
        .get(`https://pokeapi.co/api/v2/pokemon-species/${search}`)
        .then((res) => res.data)
        .catch((err) => console.log(err.message)),
    ]); // Hace peticiones en cadena de forma Asíncrona

    setPokemon(pokemonRes); // Actualiza el estado de la información general del Pokemon

    pokemonRes?.types.map(async (value: any) => {
      await axios
        .get(value.type.url)
        .then((res) => arrayTypes.push(res.data))
        .catch((err) => console.log(err.message));
      setTypes([...arrayTypes]); // Actualiza el estado de los tipos conservando los valores de cada iteración
    });

    setDescription({ flavor_text_entries: speciesRes?.flavor_text_entries }); // Actualiza el estado con todas las descripciones

    const evoChainRes = await axios
      .get(speciesRes?.evolution_chain.url)
      .then((res) => res.data)
      .catch((err) => console.log(err.message)); // Petición para la cadena evolutiva

    const arrayEvolutions: Pokemon[] = []; // Arreglo que almacena las evoluciones

    const firstEvolution = await axios
      .get(
        `https://pokeapi.co/api/v2/pokemon/${evoChainRes?.chain.species.name}`
      )
      .then((res) => res.data)
      .catch((err) => console.log(err.message));
    arrayEvolutions.push(firstEvolution);
    setEvolutionPokemon([...arrayEvolutions]); // Se actualiza el estado de las evoluciones

    evoChainRes?.chain.evolves_to.map(async (value: any) => {
      await axios
        .get(`https://pokeapi.co/api/v2/pokemon/${value.species.name}`)
        .then((res) => arrayEvolutions.push(res.data))
        .catch((err) => console.log(err.message));
      setEvolutionPokemon([...arrayEvolutions]); // Se vuelve a actualizar el estado de las evoluciones
    });

    evoChainRes?.chain.evolves_to.map((value: any) =>
      value.evolves_to.map(async (value: any) => {
        await axios
          .get(`https://pokeapi.co/api/v2/pokemon/${value.species.name}`)
          .then((res) => arrayEvolutions.push(res.data))
          .catch((err) => console.log(err));
        setEvolutionPokemon([...arrayEvolutions]); // Se vuelve a actualizar el estado de las evoluciones
      })
    );
  }; // Hace la petición del Pokemon y regresa objetos con la información requerida

  /* useEffect(() => {
    getPokemon("pikachu"); // La función puede recibir un parámetro entero o string
  }, []); // Ejecuta la función que pide la información del Pokemon una vez
 */
 
  
  const movesOder = pokemon?.moves.sort((nameA , nameB) =>{
    if (nameA.move.name > nameB.move.name) return 1;
    if (nameA.move.name  < nameB.move.name) return -1;
    return 0;
  })  

  const damage = types?.map((value) => value.damage_relations)
  const _description = description?.flavor_text_entries.find(({language}) => language.name === 'es')

  const PokemonInterface = {
    id : pokemon?.id,
    name: pokemon?.name,
    description : _description?.flavor_text,
    Moves: movesOder,
    type : pokemon?.types,
    damage : damage,
    evolution : evolutionPokemon,   
    img : pokemon?.sprites.other.dream_world.front_default 
  }

  // Crear una función para buscar la descripción del Pokemon en español en el estado de "description"    

  // Crear una función que reestructure el arreglo con la información de la cadena evolutiva del Pokemon del estado "evolutionPokemon"
  const search = () => {
      getPokemon(Searchpokemon); // La función puede recibir un parámetro entero o string
  }
  const [Searchpokemon, setSearchPokemon] = useState<string>(''); // Estado de la información general del Pokemon
  return (
    <>                       
  
<div className="min-h-screen border border-red-100 text-lg text-white bg-red-600">
      
      <div className="flex justify-center m-8">
          <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg aria-hidden="true" className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </div>
          <div className="w-96">
            <input type="search" value={Searchpokemon} id="default-search" className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search your pokemon" onChange={event => {setSearchPokemon (event.target.value);}} required>
              </input>
              <button type="submit" className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" onClick={search}>Search</button>
          </div>
            
          </div>

      </div>
      <div className="flex justify-center m-8">
       <img src={PokemonInterface.img} alt="imagePokemon"></img>
      </div>
      <div className="flex justify-center m-8">
        <dl>
          <dt>Nombre</dt>
          <dd className="px-1.5 ring-1 ring-slate-200 rounded text-xl">{PokemonInterface.name}</dd>

          <dt>Tipo</dt>
          <dd className="px-1.5 ring-1 ring-slate-200 rounded text-xl">{PokemonInterface.type?.map(value => (
                <h1>{value.type.name}</h1>))}</dd>

          <dt>Descripcion</dt>
          <dd className="px-1.5 ring-1 ring-slate-200 rounded text-xl">{PokemonInterface.description}</dd>

          <dt>Movimientos</dt>
          <dd className="px-1.5 ring-1 ring-slate-200 rounded text-xl">{PokemonInterface.Moves?.map(value => (
                <h1>{value.move.name}</h1>))}</dd>

          <dt>Daños</dt>
          <dd className="px-1.5 ring-1 ring-slate-200 rounded text-xl">{PokemonInterface.damage?.map(value => (
                <div>
                  <h1>Doble de: {value.double_damage_from.map((value) => value.name + ', ')}</h1>
                    <h1>Dobel a: {value.double_damage_to.map((value) => value.name + ', ')}</h1>
                    <h1>Mitad de: {value.half_damage_from.map((value) => value.name + ', ')}</h1>
                    <h1>Mitad a: {value.half_damage_to.map((value) => value.name + ', ')}</h1>
                    <h1>Sin daño de: {value.no_damage_from.map((value) => value.name + ', ')}</h1>
                    <h1>Sin daño a: {value.no_damage_to.map((value) => value.name + ', ')}</h1>
                </div>))}</dd>

          <dt>Evolucion</dt>
          <dd className="px-1.5 ring-1 ring-slate-200 rounded text-xl">{ PokemonInterface.evolution?.map(value =>
            (<div>
                <h1>Nombre: {value.name}</h1>
                <h1>Tipos: {value.types.map((value) => value.type.name + ', ')}</h1>
                <img src={value.sprites.other.dream_world.front_default} alt="imagePokemon"></img>
                <br></br>
            </div>))}</dd>

        </dl>
    
      </div>
    </div>
    </>
  );
};
