import { Card } from './card';
import { Discard } from './discard';
import { Player } from './player';
export declare class Deck {
    order: Array<Card>;
    constructor();
    shuffle(): Card[];
    draw(): Card;
    drawTo(player: Player): Card[];
    dealTo(playersArray: Array<Player>): void;
    dealReplacementHandTo(player: Player, handLength: number): void;
    discardTo(discard: Discard): Card;
    readonly infoPublic: {
        length: number;
    };
}
//# sourceMappingURL=deck.d.ts.map