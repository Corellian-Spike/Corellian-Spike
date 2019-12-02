var Discard = (function () {
    function Discard() {
        this.order = [];
    }
    Discard.prototype.draw = function () {
        if (this.order.length < 1) {
            throw new Error('Discard is empty\n');
        }
        return this.order.pop();
    };
    ;
    Discard.prototype.drawTo = function (player) {
        player.hand.push(this.draw());
        return player.hand;
    };
    ;
    Discard.prototype.replaceToDeck = function (deck) {
        deck.order = deck.order.concat(this.order);
        this.order = [];
    };
    ;
    Object.defineProperty(Discard.prototype, "top", {
        get: function () {
            return this.order[this.order.length - 1];
        },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(Discard.prototype, "infoPublic", {
        get: function () {
            return {
                length: this.order.length,
                topCard: this.top
            };
        },
        enumerable: true,
        configurable: true
    });
    ;
    return Discard;
}());
export { Discard };
;
//# sourceMappingURL=discard.js.map