export class SpikeDice {
  public roll() {
    const rollOne = Math.floor((Math.random() * 6) + 1);
    const rollTwo = Math.floor((Math.random() * 6) + 1);
    return {
      spikeDiceMatch: rollOne === rollTwo,
      rollOne: rollOne,
      rollTwo: rollTwo
    };
  };
};
