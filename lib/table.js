var Table = (function () {
    function Table() {
        var _this = this;
        this.pot = {
            credits: 0,
            payOutTo: function (player) {
                player.credits = player.credits + _this.pot.credits;
                _this.pot.credits = 0;
                return player.credits;
            },
        };
        this.sabaccPot = {
            payOutTo: function (player) {
                player.credits = player.credits + _this.sabaccPot.credits;
                _this.sabaccPot.credits = 0;
                return player.credits;
            },
            credits: 0
        };
    }
    ;
    Object.defineProperty(Table.prototype, "infoPublic", {
        get: function () {
            return {
                pot: { credits: this.pot.credits },
                sabbaccPot: { credits: this.sabaccPot.credits }
            };
        },
        enumerable: true,
        configurable: true
    });
    ;
    return Table;
}());
export { Table };
;
//# sourceMappingURL=table.js.map