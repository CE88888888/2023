import { getExampleInput, getPuzzleInput } from "../helper/inputs";

const example: string[] = getExampleInput(__dirname);
const input: string[] = getPuzzleInput(__dirname);

console.log(`Part 1 example: ${solve1(example)}`);
console.log(`Part 1 solution: ${solve1(input)}`);
console.log(`Part 2 example: ${solve2(example)}`);
console.log(`Part 2 solution: ${solve2(input)}`);

function solve1(lines: string[], product = 1) {
  const races = parse(lines);
  races.forEach((race) => {
    product = product * getAmountofSolutions(race[0], race[1]);
  });

  return product;
}

function solve2(lines: string[]) {
  const time = +lines[0].replaceAll(" ", "").replace("Time:", "");
  const distance = +lines[1].replaceAll(" ", "").replace("Distance:", "");
  return getAmountofSolutions(time, distance);
}

function getAmountofSolutions(time: number, distance: number) {
  let disc = time * time - 4 * (-1 * -distance);
  let left = Math.round((-time + Math.sqrt(disc)) / -2);
  let right = Math.round((-time - Math.sqrt(disc)) / -2);

  let x1 = (checkIntersect(left)) ? left : left+1 
  let x2 = (checkIntersect(right)) ? right : right-1
  return x2 - x1 + 1;

  function checkIntersect(x: number) {
    return x * time - x * x > distance;
  }
}

function parse(lines: string[]) {
  let arr = [];
  for (let l = 0; l < 2; l++) {
    let [hd, ...tl] = lines[l].split(" ").filter((x) => x)
    arr.push(tl.map((x) => +x));
  }

  let races = [];
  for (let i = 0; i < arr[0].length; i++) {
    races.push([arr[0][i], arr[1][i]]);
  }

  return races;
}
