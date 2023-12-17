import PriorityQueue from "ts-priority-queue";
import { getExampleInput, getPuzzleInput } from "../helper/inputs";

const example: string[] = getExampleInput(__dirname);
const input: string[] = getPuzzleInput(__dirname);

console.log(`Part 1 example: ${solve1(example)}`);
console.log(`Part 1 solution: ${solve1(input)}`);
console.log(`Part 2 example: ${solve2(example)}`);
console.log(`Part 2 solution: ${solve2(input)}`);

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
  let visited = new Set<string>();
  let queue = new PriorityQueue({
    comparator: function (a: Point, b: Point) {
      return a.d - b.d;
    },
  });
  queue.queue(start1);

  while (queue.length > 0) {
    const p = queue.dequeue();

    if (p.x === boundx && p.y === boundy && p.seq > minSeq) {
      result = p.d;
      break;
    }

    const hash = [p.y, p.x, p.ydir, p.xdir, p.seq].join(",");
    if (visited.has(hash)) {
      continue;
    }
    visited.add(hash);

    if (p.seq < maxSeq) {
      let nx = p.x + p.xdir;
      let ny = p.y + p.ydir;
      if (nx >= 0 && nx <= boundx && ny >= 0 && ny <= boundy) {
        queue.queue(np(p.d + grid[ny][nx], ny, nx, p.ydir, p.xdir, p.seq + 1));
      }
    }

    if (p.seq > minSeq) {
      if (p.xdir === 1 || p.xdir === -1) {
        let nx = p.x;
        let ny = p.y + 1;
        if (nx >= 0 && nx <= boundx && ny >= 0 && ny <= boundy) {
          queue.queue(np(p.d + grid[ny][nx], ny, p.x, p.ydir + 1, 0, 1));
        }
        ny = p.y - 1;
        if (nx >= 0 && nx <= boundx && ny >= 0 && ny <= boundy) {
          queue.queue(np(p.d + grid[ny][nx], ny, p.x, p.ydir - 1, 0, 1));
        }
      }

      if (p.ydir === 1 || p.ydir === -1) {
        let ny = p.y;
        let nx = p.x - 1;
        if (nx >= 0 && nx <= boundx && ny >= 0 && ny <= boundy) {
          queue.queue(np(p.d + grid[ny][nx], ny, nx, 0, p.xdir - 1, 1));
        }
        nx = p.x + 1;
        if (nx >= 0 && nx <= boundx && ny >= 0 && ny <= boundy) {
          queue.queue(np(p.d + grid[ny][nx], ny, p.x + 1, 0, p.xdir + 1, 1));
        }
      }
    }
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
