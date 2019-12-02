'use strict';

import { Card } from './card';
import { Discard } from './discard';
import { Player } from './player';

export class Deck {
  public order: Array<Card>
  constructor() {
    this.order = [
      new Card(0, '0SilopA'),
      new Card(0, '0SilopB'),
    ];

    const staves = [
      'Triangle',
      'Circle',
      'Square'
    ];

    staves.map((stave)=>{
      for (let value = 1; value <= 10; value++) {
        this.order.push(new Card(value, `${value}${stave}`));
      };
    });

    staves.map((stave)=>{
      for (let value = -1; value >= -10; value--) {
        this.order.push(new Card(value, `${value}${stave}`));
      };
    });
  };

  public shuffle() {
    for (let i = this.order.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [this.order[i], this.order[j]] = [this.order[j], this.order[i]];
    };
    return this.order;
  };

  public draw() {
    if (this.order.length < 1) {
      throw new Error('Deck is empty\n');
    }
    return this.order.pop()!;
  };

  public drawTo(player: Player) {
    player.hand.push(this.draw());
    return player.hand;
  };

  public dealTo(playersArray: Array<Player>) {
    for (let card = 0; card < 2; card++) {
      for (let player = 0; player < playersArray.length; player++) {
        this.drawTo(playersArray[player]);
      };
    };
  };

  public dealReplacementHandTo(player: Player, handLength: number) {
    for (let card = 0; card < handLength; card++) {
      this.drawTo(player);
    };
  };

  public discardTo(discard: Discard) {
    discard.order.push(this.draw());
    return discard.top;
  };

  public get infoPublic() {
    return {
      length: this.order.length,
    };
  };
};
