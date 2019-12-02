import { Player } from "./player";

export interface IPot {
  credits: number;
  payOutTo: (player: Player)=>number;
}

export class Table {
  public pot: IPot;
  public sabaccPot: IPot;
  constructor() {
    this.pot = {
      credits: 0,
      payOutTo: (player) => {
        player.credits = player.credits + this.pot.credits;
        this.pot.credits = 0;
        return player.credits;
      },
    };
    this.sabaccPot = {
      payOutTo: (player) => {
        player.credits = player.credits + this.sabaccPot.credits;
        this.sabaccPot.credits = 0;
        return player.credits;
      },
      credits: 0
    };
  };
  public get infoPublic() {
    return {
      pot: { credits: this.pot.credits },
      sabbaccPot: { credits: this.sabaccPot.credits }
    };
  };
};
