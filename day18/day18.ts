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
  c: string;
};

function solve1(lines: string[], sum = 0) {
  const instructions = parse(lines);
  const points = drawMap(instructions);
  points.sort((p1, p2) => {
    if (p1.x > p2.x) {
      return 1;
    }
    if (p1.x < p2.x) {
      return -1;
    }
    if (p1.y > p2.y) {
      return 1;
    }
    if (p1.y < p2.y) {
      return -1;
    }
  });

  let xmin = points.map((p) => p.x).reduce((acc, x) => Math.min(x, acc));
  let ymin = points.map((p) => p.y).reduce((acc, y) => Math.min(y, acc));
  let xmax = points.map((p) => p.x).reduce((acc, x) => Math.max(x, acc));
  let ymax = points.map((p) => p.y).reduce((acc, y) => Math.max(y, acc));

  for (let y = ymin; y < ymax + 1; y++) {
    for (let x = xmin; x < xmax + 1; x++) {
      if (onBorder(points, x, y)) {
        sum++;
        continue;
      }
      if (outside(points, x, y)) {
        continue;
      }
      sum++;
    }
  }

  let x = 0
  let y = 0
  for (let i = 0; i < instructions.length-1; i= i+2) {
        
  }

  console.log(xmin, xmax, ymin, ymax);

  return sum; //76913, 76809, 76579 too high
}

function onBorder(points: Point[], x: number, y: number) {
  return points.filter((p) => p.x === x && p.y === y).length > 0;
}

function outside(points: Point[], x: number, y: number) {
  //Points are sorted
  const col = points.filter((p) => p.x === x);
  const row = points.filter((p) => p.y === y);
  let xmin = row.map((p) => p.x).reduce((acc, x) => Math.min(x, acc));
  let ymin = col.map((p) => p.y).reduce((acc, y) => Math.min(y, acc));
  let xmax = row.map((p) => p.x).reduce((acc, x) => Math.max(x, acc));
  let ymax = col.map((p) => p.y).reduce((acc, y) => Math.max(y, acc));
  // if (x < row[0].x || x > row[row.length - 1].x) {
  if (x < xmin || x > xmax) {
    return true;
  }
  // if (y < col[0].y || y > col[col.length - 1].y) {
  if (y < ymin || y > ymax) {
    return true;
  }

  // if (scanRow(points, y, x)) {
  //   return true
  // }

  // if (scanCol(points, x, y)) {
  //   return true
  // }

  
  // if (scanRow(points, y, x) && scanCol(points, x, y)) {
  //   return false
  // }

  return false;
}

function scanRow(points: Point[], r: number, x: number) {
  const row = points.filter((p) => p.y === r).map((n) => n.x);
  row.sort();
  let inside = false;
  let borderstart = false;
  //find first x > row[0] but not in row
  for (let i = row[0]; i < row[row.length]; i++) {
    if (row.includes(i) && !borderstart) {
      borderstart = true;
      inside = inside ? false : true;
      continue
    }
    if ((borderstart && row.includes(i))) {
      continue;
    }
    if (borderstart && !row.includes(i)) {
      if (i === x && inside) {
        return true;
      }
      borderstart = false;
    }
  }
  return false;
}

function scanCol(points: Point[], c: number, y: number) {
  const row = points.filter((p) => p.y === c).map((n) => n.y);
  row.sort();
  let inside = false;
  let borderstart = false;
  //find first x > row[0] but not in row
  for (let i = row[0]; i < row[row.length]; i++) {
    if (row.includes(i) && !borderstart) {
      borderstart = true;
      inside = inside ? false : true;
    }
    if ((borderstart && row.includes(i))) {
      continue;
    }
    if (borderstart && !row.includes(i)) {
      if (i === y && inside) {
        return true;
      }
      borderstart = false;
    }
  }
  return false;
}

function solve2(lines: string[], sum = 0) {
  return sum;
}

function drawMap(instructions: any[][]) {
  let x = 0;
  let y = 0;
  let points: Point[] = [];
  for (let i = 0; i < instructions.length; i++) {
    let [dir, amount, rgb] = instructions[i];
    for (let j = 0; j < amount; j++) {
      if (dir == "U") {
        y--;
        points.push({ x: x, y: y, c: amount });
      }
      if (dir == "R") {
        x++;
        points.push({ x: x, y: y, c: amount });
      }
      if (dir == "D") {
        y++;
        points.push({ x: x, y: y, c: amount });
      }
      if (dir == "L") {
        x--;
        points.push({ x: x, y: y, c: amount });
      }
    }
  }
  return points;
}

function parse(lines: string[]) {
  let instructions = [];
  lines.forEach((l) => {
    let [dir, amount, rgb] = l.split(" ");
    instructions.push([dir, +amount, rgb]);
  });

  return instructions;
}
