import { getExampleInput, getPuzzleInput } from "../helper/inputs";

const example: string[] = getExampleInput(__dirname);
const input: string[] = getPuzzleInput(__dirname);

console.log(`Part 1 example: ${solve1(example)}`);
console.log(`Part 1 solution: ${solve1(input)}`);
console.log(`Part 2 example: ${solve2(example)}`);
console.log(`Part 2 solution: ${solve2(input)}`);

type Point = {
  x: number;
  y: number;
  dir: Dir;
};
type Dir = "L" | "R" | "U" | "D";

function solve1(lines: string[]) {
  let points: Point[] = [];
  let grid = [];
  lines.forEach((l) => grid.push([...l]));
  points.push({ x: 0, y: 0, dir: "R" });

  return calcEnergised(points, grid);
}

function solve2(lines: string[], max = 0) {
  let grid = [];
  lines.forEach((l) => grid.push([...l]));
  let bound = grid.length - 1;

  for (let i = 0; i < grid[0].length; i++) {
    const s: Point = { x: i, y: 0, dir: "D" };
    max = Math.max(max, calcEnergised([s], grid));
  }

  for (let i = 0; i < grid[0].length; i++) {
    const s: Point = { x: i, y: bound, dir: "U" };
    max = Math.max(max, calcEnergised([s], grid));
  }

  for (let i = 0; i < grid.length; i++) {
    const s: Point = { x: bound, y: i, dir: "L" };
    max = Math.max(max, calcEnergised([s], grid));
  }

  for (let i = 0; i < grid.length; i++) {
    const s: Point = { x: 0, y: i, dir: "U" };
    max = Math.max(max, calcEnergised([s], grid));
  }

  return max;
}

function calcEnergised(points: Point[], grid: any[]) {
  let energised = new Set<string>();
  let visited = new Set<string>();

  for (let i = 0; i < points.length; i++) {
    const p = points[i];
    energised.add(p.x.toString() + "," + p.y.toString());
    visited.add(hash(p));
    let c = grid[p.y][p.x];

    let np = { ...p };
    let next = [];

    if (c === ".") {
      next.push(np);
    }
    if (c === "/") {
      np.dir = rotate(p.dir, "/");
      next.push(np);
    }
    if (c === "\\") {
      np.dir = rotate(p.dir, "\\");
      next.push(np);
    }

    if (c === "-") {
      if (p.dir === "L" || p.dir === "R") {
        next.push(np);
      } else {
        let np1 = { ...p };
        let np2 = { ...p };
        np1.dir = "L";
        np2.dir = "R";
        next.push(np1);
        next.push(np2);
      }
    }

    if (c === "|") {
      if (p.dir === "U" || p.dir === "D") {
        next.push(np);
      } else {
        let np1 = { ...p };
        let np2 = { ...p };
        np1.dir = "U";
        np2.dir = "D";
        next.push(np1);
        next.push(np2);
      }
    }

    next.forEach((x) => {
      x = move(x);
      if (!outOfBounds(x, grid) && !visited.has(hash(x))) {
        points.push(x);
      }
    });
  }

  return energised.size;
}

function hash(p: Point): string {
  return p.x.toString() + "," + p.y.toString() + p.dir;
}

function rotate(dir: Dir, mirror: string): Dir {
  const rot = new Map<Dir, Dir[]>([
    ["R", ["U", "D"]],
    ["L", ["D", "U"]],
    ["U", ["R", "L"]],
    ["D", ["L", "R"]],
  ]);
  return mirror === "/" ? rot.get(dir)[0] : rot.get(dir)[1];
}

function outOfBounds(p: Point, g: any[]) {
  return p.x > g[0].length - 1 || p.y > g.length - 1 || p.x < 0 || p.y < 0;
}

function move(p: Point) {
  switch (p.dir) {
    case "L":
      p.x = p.x - 1;
      break;
    case "R":
      p.x = p.x + 1;
      break;
    case "D":
      p.y = p.y + 1;
      break;
    case "U":
      p.y = p.y - 1;
      break;
  }
  return p;
}
