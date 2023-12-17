import { getExampleInput, getPuzzleInput } from "../helper/inputs";

const example: string[] = getExampleInput(__dirname);
const input: string[] = getPuzzleInput(__dirname);

console.log(`Part 1 example: ${solve1(example)}`);
console.log(`Part 1 solution: ${solve1(input)}`);
console.log(`Part 2 example: ${solve2(example)}`);
// console.log(`Part 2 solution: ${solve2(input)}`);
const t0 = performance.now();
console.log(`Part 2 solution: ${solve2(input)}`);
const t1 = performance.now();
console.log(`Call to Solve 2 took ${t1 - t0} milliseconds.`);

type Point = {
  d: number;
  y: number;
  x: number;
  ydir: number;
  xdir: number;
  seq: number;
};

function solve1(lines: string[]) {
  const grid = parseGrid(lines);
  return shortestPath(grid, -1, 3);
}

function solve2(lines: string[]) {
  const grid = parseGrid(lines);
  return shortestPath(grid, 3, 10);
}

function shortestPath(grid: number[][], minSeq: number, maxSeq: number) {
  const boundx = grid[0].length - 1;
  const boundy = grid.length - 1;
  let result = 0;
  let start1: Point = np(0, 0, 0, 0, 1, 0);
  let start2: Point = np(0, 0, 0, 1, 0, 0);
  let pqueue: Point[] = [start1, start2];
  let visited = new Set<string>();

  while (pqueue.length > 0) {
    const p = pqueue.shift();

    if (p.x === boundx && p.y === boundy && p.seq > minSeq) {
      result = p.d;
      console.log("end found", pqueue.length);
      console.log(p);
      break;
    }

    const hash = [p.y, p.x, p.ydir, p.xdir, p.seq].join(",");
    if (visited.has(hash)) {
      continue;
    }
    visited.add(hash);

    let next = [];

    if (p.seq < maxSeq) {
      let nx = p.x + p.xdir;
      let ny = p.y + p.ydir;
      if (nx >= 0 && nx <= boundx && ny >= 0 && ny <= boundy) {
        pqueue.push(np(p.d + grid[ny][nx], ny, nx, p.ydir, p.xdir, p.seq + 1))
      }
    }

    if (p.seq > minSeq) {
      if (p.xdir === 1 || p.xdir === -1) {
        let nx = p.x;
        let ny = p.y + 1;
        if (nx >= 0 && nx <= boundx && ny >= 0 && ny <= boundy) {
          pqueue.push(np(p.d + grid[ny][nx], ny, p.x, p.ydir + 1, 0, 1))
        }
        ny = p.y - 1;
        if (nx >= 0 && nx <= boundx && ny >= 0 && ny <= boundy) {
          pqueue.push(np(p.d + grid[ny][nx], ny, p.x, p.ydir - 1, 0, 1))
        }
      }

      if (p.ydir === 1 || p.ydir === -1) {
        let ny = p.y;
        let nx = p.x - 1;
        if (nx >= 0 && nx <= boundx && ny >= 0 && ny <= boundy) {
          pqueue.push(np(p.d + grid[ny][nx], ny, nx, 0, p.xdir - 1, 1))
        }
        nx = p.x + 1;
        if (nx >= 0 && nx <= boundx && ny >= 0 && ny <= boundy) {
          pqueue.push(np(p.d + grid[ny][nx], ny, p.x + 1, 0, p.xdir + 1, 1))
        }
      }
    }

    pqueue.sort((x1, x2) => {
      if (x1.d > x2.d) {
        return 1;
      }
      if (x1.d < x2.d) {
        return -1;
      }

      if (x1.d === x2.d) {
        if (x1.seq < x2.seq) {
          return -1;
        }
        if (x1.seq > x2.seq) {
          return 1;
        }
      }

      return 0;
    });

  }
  return result;
}

function np(d, y, x, ydir, xdir, seq): Point {
  return { d: d, y: y, x: x, ydir: ydir, xdir: xdir, seq: seq };
}

function parseGrid(lines: string[]): number[][] {
  let grid = [];
  for (let y = 0; y < lines.length; y++) {
    grid.push([...lines[y]].map((x) => +x));
  }
  return grid;
}
