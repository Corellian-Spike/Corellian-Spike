import { Card } from "./card";
import { Game } from "./game";
import { IPot } from "./table";

export class Player {
  public id: string;
  public credits: number;
  public hand: Array<Card>;
  public currentWager: number;
  public isActive: boolean;
  public wagerAction: {
    ante: ()=>void;
    matchCurrentWager: ()=>void;
    matchAndRaiseCurrentWagerByCredits: (credits: number)=>void;
    fold: ()=>void;
  }
  public turnAction: {

  }
  constructor(
    id: string,
    credits: number,
    game: Game,
  ) {
    this.id = id;
    this.credits = credits;
    this.hand = [];
    this.wagerAction = {
      ante: () => {
        this.payByPotAndCredits(game.table.sabaccPot, 20);
        this.payByPotAndCredits(game.table.pot, 10);
      },
      matchCurrentWager: () => {
        if (this.currentWager < game.state.currentWager) {
          const difference = game.state.currentWager - this.currentWager
          this.payByPotAndCredits(game.table.pot, difference);
          this.currentWager = game.state.currentWager;
        }
      },
      matchAndRaiseCurrentWagerByCredits: (credits: number) => {
        this.payByPotAndCredits(game.table.pot, credits)
      },
      fold: () => {
        this.isActive = false;
      }
    };
    this.turnAction = {
      buyCardFromDeck: () => {
        this.payByPotAndCredits(game.table.pot, 10);
        game.deck.drawTo(this);
      },
      buyCardFromDiscard: () => {
        this.payByPotAndCredits(game.table.pot, 20);
        game.discard.drawTo(this);
      },
      swapCardFromDeckByHandIndex: (handIndex: number) => {
        const oldCard = {...this.hand[handIndex]} as Card;
        const newCard = game.deck.draw();
        this.hand[handIndex] = newCard;
        game.discard.order.push(oldCard);
      },
      swapCardFromDiscardByHandIndex: (handIndex: number) => {
        const oldCard = {...this.hand[handIndex]} as Card;
        const newCard = game.discard.draw();
        this.hand[handIndex] = newCard;
        game.discard.order.push(oldCard);
      },
    };
    this.currentWager = 0;
    this.isActive = true;
  };
  private payByPotAndCredits(pot: IPot, credits: number) {
    this.credits = this.credits - credits;
    pot.credits = pot.credits + credits;
  }

  public get score() {
    const score = {
      name: '',
      rank: 0,
    }

    if (this.hand.length < 2) {
      return score;
    }

    if (this.hand.length > 5) {
      return score;
    }

    const handValues = this.hand.map(card => card.value);
    handValues.sort((a, b) => (a-b));
    const sum = handValues.reduce((currentSum, value) => currentSum + value, 0);

    const criteria = {
      isSabacc: sum === 0 ? 1 : 0,
      sabaccBonus: 0,
      pairBonus: 0,
      secondPairBonus: 0,
      runBonus: 0,
      nulhrekBonus: 48 - Math.abs(sum),
      isPositive: sum > 0 ? 1 : 0,
      numberOfCards: this.hand.length,
      positiveSum: handValues.reduce((currentSum, value) => (value > 0) ? currentSum + value : currentSum, 0),
      highestPositiveCard: handValues[handValues.length - 1] > 0 ? handValues[handValues.length - 1] : 0,
    };

    if (criteria.isSabacc) {
      const sabaccValues = handValues.map(card => Math.abs(card));
      const frequencies = sabaccValues.reduce((frequencyArray, value) => {
        frequencyArray[value] = frequencyArray[value] + 1;
        return frequencyArray;
      },
      [0,0,0,0,0,0,0,0,0,0,0]);

      const findRun = () => {
        for (let c = 3; c < frequencies.length; c++) {
          if (
            frequencies[c-3] === frequencies[c-2] &&
            frequencies[c-2] === frequencies[c-1] &&
            frequencies[c-1] === frequencies[0]) {
            return c;
          }
        };
        return 0;
      };

      if (JSON.stringify(frequencies) === '[2,0,0,0,0,0,0,0,0,0,0]') {
        score.name = `Pure Sabacc`;
        criteria.sabaccBonus = 15;
      } else if (JSON.stringify(frequencies) === '[1,0,0,0,0,0,0,0,0,0,4]') {
        score.name = `Full Sabacc`;
        criteria.sabaccBonus = 14;
      } else if (frequencies.indexOf(4) > 0 && frequencies[0] > 0) {
        score.name = `Fleet of ${frequencies.indexOf(4)}s`;
        criteria.sabaccBonus = 13;
        criteria.pairBonus = frequencies.indexOf(4);
      } else if (frequencies.indexOf(2) > 0 && frequencies.indexOf(2, frequencies.indexOf(2) + 1) > 0 && frequencies[0] > 0) {
        score.name = `Dual Power Coupling of ${frequencies.indexOf(2)}s & ${frequencies.indexOf(2, frequencies.indexOf(2) + 1)}s`;
        criteria.sabaccBonus = 12;
        criteria.pairBonus = frequencies.indexOf(2);
        criteria.secondPairBonus = frequencies.indexOf(2, frequencies.indexOf(2) + 1);
      } else if (frequencies.indexOf(2) > 0 && frequencies[0] > 0) {
        score.name = `Power Coupling (Yee-Haa) of ${frequencies.indexOf(2)}s`;
        criteria.sabaccBonus = 11;
        criteria.pairBonus = frequencies.indexOf(2);
        criteria.secondPairBonus = frequencies.indexOf(2, frequencies.indexOf(2) + 1);
      } else if (frequencies.indexOf(3) > 0 && frequencies.indexOf(2, frequencies.indexOf(3) + 1) > 0) {
        score.name = `Rhylet of ${frequencies.indexOf(3)}s & ${frequencies.indexOf(2, frequencies.indexOf(3) + 1)}s`
        criteria.sabaccBonus = 10;
        criteria.pairBonus = frequencies.indexOf(3);
        criteria.secondPairBonus = frequencies.indexOf(2, frequencies.indexOf(3) + 1);
      } else if (JSON.stringify(frequencies) === '[0,0,0,0,0,0,0,1,1,1,1]') {
        score.name = `Straight Staves (${criteria.highestPositiveCard === 10 ? 10 : -10})`;
        criteria.sabaccBonus = 9;
      } else if (frequencies.indexOf(4) > 0) {
        score.name = `Squadron of ${frequencies.indexOf(4)}s`;
        criteria.sabaccBonus = 8;
        criteria.pairBonus = frequencies.indexOf(4);
      } else if (findRun() !== 0) {
        score.name = `Straight Khyron (${findRun()})`;
        criteria.sabaccBonus = 7;
        criteria.runBonus = 10 - findRun();
      } else if (JSON.stringify(frequencies) === '[0,1,1,1,1,0,0,0,0,0,1]') {
        score.name = `Wizard (Gee Whiz) (${criteria.highestPositiveCard === 10 ? 10 : -10})`;
        criteria.sabaccBonus = 6;
      } else if (frequencies.indexOf(3) > 0) {
        score.name = `Banthas Wild of ${frequencies.indexOf(3)}s`;
        criteria.sabaccBonus = 5;
        criteria.pairBonus = frequencies.indexOf(3);
      } else if (frequencies.indexOf(2) >= 0 && frequencies.indexOf(2, frequencies.indexOf(2) + 1) > 0){
        score.name = `Dual Pair Sabacc (${frequencies.indexOf(2)}s & ${frequencies.indexOf(2, frequencies.indexOf(2) + 1)}s)`;
        criteria.sabaccBonus = 4;
        criteria.pairBonus = frequencies.indexOf(2);
        criteria.secondPairBonus = frequencies.indexOf(2, frequencies.indexOf(2) + 1);
      } else if (frequencies.indexOf(2) >= 0 && frequencies.indexOf(2, frequencies.indexOf(2) + 1) > 0){
        score.name = `Single Pair Sabacc (${frequencies.indexOf(2)}s)`;
        criteria.sabaccBonus = 3;
        criteria.pairBonus = frequencies.indexOf(2);
      } else {
        score.name = `Sabacc (${criteria.positiveSum})`;
        criteria.sabaccBonus = 2;
      }
    } else if (!criteria.isSabacc) {
      score.name = `Nulhrek (${sum})`;
    }

    const twoDigits = (input: number) => {
      return input.toString().length === 2 ? input.toString() : '0' + input.toString()
    }

    score.rank = parseInt(
      twoDigits(criteria.isSabacc) +
      twoDigits(criteria.sabaccBonus) +
      twoDigits(criteria.pairBonus) +
      twoDigits(criteria.secondPairBonus) +
      twoDigits(criteria.runBonus) +
      twoDigits(criteria.nulhrekBonus) +
      twoDigits(criteria.isPositive) +
      twoDigits(criteria.numberOfCards) +
      twoDigits(criteria.positiveSum) +
      twoDigits(criteria.highestPositiveCard)
    );

    return score;
  };

  get infoPrivate() {
    return {
      id: this.id,
      hand: this.hand,
      score: this.score.name,
      isActive: this.isActive,
      currentWager: this.currentWager,
      credits: this.credits,
    };
  };
  get infoPublic() {
    return {
      id: this.id,
      hand: `${this.hand.length} cards`,
      isActive: this.isActive,
      currentWager: this.currentWager,
      credits: this.credits
    };
  };
};
