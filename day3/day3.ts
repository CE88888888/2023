import { getExampleInput, getPuzzleInput } from "../helper/inputs";

const example: string[] = getExampleInput(__dirname);
const input: string[] = getPuzzleInput(__dirname);

console.log(`Part 1 example: ${solve1(example)}`);
console.log(`Part 1 solution: ${solve1(input)}`);
console.log(`Part 2 example: ${solve2(example)}`);
console.log(`Part 2 solution: ${solve2(input)}`);

function solve1(lines: string[], sum = 0) {
  const grid = createGrid(lines);
  findParts(grid).forEach((p) => (sum = sum + p));
  return sum;
}

function solve2(lines: string[], sum = 0) {
  const grid = createGrid(lines);
  let parts = findPartsWithGear(grid);

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

function findParts(grid: string[][]) {
  let parts = [];
  const checkfn = function (x: number, y: number) {
    return isNaN(+grid[x][y]) && grid[x][y] !== ".";
  };

  for (let r = 0; r < grid.length; r++) {
    let row = [...grid[r]];
    for (let c = 0; c < row.length; c++) {
      const value = row[c];
      let partstring = "";
      if (!isNaN(+value)) {
        let symbolfound = false;
        partstring = partstring + value;
        symbolfound = checkSurrounding(c, r, grid, checkfn);
        let i = c + 1;
        while (i < row.length && !isNaN(+row[i])) {
          if (!isNaN(+row[i])) {
            partstring = partstring + row[i];
            if (checkSurrounding(c + 1, r, grid, checkfn) && !symbolfound) {
              symbolfound = true;
            }
            i++;
            c++;
          } else {
            break;
          }
        }
        if (symbolfound) {
          parts.push(+partstring);
        }
      }
    }
  }
  return parts;
}

function findPartsWithGear(grid: string[][]) {
  let parts = [];
  const checkfn = function (x: number, y: number) {
    return grid[x][y] === "*";
  };

  for (let r = 0; r < grid.length; r++) {
    let row = [...grid[r]];
    //row init
    for (let c = 0; c < row.length; c++) {
      const value = row[c];
      let partstring = "";
      if (!isNaN(+value)) {
        let gearfound = null;
        partstring = partstring + value;
        //gearfound = checkForGear(c, r, grid, checkfn);
        gearfound = checkSurrounding(c, r, grid, checkfn);
        let i = c + 1;
        while (i < row.length && !isNaN(+row[i])) {
          if (!isNaN(+row[i])) {
            partstring = partstring + row[i];
            let cg = checkSurrounding(c + 1, r, grid, checkfn);
            if (cg && !gearfound) {
              gearfound = cg;
            }
            i++;
            c++;
          } else {
            break;
          }
        }
        if (gearfound) {
          parts.push([+partstring, gearfound]);
        }
      }
    }
  }
  return parts;
}

function checkSurrounding(c: number, r: number, grid: string[][], checkfn: Function) {
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
