import React, { useEffect, useState } from "react";
import axios from "axios";
import Pokemon from "../interfaces/PokemonInterface";
import Types from "../interfaces/TypesInterface";
import DescriptionPokemon from "../interfaces/DescriptionInterface";


export const HomeScreen = () => {

  const [pokemon, setPokemon] = useState<Pokemon>(); // Estado de la información general del Pokemon
  const [description, setDescription] = useState<DescriptionPokemon>(); // Estado que almacena las descripciones
  const [types, setTypes] = useState<Types[]>(); // Estado de la información de los tipos del Pokemon
  const [evolutionPokemon, setEvolutionPokemon] = useState<Pokemon[]>(); // Estado que almacena las evoluciones

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

  useEffect(() => {
    getPokemon("bronzong"); // La función puede recibir un parámetro entero o string
  }, []); // Ejecuta la función que pide la información del Pokemon una vez

 
  
  const movesOder = pokemon?.moves.sort((nameA , nameB) =>{
    if (nameA.move.name > nameB.move.name) return 1;
    if (nameA.move.name  < nameB.move.name) return -1;
    return 0;
  })  

  const damage = types?.map((value) => value.damage_relations)
  const descrption = description?.flavor_text_entries.find(({language}) => language.name === 'es')
  
  const PokemonInterface = {
    id : pokemon?.id,
    name: pokemon?.name,
    description : descrption?.flavor_text,
    Moves: movesOder,
    type : pokemon?.types,
    damage : damage,
    evolution : evolutionPokemon,   
    img : pokemon?.sprites.other.dream_world.front_default 
  }



  // Crear una función para buscar la descripción del Pokemon en español en el estado de "description"    

  // Crear una función que reestructure el arreglo con la información de la cadena evolutiva del Pokemon del estado "evolutionPokemon"

  return (
    <>                       
           <br></br>
         
          <h1>{PokemonInterface.description}</h1>         
    </>
  );
};
