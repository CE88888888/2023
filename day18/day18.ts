import { getExampleInput, getPuzzleInput } from "../helper/inputs";

const example: string[] = getExampleInput(__dirname);
const input: string[] = getPuzzleInput(__dirname);

console.log(`Part 1 example: ${solve1(example)}`);
const t0 = performance.now();
console.log(`Part 1 solution: ${solve1(input)}`);
const t1 = performance.now();
console.log(`Call to Solve 1 took ${t1 - t0} milliseconds.`);
console.log(`Part 2 example: ${solve2(example)}`);
const t2 = performance.now();
console.log(`Part 2 solution: ${solve2(input)}`);
const t3 = performance.now();
console.log(`Call to Solve 2 took ${t3 - t2} milliseconds.`);

type Point = {
  x: number;
  y: number;
};

function solve1(lines: string[], sum = 0) {
  const instructions = parse(lines);
  const { points, ymin, ymax } = drawMap(instructions);
  sum = points.length;

  for (let y = ymin; y < ymax + 1; y++) {
    const row = points.filter((p) => p.y === y);
    const insideRow = rowScan(points, row);
    for (let x = row[0].x; x < row[row.length - 1].x + 1; x++) {
      if (insideRow.includes(x)) {
        sum++;
      }
    }
  }
  return sum;
}

function solve2(lines: string[], sum = 0) {
  const instructions = parsePart2(lines);
  let { points, total } = drawCorners(instructions);
  points.unshift({ x: 0, y: 0 });

  for (let i = 0; i < points.length; i++) {
    const cur = points[i];
    const prev = i === 0 ? points[points.length - 1] : points[i - 1];
    const next = i === points.length - 1 ? points[0] : points[i + 1];
    sum = sum + cur.y * (prev.x - next.x);
  }

  let inner = Math.abs(sum) / 2;
  let boundary = total / 2 + 1;

  return inner + boundary;
}

function rowScan(points: Point[], row: Point[]) {
  let pointSegments = [];
  let cur = [row[0]];

  for (let i = 1; i < row.length; i++) {
    let prev = cur[cur.length - 1];
    let current = row[i];
    if (Math.abs(current.x - prev.x) === 1) {
      cur.push(current);
    } else {
      pointSegments.push(cur);
      cur = [current];
    }
  }
  pointSegments.push(cur);

  let insides = [];
  let open = is_S_shape(pointSegments[0]) ? true : false;
  for (let i = 1; i < pointSegments.length; i++) {
    const s = pointSegments[i];
    const p = pointSegments[i - 1];
    if (open) {
      for (let x = p[p.length - 1].x + 1; x < s[0].x; x++) {
        insides.push(x);
      }
    }
    if (s.length === 1) {
      open = open ? false : true;
    } else {
      if (is_S_shape(s)) {
        open = open ? false : true;
      }
    }
  }

  return insides;

  function is_S_shape(s: any) {
    const firstU = points.filter(
      (p) => s[0].x === p.x && s[0].y - 1 === p.y
    ).length;
    const firstD = points.filter(
      (p) => s[0].x === p.x && s[0].y + 1 === p.y
    ).length;
    const lastU = points.filter(
      (p) => s[s.length - 1].x === p.x && s[s.length - 1].y - 1 === p.y
    ).length;
    const lastD = points.filter(
      (p) => s[s.length - 1].x === p.x && s[s.length - 1].y + 1 === p.y
    ).length;
    return (firstU && lastD) || (firstD && lastU);
  }
}

function drawMap(instructions: any[][]) {
  let ymin = 0;
  let ymax = 0;
  let x = 0;
  let y = 0;
  let points: Point[] = [];
  for (let i = 0; i < instructions.length; i++) {
    let [dir, amount] = instructions[i];
    for (let j = 0; j < amount; j++) {
      if (dir == "U") y--;
      if (dir == "R") x++;
      if (dir == "D") y++;
      if (dir == "L") x--;
      points.push({ x: x, y: y });
      ymin = Math.min(ymin, y);
      ymax = Math.max(ymax, y);
    }
  }
  sortPoints(points);
  return { points: points, ymin: ymin, ymax: ymax };
}

function drawCorners(instructions: any[][]) {
  let x = 0;
  let y = 0;
  let points: Point[] = [];
  let total = 0;
  for (let i = 0; i < instructions.length; i++) {
    let [dir, amount] = instructions[i];
    total = total + amount;
    if (dir == "U") y = y - amount;
    if (dir == "R") x = x + amount;
    if (dir == "D") y = y + amount;
    if (dir == "L") x = x - amount;
    points.push({ x: x, y: y });
  }
  return { points: points, total: total };
}

function parse(lines: string[]) {
  let instructions = [];
  lines.forEach((l) => {
    let [dir, amount, rgb] = l.split(" ");
    instructions.push([dir, +amount, rgb]);
  });
  return instructions;
}

function parsePart2(lines: string[]) {
  let instructions = [];
  lines.forEach((l) => {
    let ri = l.split(" ")[2];
    let hex = ri.slice(2, 7);
    let direction = ri[7];
    if (direction === "0") direction = "R";
    if (direction === "1") direction = "D";
    if (direction === "2") direction = "L";
    if (direction === "3") direction = "U";
    const amount: number = parseInt(hex, 16);
    instructions.push([direction, amount]);
  });
  return instructions;
}

function sortPoints(points: Point[]) {
  points.sort((p1, p2) => {
    if (p1.x > p2.x) return 1;
    if (p1.x < p2.x) return -1;
    if (p1.y > p2.y) return 1;
    if (p1.y < p2.y) return -1;
  });
}
