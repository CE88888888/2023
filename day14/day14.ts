import { getExampleInput, getPuzzleInput } from "../helper/inputs";

const example: string[] = getExampleInput(__dirname);
const input: string[] = getPuzzleInput(__dirname);

console.log(`Part 1 example: ${solve1(example)}`);
console.log(`Part 1 solution: ${solve1(input)}`);
console.log(`Part 2 example: ${solve2(example)}`);
const t0 = performance.now();
console.log(`Part 2 solution: ${solve2(input)}`);
const t1 = performance.now();
console.log(`Call to doSomething took ${t1 - t0} milliseconds.`);

function solve1(lines: string[], sum = 0) {
  let grid = lines.map((x) => [...x]);
  let x = tiltN(grid);
  sum = countweight(x);
  return sum;
}

function solve2(lines: string[], weight = 0) {
  let grid = lines.map((x) => [...x]);
  let weightresult = new Map<string, number>();
  let gridstate = new Map<string, string[][]>();
  let ring = [];
  let ringnotfound = true;
  for (let i = 0; i < 400; i++) {
    let flat = grid.flat(2).toString();
    let x = [];
    let cachedgrid = gridstate.get(flat);
    if (cachedgrid !== undefined) {
      grid = gridstate.get(flat);
    } else {
      x = cycle(grid);
      var copyarr = grid.map((arr) => arr.slice());
      gridstate.set(flat, copyarr);
   }

    let cacheresult = weightresult.get(flat);
    if (cacheresult !== undefined) {
      weight = cacheresult;
    } else {
      let s = countweight(x);
      weight = s;
      weightresult.set(flat, weight);
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

function cycle(grid: string[][]) {
  grid = tiltN(grid);
  grid = tiltW(grid);
  grid = tiltS(grid);
  grid = tiltE(grid);
  return grid;
}

function countweight(grid: string[][]) {
  const maxy = grid.length;
  const maxx = grid[0].length;
  let sum = 0;

  for (let y = 0; y < maxy; y++) {
    for (let x = 0; x < maxx; x++) {
      if (grid[y][x] === "O") {
        sum = sum + maxy - y;
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
  const maxy = grid.length;
  const maxx = grid[0].length;

  for (let x = 0; x < maxx; x++) {
    let col2row = [];
    for (let y = maxy - 1; y > -1; y--) {
      col2row.push(grid[y][x]);
    }
    let n = tiltSmart(col2row);
    n = n.reverse();
    for (let y = 0; y < maxy; y++) {
      grid[y][x] = n[y];
    }
  }
  return grid;
}

function tiltS(grid: string[][]) {
  const maxy = grid.length;
  const maxx = grid[0].length;

  for (let x = 0; x < maxx; x++) {
    let col2row = [];
    for (let y = 0; y < maxy; y++) {
      col2row.push(grid[y][x]);
    }
    let n = tiltSmart(col2row);
    for (let y = 0; y < maxy; y++) {
      grid[y][x] = n[y];
    }
  }
  return grid;
}

function tiltE(grid: string[][]) {
  const maxy = grid.length;
  const maxx = grid[0].length;

  for (let y = 0; y < maxy; y++) {
    let n = tiltSmart(grid[y]);
    grid[y] = n;
  }
  return grid;
}

function tiltW(grid: string[][]) {
  const maxy = grid.length;
  const maxx = grid[0].length;

  for (let y = 0; y < maxy; y++) {
    let n = tiltSmart(grid[y].reverse());
    n = n.reverse();
    grid[y] = n;
  }
  return grid;
}
