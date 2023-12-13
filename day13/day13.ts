import { getExampleInputRaw, getPuzzleInputRaw } from "../helper/inputs";

const example: string = getExampleInputRaw(__dirname);
const input: string = getPuzzleInputRaw(__dirname);

console.log(`Part 1 example: ${solve(example)}`);
console.log(`Part 1 solution: ${solve(input)}`);
console.log(`Part 2 example: ${solve(example, true)}`);
console.log(`Part 2 solution: ${solve(input, true)}`);

function solve(lines: string, part2 = false) {
  let patterns = parse(lines);
  let coltotal = 0;
  let rowtotal = 0;

  patterns.forEach((p) => {
    coltotal = coltotal + getColMirror(p, part2);
    rowtotal = rowtotal + getRowMirror(p, part2);
  });

  return 100 * coltotal + rowtotal;
}

function getRowMirror(arr: string[], part2 = false) {
  let tparr = [];
  for (let i = 0; i < arr[0].length; i++) {
    let row2col = "";
    for (let j = arr.length - 1; j >= 0; j--) {
      row2col = row2col + arr[j][i];
    }
    tparr.push(row2col);
  }
  let result = getColMirror(tparr, part2);
  return result;
}

function getColMirror(arr: string[], part2 = false) {
  let t = [];

  if (part2) {
    arr.forEach((v, i) => {
      let smudgeidx = smudgepare(arr[i], arr[i + 1]);
      if (smudgeidx > -1) {
        t.push(i);
      }
    });
  }
  arr.forEach((v, i) => {
    if (arr[i] === arr[i + 1]) {
      t.push(i);
    }
    arr[i] === arr[i + 1];
  });

  if (t.length == 0) {
    return 0;
  }

  if (t.length == 1) {
    let mirrored = isMirroredWrapped(t[0], arr, part2);
    return mirrored ? t[0] + 1 : 0;
  }

  if (t.length > 1) {
    let fold = t.filter((x) => isMirroredWrapped(x, arr, part2));
    if (fold.length == 1) {
      return fold[0] + 1;
    }
  }

  return 0;
}

function isMirroredWrapped(t: number, arr: string[], part2 = false) {
  let x = Math.min(t, arr.length - t - 2);
  let top = arr.slice(t - x, t + 1);
  let bot = arr.slice(t + 1, t + 1 + x + 1).reverse();

  if (!part2) {
    return isMirrored(top, bot);
  }

  let mirrored = false;
  for (let i = 0; i < top.length; i++) {
    let sidx = smudgepare(top[i], bot[i]);
    if (sidx > -1) {
      let temptop = top;
      temptop[i] = bot[i];
      mirrored = isMirrored(temptop, bot);
    }
  }

  return mirrored;
}

function isMirrored(top: string[], bot: string[]) {
  let mirrored = true;
  for (let i = 0; i < top.length; i++) {
    if (bot[i] !== top[i]) {
      mirrored = false;
    }
  }
  return mirrored;
}

function smudgepare(s1: string, s2: string) {
  if (!s2) {
    return -1;
  }
  const arr1 = [...s1];
  const arr2 = [...s2];

  let difis = [];
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) {
      difis.push(i);
    }
  }
  return difis.length == 1 ? difis[0] : -1;
}

function parse(lines: string) {
  return lines.split("\r\n\r\n").map((x) => x.split("\r\n"));
}
