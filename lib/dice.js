var SpikeDice = (function () {
    function SpikeDice() {
    }
    SpikeDice.prototype.roll = function () {
        var rollOne = Math.floor((Math.random() * 6) + 1);
        var rollTwo = Math.floor((Math.random() * 6) + 1);
        return {
            spikeDiceMatch: rollOne === rollTwo,
            rollOne: rollOne,
            rollTwo: rollTwo
        };
    };
    ;
    return SpikeDice;
}());
export { SpikeDice };
;
//# sourceMappingURL=dice.js.map