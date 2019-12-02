var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var Player = (function () {
    function Player(id, credits, game) {
        var _this = this;
        this.id = id;
        this.credits = credits;
        this.hand = [];
        this.wagerAction = {
            ante: function () {
                _this.payByPotAndCredits(game.table.sabaccPot, 20);
                _this.payByPotAndCredits(game.table.pot, 10);
            },
            matchCurrentWager: function () {
                if (_this.currentWager < game.state.currentWager) {
                    var difference = game.state.currentWager - _this.currentWager;
                    _this.payByPotAndCredits(game.table.pot, difference);
                    _this.currentWager = game.state.currentWager;
                }
            },
            matchAndRaiseCurrentWagerByCredits: function (credits) {
                _this.payByPotAndCredits(game.table.pot, credits);
            },
            fold: function () {
                _this.isActive = false;
            }
        };
        this.turnAction = {
            buyCardFromDeck: function () {
                _this.payByPotAndCredits(game.table.pot, 10);
                game.deck.drawTo(_this);
            },
            buyCardFromDiscard: function () {
                _this.payByPotAndCredits(game.table.pot, 20);
                game.discard.drawTo(_this);
            },
            swapCardFromDeckByHandIndex: function (handIndex) {
                var oldCard = __assign({}, _this.hand[handIndex]);
                var newCard = game.deck.draw();
                _this.hand[handIndex] = newCard;
                game.discard.order.push(oldCard);
            },
            swapCardFromDiscardByHandIndex: function (handIndex) {
                var oldCard = __assign({}, _this.hand[handIndex]);
                var newCard = game.discard.draw();
                _this.hand[handIndex] = newCard;
                game.discard.order.push(oldCard);
            },
        };
        this.currentWager = 0;
        this.isActive = true;
    }
    ;
    Player.prototype.payByPotAndCredits = function (pot, credits) {
        this.credits = this.credits - credits;
        pot.credits = pot.credits + credits;
    };
    Object.defineProperty(Player.prototype, "score", {
        get: function () {
            var score = {
                name: '',
                rank: 0,
            };
            if (this.hand.length < 2) {
                return score;
            }
            if (this.hand.length > 5) {
                return score;
            }
            var handValues = this.hand.map(function (card) { return card.value; });
            handValues.sort(function (a, b) { return (a - b); });
            var sum = handValues.reduce(function (currentSum, value) { return currentSum + value; }, 0);
            var criteria = {
                isSabacc: sum === 0 ? 1 : 0,
                sabaccBonus: 0,
                pairBonus: 0,
                secondPairBonus: 0,
                runBonus: 0,
                nulhrekBonus: 48 - Math.abs(sum),
                isPositive: sum > 0 ? 1 : 0,
                numberOfCards: this.hand.length,
                positiveSum: handValues.reduce(function (currentSum, value) { return (value > 0) ? currentSum + value : currentSum; }, 0),
                highestPositiveCard: handValues[handValues.length - 1] > 0 ? handValues[handValues.length - 1] : 0,
            };
            if (criteria.isSabacc) {
                var sabaccValues = handValues.map(function (card) { return Math.abs(card); });
                var frequencies_1 = sabaccValues.reduce(function (frequencyArray, value) {
                    frequencyArray[value] = frequencyArray[value] + 1;
                    return frequencyArray;
                }, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
                var findRun = function () {
                    for (var c = 3; c < frequencies_1.length; c++) {
                        if (frequencies_1[c - 3] === frequencies_1[c - 2] &&
                            frequencies_1[c - 2] === frequencies_1[c - 1] &&
                            frequencies_1[c - 1] === frequencies_1[0]) {
                            return c;
                        }
                    }
                    ;
                    return 0;
                };
                if (JSON.stringify(frequencies_1) === '[2,0,0,0,0,0,0,0,0,0,0]') {
                    score.name = "Pure Sabacc";
                    criteria.sabaccBonus = 15;
                }
                else if (JSON.stringify(frequencies_1) === '[1,0,0,0,0,0,0,0,0,0,4]') {
                    score.name = "Full Sabacc";
                    criteria.sabaccBonus = 14;
                }
                else if (frequencies_1.indexOf(4) > 0 && frequencies_1[0] > 0) {
                    score.name = "Fleet of " + frequencies_1.indexOf(4) + "s";
                    criteria.sabaccBonus = 13;
                    criteria.pairBonus = frequencies_1.indexOf(4);
                }
                else if (frequencies_1.indexOf(2) > 0 && frequencies_1.indexOf(2, frequencies_1.indexOf(2) + 1) > 0 && frequencies_1[0] > 0) {
                    score.name = "Dual Power Coupling of " + frequencies_1.indexOf(2) + "s & " + frequencies_1.indexOf(2, frequencies_1.indexOf(2) + 1) + "s";
                    criteria.sabaccBonus = 12;
                    criteria.pairBonus = frequencies_1.indexOf(2);
                    criteria.secondPairBonus = frequencies_1.indexOf(2, frequencies_1.indexOf(2) + 1);
                }
                else if (frequencies_1.indexOf(2) > 0 && frequencies_1[0] > 0) {
                    score.name = "Power Coupling (Yee-Haa) of " + frequencies_1.indexOf(2) + "s";
                    criteria.sabaccBonus = 11;
                    criteria.pairBonus = frequencies_1.indexOf(2);
                    criteria.secondPairBonus = frequencies_1.indexOf(2, frequencies_1.indexOf(2) + 1);
                }
                else if (frequencies_1.indexOf(3) > 0 && frequencies_1.indexOf(2, frequencies_1.indexOf(3) + 1) > 0) {
                    score.name = "Rhylet of " + frequencies_1.indexOf(3) + "s & " + frequencies_1.indexOf(2, frequencies_1.indexOf(3) + 1) + "s";
                    criteria.sabaccBonus = 10;
                    criteria.pairBonus = frequencies_1.indexOf(3);
                    criteria.secondPairBonus = frequencies_1.indexOf(2, frequencies_1.indexOf(3) + 1);
                }
                else if (JSON.stringify(frequencies_1) === '[0,0,0,0,0,0,0,1,1,1,1]') {
                    score.name = "Straight Staves (" + (criteria.highestPositiveCard === 10 ? 10 : -10) + ")";
                    criteria.sabaccBonus = 9;
                }
                else if (frequencies_1.indexOf(4) > 0) {
                    score.name = "Squadron of " + frequencies_1.indexOf(4) + "s";
                    criteria.sabaccBonus = 8;
                    criteria.pairBonus = frequencies_1.indexOf(4);
                }
                else if (findRun() !== 0) {
                    score.name = "Straight Khyron (" + findRun() + ")";
                    criteria.sabaccBonus = 7;
                    criteria.runBonus = 10 - findRun();
                }
                else if (JSON.stringify(frequencies_1) === '[0,1,1,1,1,0,0,0,0,0,1]') {
                    score.name = "Wizard (Gee Whiz) (" + (criteria.highestPositiveCard === 10 ? 10 : -10) + ")";
                    criteria.sabaccBonus = 6;
                }
                else if (frequencies_1.indexOf(3) > 0) {
                    score.name = "Banthas Wild of " + frequencies_1.indexOf(3) + "s";
                    criteria.sabaccBonus = 5;
                    criteria.pairBonus = frequencies_1.indexOf(3);
                }
                else if (frequencies_1.indexOf(2) >= 0 && frequencies_1.indexOf(2, frequencies_1.indexOf(2) + 1) > 0) {
                    score.name = "Dual Pair Sabacc (" + frequencies_1.indexOf(2) + "s & " + frequencies_1.indexOf(2, frequencies_1.indexOf(2) + 1) + "s)";
                    criteria.sabaccBonus = 4;
                    criteria.pairBonus = frequencies_1.indexOf(2);
                    criteria.secondPairBonus = frequencies_1.indexOf(2, frequencies_1.indexOf(2) + 1);
                }
                else if (frequencies_1.indexOf(2) >= 0 && frequencies_1.indexOf(2, frequencies_1.indexOf(2) + 1) > 0) {
                    score.name = "Single Pair Sabacc (" + frequencies_1.indexOf(2) + "s)";
                    criteria.sabaccBonus = 3;
                    criteria.pairBonus = frequencies_1.indexOf(2);
                }
                else {
                    score.name = "Sabacc (" + criteria.positiveSum + ")";
                    criteria.sabaccBonus = 2;
                }
            }
            else if (!criteria.isSabacc) {
                score.name = "Nulhrek (" + sum + ")";
            }
            var twoDigits = function (input) {
                return input.toString().length === 2 ? input.toString() : '0' + input.toString();
            };
            score.rank = parseInt(twoDigits(criteria.isSabacc) +
                twoDigits(criteria.sabaccBonus) +
                twoDigits(criteria.pairBonus) +
                twoDigits(criteria.secondPairBonus) +
                twoDigits(criteria.runBonus) +
                twoDigits(criteria.nulhrekBonus) +
                twoDigits(criteria.isPositive) +
                twoDigits(criteria.numberOfCards) +
                twoDigits(criteria.positiveSum) +
                twoDigits(criteria.highestPositiveCard));
            return score;
        },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(Player.prototype, "infoPrivate", {
        get: function () {
            return {
                id: this.id,
                hand: this.hand,
                score: this.score.name,
                isActive: this.isActive,
                currentWager: this.currentWager,
                credits: this.credits,
            };
        },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(Player.prototype, "infoPublic", {
        get: function () {
            return {
                id: this.id,
                hand: this.hand.length + " cards",
                isActive: this.isActive,
                currentWager: this.currentWager,
                credits: this.credits
            };
        },
        enumerable: true,
        configurable: true
    });
    ;
    return Player;
}());
export { Player };
;
//# sourceMappingURL=player.js.map