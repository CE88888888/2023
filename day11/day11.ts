import { getExampleInput, getPuzzleInput } from "../helper/inputs";

const example: string[] = getExampleInput(__dirname);
const input: string[] = getPuzzleInput(__dirname);

console.log(`Part 1 example: ${solve(example)}`);
console.log(`Part 1 solution: ${solve(input)}`);
console.log(`Part 2 example: ${solve(example, 10)}`);
console.log(`Part 2 solution: ${solve(input, 1000000)}`);

type Point = {
  id: number;
  x: number;
  y: number;
};

type Pair = {
  one: Point;
  two: Point;
  d?: number;
};

function solve(lines: string[], xp = 2, sum = 0) {
  let grid = parse(lines);
  let galaxies = getGalaxys(grid);
  let cols = getEmptyCols(lines);
  let rows = getEmptyRows(lines);

  for (let i = 0; i < galaxies.length; i++) {
    for (let j = i + 1; j < galaxies.length; j++) {
      let pair: Pair = { one: galaxies[i], two: galaxies[j] };
      pair.d = calculateDistance(pair, cols, rows, xp);
      sum = sum + pair.d;
    }
  }
  return sum;
}

function calculateDistance(p: Pair, cols: number[], rows: number[], xp = 2) {
  let gxs = cols.filter((x) => between(p.one.x, p.two.x, x)).length;
  let gys = rows.filter((y) => between(p.one.y, p.two.y, y)).length;

  let x1 = Math.min(p.one.x, p.two.x);
  let x2 = Math.max(p.one.x, p.two.x);
  let y1 = Math.min(p.one.y, p.two.y);
  let y2 = Math.max(p.one.y, p.two.y);

  x2 = gxs === 0 ? x2 : x2 + gxs * xp - gxs;
  y2 = gys === 0 ? y2 : y2 + gys * xp - gys;

  return x2 - x1 + (y2 - y1);
}

function between(x1: number, x2: number, point: number) {
  return Math.min(x1, x2) < point && point < Math.max(x1, x2);
}

function getGalaxys(grid: string[][]) {
  let galaxies: Point[] = [];
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x] == "#") {
        galaxies.push({ x: x, y: y, id: y * 10 + x });
      }
    }
  }
  return galaxies;
}

function parse(lines: string[]) {
  let grid: string[][] = [];
  for (let i = 0; i < lines.length; i++) {
    grid.push([...lines[i]]);
  }
  return grid;
}

function getEmptyCols(lines: string[]) {
  let emptyCols: number[] = [];
  for (let x = 0; x < lines[0].length; x++) {
    if (lines.filter((l) => l[x] === "#").length === 0) {
      emptyCols.push(x);
    }
  }
  return emptyCols;
}

function getEmptyRows(lines: string[]) {
  let emptyRows: number[] = [];
  for (let i = 0; i < lines.length; i++) {
    if (!lines[i].includes("#")) {
      emptyRows.push(i);
    }
  }
  return emptyRows;
}
