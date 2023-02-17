interface Types {
  id: number;
  name: string;
  damage_relations: {
    no_damage_to: [
      {
        name: string;
      }
    ];
    half_damage_to: [
      {
        name: string;
      }
    ];
    double_damage_to: [
      {
        name: string;
      }
    ];
    no_damage_from: [
      {
        name: string;
      }
    ];
    half_damage_from: [
      {
        name: string;
      }
    ];
    double_damage_from: [
      {
        name: string;
      }
    ];
  };
}

export default Types;
