import { getExampleInput, getPuzzleInput } from "../helper/inputs";

const example: string[] = getExampleInput(__dirname);
const input: string[] = getPuzzleInput(__dirname);

console.log(`Part 1 example: ${solve1(example)}`);
console.log(`Part 1 solution: ${solve1(input)}`);
console.log(`Part 2 example: ${solve2(example)}`);
console.log(`Part 2 solution: ${solve2(input)}`);

function solve1(lines: string[], sum = 0) {
  lines.forEach((line) => {
    let cCard: Card = parseCard(line);
    sum = sum + calculatePoints(cCard);
  });

  return sum;
}

function solve2(lines: string[], sum = 0) {
  let gameids = [];
  lines.forEach((line) => {
    let cCard: Card = parseCard(line);

    gameids.push(cCard.id);
    let count = 0;
    cCard.my.forEach((n) => {
      if (cCard.win.includes(n)) {
        count++;
      }
    });

    for (let i = count; i > 0; i--) {
      let occ = countOccurrences(gameids, cCard.id);
      for (let j = occ; occ > 0; occ--) {
        gameids.push(cCard.id + i);
      }
    }
  });

  return gameids.length;
}

type Card = {
  id: number;
  my: string[];
  win: string[];
};

function calculatePoints(cCard: Card) {
  let count = 0;
  cCard.my.forEach((n) => {
    if (cCard.win.includes(n)) {
      count++;
    }
  });

  return (count > 0) ? 2 ** (count - 1) : 0
}

function countOccurrences<Type>(arr: Type[], val: Type): number {
  return arr.reduce((a, v) => (v === val ? a + 1 : a), 0);
}

function parseCard(l: string) {
  let [cid, numbers] = l.split(":");
  let [mine, winning] = numbers.split("|");
  cid = cid.replace("Card ", "");

  let cCard: Card = {
    id: +cid,
    my: mine.split(" ").filter((i) => i),
    win: winning.split(" ").filter((i) => i),
  };
  return cCard;
}
