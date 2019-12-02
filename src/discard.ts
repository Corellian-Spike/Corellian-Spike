import { Card } from "./card";
import { Deck } from './deck';
import { Player } from "./player";

export class Discard {
  order: Array<Card>
  constructor() {
    this.order = [];
  }

  public draw() {
    if (this.order.length < 1) {
      throw new Error('Discard is empty\n');
    }
    return this.order.pop()!;
  };

  public drawTo(player: Player) {
    player.hand.push(this.draw());
    return player.hand;
  };

  public replaceToDeck(deck: Deck) {
    deck.order = [...deck.order, ...this.order];
    this.order = [];
  };

  public get top() {
    return this.order[this.order.length-1];
  };

  public get infoPublic() {
    return {
      length: this.order.length,
      topCard: this.top
    };
  };
};
