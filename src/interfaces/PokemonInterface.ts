export default interface Pokemon {
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
  moves: [
    {
      move: {
        name: string;
      };
    }
  ];
  sprites: {
    other: {
      dream_world: {
        front_default: string;
      };
    };
  };
}
