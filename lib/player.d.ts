import { Card } from "./card";
import { Game } from "./game";
export declare class Player {
    id: string;
    credits: number;
    hand: Array<Card>;
    currentWager: number;
    isActive: boolean;
    wagerAction: {
        ante: () => void;
        matchCurrentWager: () => void;
        matchAndRaiseCurrentWagerByCredits: (credits: number) => void;
        fold: () => void;
    };
    turnAction: {};
    constructor(id: string, credits: number, game: Game);
    private payByPotAndCredits;
    readonly score: {
        name: string;
        rank: number;
    };
    readonly infoPrivate: {
        id: string;
        hand: Card[];
        score: string;
        isActive: boolean;
        currentWager: number;
        credits: number;
    };
    readonly infoPublic: {
        id: string;
        hand: string;
        isActive: boolean;
        currentWager: number;
        credits: number;
    };
}
//# sourceMappingURL=player.d.ts.map