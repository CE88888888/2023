import { getExampleInput, getPuzzleInput } from "../helper/inputs";

const example: string[] = getExampleInput(__dirname);
const input: string[] = getPuzzleInput(__dirname);

let clear = 0;
let nosupport = 0;

console.log(`Part 1 example: ${solve1(example)}`);
console.log(`Part 1 solution: ${solve1(input)}`);
console.log(`Part 2 example: ${solve2(example)}`);
console.log(`Part 2 solution: ${solve2(input)}`);

type P = { x: number; y: number; z: number };
type Brick = { s: P; e: P };

function solve1(lines: string[], sum = 0) {
  let stack = shitBricks(lines);
  stack = rainBricks(stack);
  stack = sortBricks(stack)
  stack = rainBricks(stack);
  stack = rainBricks(stack);
  stack = rainBricks(stack);
  stack = rainBricks(stack);
  stack = rainBricks(stack);
  stack = sortBricks(stack);
  sum = desintegrateBricks(stack);

  console.log(clear);
  return sum; //147, 149 too low //672 too high
}

function solve2(lines: string[], sum = 0) {
  return sum;
}

function shitBricks(lines: string[]) {
  let result: Brick[] = [];
  lines.forEach((l) => {
    let [x1, y1, z1, x2, y2, z2] = l.replace("~", ",").split(",");
    result.push({
      s: { x: +x1, y: +y1, z: +z1 },
      e: { x: +x2, y: +y2, z: +z2 },
    });
  });

  return result;
}
function rainBricks(stack: Brick[]): Brick[] {
  const { minD, maxD } = getDimSizes(stack, "z");

  for (let i = 0; i < stack.length; i++) {
    let brick = stack[i];
    if (brick.s.z == 1) continue;
    if (!canDrop(stack, brick)) continue;
    brick.s.z = brick.s.z - 1;
    brick.e.z = brick.e.z - 1;
    i--;
  }
  return stack;
}

function canDrop(stack: Brick[], brick: Brick) {
  if (brick.s.z === 1) return false;

  let zslice = stack.filter(
    (b) => brick.s.z - 1 >= b.s.z && brick.s.z - 1 <= b.e.z
  );
  if (zslice.length > 0) {
    if (zslice.some((zb) => xyOverlap(brick, zb))) {
      return false;
    }
  }

  return true;
}

function canDropAlt(stack: Brick[], brick: Brick) {
  if (brick.s.z === 1) return false;

  let zslice = stack.filter(
    (b) => brick.s.z - 1 >= b.s.z && brick.s.z - 1 <= b.e.z
  );
  
  if (zslice.length > 0) {
    if (zslice.some((zb) => xyOverlap(brick, zb))) {
      return false;
    }
  }


  return true;
}

function desintegrateBricks(stack: Brick[]) {
  let count = 0;
  for (let i = 0; i < stack.length; i++) {
    let brick = stack[i];
    let copyStack = Array.from(stack);
    copyStack.splice(i, 1);
    let zslice = copyStack.filter(
      (b) => brick.e.z + 1 == b.s.z //&& brick.s.z + 1 <= b.e.z
    );

    if (zslice.length > 0 && !zslice.some((zb) => canDrop(copyStack, zb))) {
      count++;
    } else {
    if (nothingabove(copyStack, brick)) {
      console.log("niks erboven")
      count++
    }
    }
  }
  return count;
}

function getDimSizes(stack: Brick[], dim: "x" | "y" | "z") {
  let minDim = 0;
  let maxDim = 0;
  switch (dim) {
    case "y":
      maxDim = stack.map((b) => b.e.z).reduce((acc, v) => Math.max(acc, v));
      minDim = stack.map((b) => b.s.z).reduce((acc, v) => Math.min(acc, v)); //assume start end is ordered in input
      break;
    case "y":
      maxDim = stack.map((b) => b.e.y).reduce((acc, v) => Math.max(acc, v));
      minDim = stack.map((b) => b.s.y).reduce((acc, v) => Math.min(acc, v)); //assume start end is ordered in input
      break;
    case "z":
      maxDim = stack.map((b) => b.e.z).reduce((acc, v) => Math.max(acc, v));
      minDim = stack.map((b) => b.s.z).reduce((acc, v) => Math.min(acc, v)); //assume start end is ordered in input
      break;
    default:
      break;
  }
  return { minD: minDim, maxD: maxDim };
}

function xyOverlap(b1: Brick, b2: Brick): boolean {
  let x = arrayRange(b1.s.x, b1.e.x, 1);
  let y = arrayRange(b1.s.y, b1.e.y, 1);
  let overlapX = false;
  let overlapY = false;

  for (let i = b2.s.x; i <= b2.e.x; i++) {
    if (x.includes(i)) {
      overlapX = true;
    }
  }
  for (let i = b2.s.y; i <= b2.e.y; i++) {
    if (y.includes(i)) {
      overlapY = true;
    }
  }

  return overlapX && overlapY;
}

function arrayRange(start, end, step) {
  return Array.from(
    { length: (end - start) / step + 1 },
    (value, index) => start + index * step
  );
}

function sortBricks(bricks: Brick[]) {
  bricks.sort((b1, b2) => {
    if (b1.s.z !== b2.s.z) {
      return b1.s.z - b2.s.z;
    }
    if (b1.s.y !== b2.s.y) {
      return b1.s.y - b2.s.y;
    }
    if (b1.s.x !== b2.s.x) {
      return b1.s.x - b2.s.x;
    }
    return 0;
  });

  return bricks;
}

function nothingabove(stack: Brick[], brick: Brick): boolean {
  let zslice = stack.filter(
    (b) => brick.e.z + 1 === b.s.z //&& brick.e.z + 1 <= b.e.z
  );

  // let newbrick = {  s: { x: brick.s.x, y: brick.s.y, z: brick.s.z+1 },
  // e: { x: brick.e.x, y: brick.e.y, z: brick.e.z+1 },}

  let clearAbove = true;

  for (let i = 0; i < zslice.length; i++) {
    const zb = zslice[i];

    if (xyOverlap(brick, zb)) {
      clearAbove = false;
    }
  }

  clear = clearAbove ? clear + 1 : clear;
  return clearAbove;
}
