'use strict';
import { Card } from './card';
var Deck = (function () {
    function Deck() {
        var _this = this;
        this.order = [
            new Card(0, '0SilopA'),
            new Card(0, '0SilopB'),
        ];
        var staves = [
            'Triangle',
            'Circle',
            'Square'
        ];
        staves.map(function (stave) {
            for (var value = 1; value <= 10; value++) {
                _this.order.push(new Card(value, "" + value + stave));
            }
            ;
        });
        staves.map(function (stave) {
            for (var value = -1; value >= -10; value--) {
                _this.order.push(new Card(value, "" + value + stave));
            }
            ;
        });
    }
    ;
    Deck.prototype.shuffle = function () {
        var _a;
        for (var i = this.order.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            _a = [this.order[j], this.order[i]], this.order[i] = _a[0], this.order[j] = _a[1];
        }
        ;
        return this.order;
    };
    ;
    Deck.prototype.draw = function () {
        if (this.order.length < 1) {
            throw new Error('Deck is empty\n');
        }
        return this.order.pop();
    };
    ;
    Deck.prototype.drawTo = function (player) {
        player.hand.push(this.draw());
        return player.hand;
    };
    ;
    Deck.prototype.dealTo = function (playersArray) {
        for (var card = 0; card < 2; card++) {
            for (var player = 0; player < playersArray.length; player++) {
                this.drawTo(playersArray[player]);
            }
            ;
        }
        ;
    };
    ;
    Deck.prototype.dealReplacementHandTo = function (player, handLength) {
        for (var card = 0; card < handLength; card++) {
            this.drawTo(player);
        }
        ;
    };
    ;
    Deck.prototype.discardTo = function (discard) {
        discard.order.push(this.draw());
        return discard.top;
    };
    ;
    Object.defineProperty(Deck.prototype, "infoPublic", {
        get: function () {
            return {
                length: this.order.length,
            };
        },
        enumerable: true,
        configurable: true
    });
    ;
    return Deck;
}());
export { Deck };
;
//# sourceMappingURL=deck.js.map