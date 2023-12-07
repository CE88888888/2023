import { getExampleInput, getPuzzleInput } from "../helper/inputs";

const example: string[] = getExampleInput(__dirname);
const input: string[] = getPuzzleInput(__dirname);

console.log(`Part 1 example: ${solve(example, 0, false)}`);
console.log(`Part 1 solution: ${solve(input, 0, false)}`);
console.log(`Part 2 example: ${solve(example, 0, true)}`);
console.log(`Part 2 solution: ${solve(input, 0, true)}`);

function solve(lines: string[], sum: number, withJoker: boolean) {
  let arr: Hand[] = [];
  lines.forEach((line) => {
    let h: Hand = {
      cards: line.split(" ")[0],
      rank: +line.split(" ")[1],
      bid: "",
    };
    h.bid = calcScore(h.cards, withJoker);
    arr.push(h);
  });

  sortCards(arr, withJoker).forEach((h) => {
    sum = sum + h.rank * (arr.indexOf(h) + 1);
  });

  return sum;
}

type Hand = {
  cards: string;
  rank: number;
  bid: string;
};

function calcScore(c: string, withJoker: boolean) {
  const cards = [...c];
  cards.sort((n1, n2) => {
    return getCardorder(n1[0], true) - getCardorder(n2[0], true);
  });

  const distinctCards = new Set(cards);
  let arr = [...distinctCards];

  let jokers = 0;
  if (arr[0] === "J" && withJoker) {
    jokers = cards.lastIndexOf(arr[0]) - cards.indexOf(arr[0]) + 1;
    distinctCards.delete("J");
  }

  let amountarr = [];
  distinctCards.forEach((c) => {
    let amount = cards.lastIndexOf(c) - cards.indexOf(c);
    if (amount > 0) {
      amountarr.push(amount);
    }
  });

  if (amountarr.length == 0) {
    if (jokers > 0) {
      switch (jokers) {
        case 1:
          return "1P";
        case 2:
          return "3K";
        case 3:
          return "4A";
        case 4:
          return "5A";
        case 5:
          return "5A";
        default:
          break;
      }
    } else {
      return "H";
    }
  }

  if (jokers > 0) {
    amountarr.sort((n1, n2) => n1 - n2);
    amountarr[0] = amountarr[0] + jokers;
  }

  if (amountarr.length == 1) {
    if (amountarr[0] === 1) {
      return "1P";
    }
    if (amountarr[0] === 2) {
      return "3K";
    }
    if (amountarr[0] === 3) {
      return "4A";
    }
    if (amountarr[0] === 4) {
      return "5A";
    }
  }
  if (amountarr.length == 2) {
    if (amountarr[0] === 1 && amountarr[1] === 2) {
      return "FH";
    }
    if (amountarr[0] === 1 && amountarr[1] === 1) {
      return "2P";
    }
    if (amountarr[0] === 2 && amountarr[1] === 1) {
      return "FH";
    }
  }
}

function sortCards(arr: Hand[], joker: boolean) {
  arr.sort((n1, n2) => {
    if (getHandRank(n1.bid) === getHandRank(n2.bid)) {
      let m1 = [...n1.cards];
      let m2 = [...n2.cards];
      for (let i = 0; i < m1.length; i++) {
        if (getCardorder(m1[i], joker) > getCardorder(m2[i], joker)) {
          return 1;
        }
        if (getCardorder(m1[i], joker) < getCardorder(m2[i], joker)) {
          return -1;
        }
      }
    }
    return getHandRank(n1.bid) - getHandRank(n2.bid);
  });
  return arr;
}

function getCardorder(c: string, j: boolean): number {
  const cardorder = j ? "J23456789TQKA" : "23456789TJQKA";
  return cardorder.indexOf(c);
}
function getHandRank(c: string): number {
  const handrank = ["C", "1P", "2P", "3K", "FH", "4A", "5A"];
  return handrank.indexOf(c);
}
