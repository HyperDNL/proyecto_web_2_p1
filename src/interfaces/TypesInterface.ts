export default interface Types {
  name: string;
  damage_relations: {
    no_damage_to: DamageName[];
    half_damage_to: DamageName[];
    double_damage_to: DamageName[];
    no_damage_from: DamageName[];
    half_damage_from: DamageName[];
    double_damage_from: DamageName[];
  };
}

interface DamageName {
  name: string;
}
