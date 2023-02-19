export default interface Types {
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
