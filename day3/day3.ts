import { getExampleInput, getPuzzleInput } from "../helper/inputs";

const example: string[] = getExampleInput(__dirname);
const input: string[] = getPuzzleInput(__dirname);

console.log(`Part 1 example: ${solve1(example)}`);
console.log(`Part 1 solution: ${solve1(input)}`);
console.log(`Part 2 example: ${solve2(example)}`);
console.log(`Part 2 solution: ${solve2(input)}`);

function solve1(lines: string[], sum = 0) {
  const grid = createGrid(lines);
  const checkfn = function (x: number, y: number) {
    return isNaN(+grid[x][y]) && grid[x][y] !== ".";
  };

  findParts(grid, checkfn).forEach((p) => (sum = sum + p[0]));
  return sum;
}

function solve2(lines: string[], sum = 0) {
  const grid = createGrid(lines);
  const checkfn = function (x: number, y: number) {
    return grid[x][y] === "*";
  };

  let parts = findParts(grid, checkfn);
  let gearpositions = new Set();
  parts.forEach((p) => gearpositions.add(p[1]));

  gearpositions.forEach((pos) => {
    const combo = parts.filter((p) => p[1] === pos);
    if (combo.length > 1) {
      sum = sum + combo[0][0] * combo[1][0];
    }
  });

  return sum;
}

function createGrid(lines: string[]) {
  let g: string[][] = [];
  lines.forEach((line) => g.push([...line]));
  return g;
}

function findParts(grid: string[][], checkfn: Function) {
  let parts = [];

  for (let r = 0; r < grid.length; r++) {
    let row = [...grid[r]];
    for (let c = 0; c < row.length; c++) {
      let partstring = "";
      if (!isNaN(+row[c])) {
        let specialFound = false;
        partstring = partstring + row[c];
        specialFound = checkSurrounding(c, r, grid, checkfn);
        while (c + 1 < row.length && !isNaN(+row[c + 1])) {
          if (!isNaN(+row[c + 1])) {
            partstring = partstring + row[c + 1];
            let cg = checkSurrounding(c + 1, r, grid, checkfn);
            if (cg && !specialFound) {
              specialFound = cg;
            }
            c++;
          } else {
            break;
          }
        }
        if (specialFound) {
          parts.push([+partstring, specialFound]);
        }
      }
    }
  }
  return parts;
}

function checkSurrounding(
  c: number,
  r: number,
  grid: string[][],
  checkfn: Function
) {
  let result = null;
  //lt
  if (r > 0 && c > 0) {
    result = check(r - 1, c - 1, checkfn, result);
  }
  //mt
  if (r > 0) {
    result = check(r - 1, c, checkfn, result);
  }
  //rt
  if (r > 0 && c < grid[0].length - 1) {
    result = check(r - 1, c + 1, checkfn, result);
  }
  //lm
  if (c > 0) {
    result = check(r, c - 1, checkfn, result);
  }
  //rm
  if (c < grid[0].length - 1) {
    result = check(r, c + 1, checkfn, result);
  }
  //bl
  if (r < grid.length - 1 && c > 0) {
    result = check(r + 1, c - 1, checkfn, result);
  }
  //bm
  if (r < grid.length - 1) {
    result = check(r + 1, c, checkfn, result);
  }
  //br
  if (r < grid.length - 1 && c < grid[0].length - 1) {
    result = check(r + 1, c + 1, checkfn, result);
  }

  return result;
}

function check(x: number, y: number, fn: Function, current: any) {
  if (fn(x, y)) {
    return x.toString() + y.toString();
  }
  return current;
}
