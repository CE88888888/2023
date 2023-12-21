import { ok } from "assert";
import { getExampleInput, getPuzzleInput } from "../helper/inputs";

const example: string[] = getExampleInput(__dirname);
const input: string[] = getPuzzleInput(__dirname);

console.log(`Part 1 example: ${solve1(example, true)}`);
console.log(`Part 1 solution: ${solve1(input)}`);
console.log(`Part 2 example: ${solve2(example)}`);
console.log(`Part 2 solution: ${solve2(input)}`);

type P = { x: number; y: number; c: number };

function solve1(lines: string[], example = false) {
  const grid = parse(lines);
  let start = getStart(grid);

  let next = [start];
  let steps = example ? 6 : 64;
  for (let i = 0; i < steps; i++) {
    let cps = next.filter((p) => p.c === i);
    let arr = cps.map((cp) => getNeighbours(grid, cp)).flat();
    next = [...new Set(arr.map((i) => JSON.stringify(i)))].map((i) =>
      JSON.parse(i)
    );
  }
  return next.length;
}

function solve2(lines: string[], sum = 0, example = false) {
  let grid = parse(lines);
  const gridlength = grid.length;
  const resizefactor = 2;

  let start = getStart(grid);
  const mid = start.x;
  const steps = (26501365 - mid) / gridlength;

  let expanded = Array.from(grid);
  expanded[start.y][start.x] = ".";
  grid = expandTheGrid(grid, expanded, 3);
  start.x = start.x + resizefactor * gridlength;
  start.y = start.y + resizefactor * gridlength;

  let next = [start];
  let crossings = [];
  let stepmax = mid + resizefactor * gridlength;
  for (let i = 0; i < stepmax + 1; i++) {
    if (i % gridlength === mid) {
      console.log("Round", i, "size:", next.length);
      crossings.push(next.length);
    }
    let cps = next.filter((p) => p.c === i);
    let arr = cps.map((cp) => getNeighbours(grid, cp)).flat();
    next = [...new Set(arr.map((i) => JSON.stringify(i)))].map((i) =>
      JSON.parse(i)
    );
  }

  let x = calculateParabole(steps, crossings[0], crossings[1], crossings[2]);
  return x;
}

function calculateParabole(x, c1, c2, c3) { 
  const a = c1;
  const b = c2 - a;
  const c = (c3 - c2 - b) / 2; //dont round!
  let result = a + b * x + c * (x * x) - c * x;
  return result;
}

function getStart(grid: any[]) {
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[0].length; x++) {
      if (grid[y][x] === "S") {
        return { x: x, y: y, c: 0 };
      }
    }
  }
  return undefined;
}

function parse(lines: string[]) {
  let grid = [];
  lines.forEach((l) => {
    grid.push([...l]);
  });
  return grid;
}
function getNeighbours(grid: string[][], p: P) {
  let result: P[] = [];
  if (p.x > 0) result.push({ x: p.x - 1, y: p.y, c: p.c + 1 });
  if (p.x < grid[0].length - 1) result.push({ x: p.x + 1, y: p.y, c: p.c + 1 });
  if (p.y > 0) result.push({ x: p.x, y: p.y - 1, c: p.c + 1 });
  if (p.y < grid.length - 1) result.push({ x: p.x, y: p.y + 1, c: p.c + 1 });

  result = result.filter((p) => grid[p.y][p.x] !== "#");

  return result;
}
function expandTheGrid(grid: any[], expanded: any[], factor: number): any[] {
  let rows = Array.from(expanded);
  for (let i = 0; i < factor * 2; i++) {
    rows = rows.map((v, i) => v.concat(expanded[i]));
  }

  let arr = Array.from(rows);
  for (let i = 0; i < factor * 2; i++) {
    arr = arr.concat(rows);
  }

  return arr;
}
