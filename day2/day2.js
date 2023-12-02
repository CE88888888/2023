"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const inputs_1 = require("../helper/inputs");
const example = (0, inputs_1.getExampleInput)(__dirname);
const input = (0, inputs_1.getPuzzleInput)(__dirname);
class Game {
    id;
    sets;
    constructor(id) {
        this.id = id;
        this.sets = [];
    }
    getMaxRed() {
        return this.sets.reduce(function (p, c) {
            return p && p.red > c.red ? p : c;
        }).red;
    }
    getMaxBlue() {
        return this.sets.reduce(function (p, c) {
            return p && p.blue > c.blue ? p : c;
        }).blue;
    }
    getMaxGreen() {
        return this.sets.reduce(function (p, c) {
            return p && p.green > c.green ? p : c;
        }).green;
    }
}
console.log(`Part 1 example: ${solve1(example)}`);
console.log(`Part 1 solution: ${solve1(input)}`);
console.log(`Part 2 example: ${solve2(example)}`);
console.log(`Part 2 solution: ${solve2(input)}`);
function solve1(lines, total = 0) {
    let games = parseGames(lines);
    games = games.filter((game) => game.getMaxRed() < 13 && game.getMaxGreen() < 14 && game.getMaxBlue() < 15);
    games.forEach((g) => (total = total + g.id));
    return total;
}
function solve2(lines, total = 0) {
    let games = parseGames(lines);
    games.forEach((g) => (total = total + g.getMaxBlue() * g.getMaxRed() * g.getMaxGreen()));
    return total;
}
function parseGames(lines) {
    let games = [];
    lines.forEach((line) => {
        let [gameId, setsrawstring] = line.split(":");
        let game = new Game(+gameId.replace("Game ", ""));
        const setsraw = setsrawstring.split(";");
        setsraw.forEach((s) => {
            s = s.trim();
            game.sets.push(createSet(s));
        });
        games.push(game);
    });
    return games;
}
function createSet(rawset) {
    const gemsraw = rawset.split(",");
    let set = { red: 0, blue: 0, green: 0 };
    gemsraw.forEach((gem) => {
        gem = gem.trim();
        const [amount, colour] = gem.split(" ");
        // const amount = +gem.split(" ")[0];
        // const colour = gem.split(" ")[1];
        switch (colour) {
            case "red":
                set.red = +amount;
                break;
            case "blue":
                set.blue = +amount;
                break;
            case "green":
                set.green = +amount;
                break;
        }
    });
    return set;
}
//# sourceMappingURL=day2.js.map