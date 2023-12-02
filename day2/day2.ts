import { getExampleInput, getPuzzleInput } from "../helper/inputs";

const example: string[] = getExampleInput(__dirname);
const input: string[] = getPuzzleInput(__dirname);

type Set = {
  red: number;
  blue: number;
  green: number;
};

class Game {
  id: number;
  sets: Set[];

  constructor(id: number) {
    this.id = id;
    this.sets = [];
  }

  getMaxRed(): number {
    return this.sets.reduce(function (p, c) {
      return p && p.red > c.red ? p : c;
    }).red;
  }
  getMaxBlue(): number {
    return this.sets.reduce(function (p, c) {
      return p && p.blue > c.blue ? p : c;
    }).blue;
  }
  getMaxGreen(): number {
    return this.sets.reduce(function (p, c) {
      return p && p.green > c.green ? p : c;
    }).green;
  }
}

console.log(`Part 1 example: ${solve1(example)}`);
console.log(`Part 1 solution: ${solve1(input)}`);
console.log(`Part 2 example: ${solve2(example)}`);
console.log(`Part 2 solution: ${solve2(input)}`);

function solve1(lines: string[], total = 0) {
  let games: Game[] = parseGames(lines);

  games = games.filter(
    (game) =>
      game.getMaxRed() < 13 && game.getMaxGreen() < 14 && game.getMaxBlue() < 15
  );
  games.forEach((g) => (total = total + g.id));
  return total;
}

function solve2(lines: string[], total = 0) {
  let games: Game[] = parseGames(lines);
  games.forEach(
    (g) => (total = total + g.getMaxBlue() * g.getMaxRed() * g.getMaxGreen())
  );
  return total;
}

function parseGames(lines: string[]) {
  let games: Game[] = [];
  lines.forEach((line) => {
    const arr = line.split(":");
    const gameId = +arr[0].replace("Game ", "");
    let game = new Game(gameId);

    const setsraw = arr[1].split(";");
    setsraw.forEach((s) => {
      s = s.trim();
      game.sets.push(createSet(s));
    });
    games.push(game);
  });
  return games;
}

function createSet(rawset: string) {
  const gemsraw = rawset.split(",");
  let set: Set = { red: 0, blue: 0, green: 0 };

  gemsraw.forEach((gem) => {
    gem = gem.trim();
    const amount = +gem.split(" ")[0];
    const colour = gem.split(" ")[1];

    switch (colour) {
      case "red":
        set.red = amount;
        break;
      case "blue":
        set.blue = amount;
        break;
      case "green":
        set.green = amount;
        break;
    }
  });
  return set;
}
