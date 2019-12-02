import { Player } from "./player";
export interface IPot {
    credits: number;
    payOutTo: (player: Player) => number;
}
export declare class Table {
    pot: IPot;
    sabaccPot: IPot;
    constructor();
    readonly infoPublic: {
        pot: {
            credits: number;
        };
        sabbaccPot: {
            credits: number;
        };
    };
}
//# sourceMappingURL=table.d.ts.map