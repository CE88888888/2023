import { getExampleInput, getPuzzleInput } from "../helper/inputs";

const example: string[] = getExampleInput(__dirname);
const input: string[] = getPuzzleInput(__dirname);

console.log(`Part 1 example: ${solve1(example)}`);
console.log(`Part 1 solution: ${solve1(input)}`);
console.log(`Part 2 example: ${solve2(example)}`);
const t0 = performance.now();
console.log(`Part 2 solution: ${solve2(input)}`);
const t1 = performance.now();
console.log(`Call to Solve 2 took ${t1 - t0} milliseconds.`);

type Result = {
  grid: string;
  weight: number;
};

function solve1(lines: string[], sum = 0) {
  let grid = lines.map((x) => [...x]);
  tiltN(grid);
  return countweight(grid);
}

function solve2(lines: string[], weight = 0) {
  const grid = lines.map((x) => [...x]);
  const l = grid.length;
  let flat = grid.flat(2).toString();

  let resultcache = new Map<string, Result>();
  let ring = [];
  let ringnotfound = true;

  for (let i = 0; i < 400; i++) {
    const cachedresult = resultcache.get(flat);
    if (cachedresult !== undefined) {
      flat = resultcache.get(flat).grid;
      weight = resultcache.get(flat).weight;
    } else {
      const flatold = flat;
      flat = cycleFlat(flat, l);
      const r = {
        grid: flat,
        weight: countweightFlat(flatold, l),
      };
      resultcache.set(flatold, r);
    }

    if (i >= 200) {
      if (ringnotfound) {
        ring.push(weight);
        let a1 = ring.slice(0, ring.length / 2);
        let a2 = ring.slice(ring.length / 2);
        if (a2.every((v, idx) => v === a1[idx])) {
          ring = a1;
          ringnotfound = false;
        }
      }
    }
  }

  const ringlength = 400 % ring.length;
  const offset = ring.indexOf(weight) - ringlength;
  const result = ((1000000000 % ring.length) + offset) % ring.length;
  return ring[result];
}

function cycleFlat(flatgrid: string, l: number) {
  let grid = rebuildGrid(l, flatgrid);
  grid = tiltN(grid);
  grid = tiltW(grid);
  grid = tiltS(grid);
  grid = tiltE(grid);
  return grid.flat(2).toString();
}

function countweightFlat(flatgrid: string, l: number) {
  let grid = rebuildGrid(l, flatgrid);
  return countweight(grid);
}

function rebuildGrid(l: number, flatgrid: string) {
  let grid: string[][] = [];
  for (let i = 0; i < l; i = i + 1) {
    grid.push(flatgrid.slice(i * 2 * l, i * 2 * l + 2 * l - 1).split(","));
  }
  return grid;
}

function countweight(grid: string[][]) {
  let sum = 0;
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid.length; x++) {
      if (grid[y][x] === "O") {
        sum = sum + grid.length - y;
      }
    }
  }
  return sum;
}

function tiltSmart(row: string[]) {
  let firstpass = false;
  for (let x = 0; x < row.length - 1; x++) {
    if (row[x] === "O") {
      if (row[x + 1] === ".") {
        row[x + 1] = "O";
        row[x] = ".";
        x = 0;
      }
    }
    if (x === row.length - 2 && !firstpass) {
      firstpass = true;
      x = -1;
    }
  }
  return row;
}

function tiltN(grid: string[][]) {
  for (let x = 0; x < grid.length; x++) {
    let col2row = [];
    for (let y = grid.length - 1; y > -1; y--) {
      col2row.push(grid[y][x]);
    }
    let n = tiltSmart(col2row);
    n = n.reverse();
    for (let y = 0; y < grid.length; y++) {
      grid[y][x] = n[y];
    }
  }
  return grid;
}

function tiltS(grid: string[][]) {
  for (let x = 0; x < grid.length; x++) {
    let col2row = [];
    for (let y = 0; y < grid.length; y++) {
      col2row.push(grid[y][x]);
    }
    let n = tiltSmart(col2row);
    for (let y = 0; y < grid.length; y++) {
      grid[y][x] = n[y];
    }
  }
  return grid;
}

function tiltE(grid: string[][]) {
  for (let y = 0; y < grid.length; y++) {
    let n = tiltSmart(grid[y]);
    grid[y] = n;
  }
  return grid;
}

function tiltW(grid: string[][]) {
  for (let y = 0; y < grid.length; y++) {
    let n = tiltSmart(grid[y].reverse());
    n = n.reverse();
    grid[y] = n;
  }
  return grid;
}
