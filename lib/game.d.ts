import { Table } from "./table";
import { Deck } from "./deck";
import { Discard } from "./discard";
import { SpikeDice } from "./dice";
import { Player } from "./player";
export declare type TGamePhase = 'Setup' | 'Ante' | 'Shuffle' | 'Deal' | 'Gain' | 'Spike' | 'Wager' | 'Score';
export declare class Game {
    table: Table;
    deck: Deck;
    discard: Discard;
    spikeDice: SpikeDice;
    players: Array<Player>;
    state: {
        currentWager: number;
        phase: TGamePhase;
        round: number;
        turn: string | undefined;
        turnIndex: number | undefined;
    };
    constructor(playerCount: number);
    readonly playerInfoPublic: {
        id: string;
        hand: string;
        isActive: boolean;
        currentWager: number;
        credits: number;
    }[];
    readonly playerInfoPrivate: {
        id: string;
        hand: import("./card").Card[];
        score: string;
        isActive: boolean;
        currentWager: number;
        credits: number;
    }[];
    readonly activePlayers: Player[];
    readonly nextActivePlayerId: string;
    readonly infoPublic: {
        deck: {
            length: number;
        };
        discard: {
            length: number;
            topCard: import("./card").Card;
        };
        table: {
            pot: {
                credits: number;
            };
            sabbaccPot: {
                credits: number;
            };
        };
        players: {
            id: string;
            hand: string;
            isActive: boolean;
            currentWager: number;
            credits: number;
        }[];
        game: {
            currentWager: number;
            phase: TGamePhase;
            round: number;
            turn: string | undefined;
            turnIndex: number | undefined;
        };
    };
    awardWinner(): {
        id: string;
        hand: string;
        isActive: boolean;
        currentWager: number;
        credits: number;
    };
    initializePlayers(playerCount: number): Player[];
    scoreActivePlayers(): {
        id: string;
        score: {
            name: string;
            rank: number;
        };
    }[];
    start(): {
        currentWager: number;
        phase: TGamePhase;
        round: number;
        turn: string | undefined;
        turnIndex: number | undefined;
    };
    continue(): {
        currentWager: number;
        phase: TGamePhase;
        round: number;
        turn: string | undefined;
        turnIndex: number | undefined;
    };
    end(): {
        currentWager: number;
        phase: TGamePhase;
        round: number;
        turn: string | undefined;
        turnIndex: number | undefined;
    };
}
//# sourceMappingURL=game.d.ts.map