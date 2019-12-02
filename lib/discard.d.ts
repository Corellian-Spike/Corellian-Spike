import { Card } from "./card";
import { Deck } from './deck';
import { Player } from "./player";
export declare class Discard {
    order: Array<Card>;
    constructor();
    draw(): Card;
    drawTo(player: Player): Card[];
    replaceToDeck(deck: Deck): void;
    readonly top: Card;
    readonly infoPublic: {
        length: number;
        topCard: Card;
    };
}
//# sourceMappingURL=discard.d.ts.map