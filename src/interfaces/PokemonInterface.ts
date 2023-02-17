interface Pokemon {
  id: number;
  name: string;
  types: [
    {
      slot: number;
      type: {
        name: string;
        url: string;
      };
    }
  ];
  abilities: [
    {
      slot: number;
      ability: {
        name: string;
      };
    }
  ];
}

export default Pokemon;
