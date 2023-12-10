import { endianness } from "os";
import { getExampleInput, getPuzzleInput } from "../helper/inputs";

const example: string[] = getExampleInput(__dirname);
const input: string[] = getPuzzleInput(__dirname);

console.log(`Part 1 example: ${solve1(example)}`);
console.log(`Part 1 solution: ${solve1(input)}`);
console.log(`Part 2 example: ${solve2(example)}`);
console.log(`Part 2 solution: ${solve2(input)}`);

type Point = {
  v: string;
  x: number;
  y: number;
  d?: number;
  visited?: boolean;
};

function solve1(grid: string[]) {
  let points: Point[] = [];
  points.push(addStart(grid));
  points = findPath(points, grid);

  return points.length / 2;
}

function solve2(grid: string[], sum = 0) {
  let points: Point[] = [];
  points.push(addStart(grid));
  points = findPath(points, grid);

  let insidePoints = [];
  for (let y = 0; y < grid.length; y++) {
    let pathPoints = points.filter((p) => p.y === y);
    pathPoints.sort((n1, n2) => n1.x - n2.x);
    for (let i = 0; i < pathPoints.length - 1; i++) {
      let c = pathPoints[i];
      let botNb = getBotNeighbour(points, pathPoints[i]);
      if (!botNb) {
        continue;
      }

      for (let j = i; j < pathPoints.length; j++) {
        i = j;
        let b = getBotNeighbour(points, pathPoints[j]);
        if (b && directionUp(points, c) != directionUp(points, pathPoints[j])) {
          break;
        }
        if (pathPoints[j + 1].x - pathPoints[j].x > 1) {
          for (let a = pathPoints[j].x + 1; a < pathPoints[j + 1].x; a++) {
            insidePoints.push({ v: "I", x: a, y: y });
          }
        }
      }
    }
  }
  return insidePoints.length;
}

function getBotNeighbour(points: Point[], point: Point) {
  return points.filter(
    (p1) =>
      p1.x === point.x && p1.y === point.y + 1 && Math.abs(point.d - p1.d) == 1
  )[0];
}

function findPath(points: Point[], grid: string[]) {
  for (let i of points) {
    if (!i.visited) {
      i.visited = true;
      let nbs = getNb(grid, i.x, i.y, i.d);
      nbs.forEach((nb) => {
        if (inPoints(nb, points)) {
          //skip
        } else {
          points.push(nb);
        }
      });
    }
  }
  return points;
}

function directionUp(points: Point[], c: Point) {
  let pp = points.filter(
    (p1) => p1.x === c.x && p1.y === c.y + 1 && Math.abs(c.d - p1.d) == 1
  )[0];

  return c.d - pp.d == 1 ? true : false;
}

function addStart(grid: string[]) {
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      let c = grid[y][x];
      if (c === "S") {
        return { v: c, x: x, y: y, d: 0, visited: false };
      }
    }
  }
}

function inPoints(p: Point, points: Point[]) {
  return points.filter((i) => i.x == p.x && i.y == p.y).length > 0;
}

function getNb(grid: string[], x: number, y: number, d: number) {
  let nbs: Point[] = [];
  let c = grid[y][x];
  if (y - 1 >= 0) {
    const top = grid[y - 1][x];
    if (matchingPipe(c, top, "top")) {
      nbs.push({ v: top, x: x, y: y - 1, d: d + 1, visited: false });
    }
  }
  if (y + 1 < grid.length) {
    const bottom = grid[y + 1][x];
    if (matchingPipe(c, bottom, "bottom")) {
      nbs.push({ v: bottom, x: x, y: y + 1, d: d + 1, visited: false });
    }
  }
  if (x - 1 >= 0) {
    const left = grid[y][x - 1];
    if (matchingPipe(c, left, "left")) {
      nbs.push({ v: left, x: x - 1, y: y, d: d + 1, visited: false });
    }
  }
  if (x + 1 < grid[y].length) {
    const right = grid[y][x + 1];
    if (matchingPipe(c, right, "right")) {
      nbs.push({ v: right, x: x + 1, y: y, d: d + 1, visited: false });
    }
  }
  if (d == 0) {
    return nbs.slice(0, 1);
  }
  return nbs;
}

function matchingPipe(p1, p2, dir) {
  if (p2 == ".") {
    return false;
  }

  if (dir == "top") {
    if (inList(p1, ["S", "L", "J", "|"])) {
      return p2 == "7" || p2 == "|" || p2 == "F";
    }
    if (inList(p1, ["-", "7", "F"])) {
      return false;
    }
  }
  if (dir == "bottom") {
    if (inList(p1, ["S", "7", "F", "|"])) {
      return p2 == "J" || p2 == "|" || p2 == "L";
    }
    if (inList(p1, ["-", "J", "L"])) {
      return false;
    }
  }
  if (dir == "left") {
    if (inList(p1, ["S", "J", "7", "-"])) {
      return p2 == "F" || p2 == "-" || p2 == "L";
    }
    if (inList(p1, ["|", "L", "F"])) {
      return false;
    }
  }
  if (dir == "right") {
    if (inList(p1, ["S", "L", "F", "-"])) {
      return p2 == "J" || p2 == "-" || p2 == "7";
    }
    if (inList(p1, ["|", "J", "7"])) {
      return false;
    }
  }
}

function inList(element, arr) {
  return arr.indexOf(element) > -1;
}
