import { Table } from "./table";
import { Deck } from "./deck";
import { Discard } from "./discard";
import { SpikeDice } from "./dice";
import { Player } from "./player";
var Game = (function () {
    function Game(playerCount) {
        if (isNaN(playerCount) || playerCount < 2 || playerCount > 8) {
            throw new Error("Invalid number of players (" + playerCount + "). Please select a number between 2 and 8.");
        }
        this.table = new Table();
        this.deck = new Deck();
        this.discard = new Discard();
        this.spikeDice = new SpikeDice();
        this.players = this.initializePlayers(playerCount);
        this.state = {
            currentWager: 0,
            phase: 'Setup',
            round: 0,
            turn: undefined,
            turnIndex: undefined
        };
    }
    ;
    Object.defineProperty(Game.prototype, "playerInfoPublic", {
        get: function () {
            return this.players.map(function (player) { return player.infoPublic; });
        },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(Game.prototype, "playerInfoPrivate", {
        get: function () {
            return this.players.map(function (player) { return player.infoPrivate; });
        },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(Game.prototype, "activePlayers", {
        get: function () {
            return this.players.filter(function (player) { return player.isActive; });
        },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(Game.prototype, "nextActivePlayerId", {
        get: function () {
            var _this = this;
            if (this.activePlayers.length === 1) {
                return this.activePlayers[0].id;
            }
            var currentPlayerIndex = this.players.findIndex(function (player) { return player.id === _this.state.turn; });
            for (var index = currentPlayerIndex + 1; index < this.players.length; index++) {
                if (this.players[index].isActive) {
                    return this.players[index].id;
                }
            }
            ;
            for (var index = 0; index < currentPlayerIndex; index++) {
                if (this.players[index].isActive) {
                    return this.players[index].id;
                }
            }
            ;
            throw new Error("Something went wrong. There are " + this.activePlayers.length + " active players.");
        },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(Game.prototype, "infoPublic", {
        get: function () {
            return {
                deck: this.deck.infoPublic,
                discard: this.discard.infoPublic,
                table: this.table.infoPublic,
                players: this.playerInfoPublic,
                game: this.state
            };
        },
        enumerable: true,
        configurable: true
    });
    ;
    Game.prototype.awardWinner = function () {
        var winnerScore = this.scoreActivePlayers()[0];
        var winner = this.players.find(function (player) { return player.id === winnerScore.id; });
        if (!winner) {
            throw new Error('Something went wrong, no winner found');
        }
        if (winnerScore.score.rank >= 10000000000000000) {
            this.table.sabaccPot.payOutTo(winner);
        }
        this.table.pot.payOutTo(winner);
        this.state.currentWager = 0;
        winner.currentWager = 0;
        return winner.infoPublic;
    };
    ;
    Game.prototype.initializePlayers = function (playerCount) {
        var players = [];
        for (var playerNumber = 1; playerNumber <= playerCount; playerNumber++) {
            var player = new Player("Player " + playerNumber, 250, this);
            players.push(player);
        }
        ;
        return players;
    };
    ;
    Game.prototype.scoreActivePlayers = function () {
        var playerIdsAndScores = this.activePlayers.map(function (player) {
            return {
                id: player.id,
                score: player.score
            };
        });
        return playerIdsAndScores.sort(function (a, b) { return (b.score.rank - a.score.rank); });
    };
    ;
    Game.prototype.start = function () {
        if (this.state.phase !== 'Setup') {
            throw new Error("Game is already started. Game phase: " + this.state.phase);
        }
        this.state.phase = 'Ante';
        this.state.round = 0;
        this.state.turn = this.players[0].id;
        this.state.turnIndex = 0;
        return this.state;
    };
    ;
    Game.prototype.continue = function () {
        var _this = this;
        var nextActivePlayerId = this.nextActivePlayerId;
        if (this.state.turn === nextActivePlayerId) {
            this.state.phase = 'Score';
            this.state.turn = undefined;
            this.state.turnIndex = undefined;
            return this.state;
        }
        if (this.state.phase === 'Ante') {
            if (this.players.findIndex(function (player) { return player.id === nextActivePlayerId; }) < this.players.findIndex(function (player) { return player.id === _this.state.turn; })) {
                this.state.phase = 'Shuffle';
                this.state.turn = undefined;
                this.state.turnIndex = undefined;
                return this.state;
            }
            this.state.turn = nextActivePlayerId;
            this.state.turnIndex = this.players.findIndex(function (player) { return player.id === _this.state.turn; });
            return this.state;
        }
        else if (this.state.phase === 'Shuffle') {
            this.state.phase = 'Deal';
            return this.state;
        }
        else if (this.state.phase === 'Deal') {
            this.state.round = 1;
            this.state.phase = 'Gain';
            this.state.turn = this.activePlayers[0].id;
            this.state.turnIndex = this.players.findIndex(function (player) { return player.id === _this.state.turn; });
            return this.state;
        }
        else if (this.state.phase === 'Gain') {
            if (this.players.findIndex(function (player) { return player.id === nextActivePlayerId; }) < this.players.findIndex(function (player) { return player.id === _this.state.turn; })) {
                this.state.phase = 'Spike';
                this.state.turn = undefined;
                this.state.turnIndex = undefined;
                return this.state;
            }
            this.state.turn = nextActivePlayerId;
            this.state.turnIndex = this.players.findIndex(function (player) { return player.id === _this.state.turn; });
            return this.state;
        }
        else if (this.state.phase === 'Spike') {
            this.state.phase = 'Wager';
            this.state.turn = this.activePlayers[0].id;
            this.state.turnIndex = this.players.findIndex(function (player) { return player.id === _this.state.turn; });
            return this.state;
        }
        else if (this.state.phase === 'Wager') {
            if (this.players.findIndex(function (player) { return player.id === nextActivePlayerId; }) < this.players.findIndex(function (player) { return player.id === _this.state.turn; })) {
                if (this.players.find(function (player) { return player.id === nextActivePlayerId; }).currentWager === this.state.currentWager) {
                    if (this.state.round === 3) {
                        this.state.phase = 'Score';
                        this.state.turn = undefined;
                        this.state.turnIndex = undefined;
                        return this.state;
                    }
                    else {
                        this.state.round = this.state.round + 1;
                        this.state.phase = 'Gain';
                        this.state.turn = nextActivePlayerId;
                        this.state.turnIndex = this.players.findIndex(function (player) { return player.id === _this.state.turn; });
                        return this.state;
                    }
                }
                else {
                    this.state.turn = nextActivePlayerId;
                    this.state.turnIndex = this.players.findIndex(function (player) { return player.id === _this.state.turn; });
                    return this.state;
                }
            }
            else {
                this.state.turn = nextActivePlayerId;
                this.state.turnIndex = this.players.findIndex(function (player) { return player.id === _this.state.turn; });
                return this.state;
            }
        }
        else if (this.state.phase === 'Score') {
            return this.state;
        }
        throw new Error("Something went wrong. The game phase is " + this.state.phase);
    };
    ;
    Game.prototype.end = function () {
        this.state.phase = 'Setup';
        this.state.round = 0;
        this.state.turn = undefined;
        this.state.turnIndex = undefined;
        this.discard.replaceToDeck(this.deck);
        for (var player = 0; player < this.players.length; player++) {
            this.players[player].isActive = true;
        }
        return this.state;
    };
    ;
    return Game;
}());
export { Game };
;
//# sourceMappingURL=game.js.map