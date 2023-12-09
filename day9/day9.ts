import { getExampleInput, getPuzzleInput } from "../helper/inputs";

const example: string[] = getExampleInput(__dirname);
const input: string[] = getPuzzleInput(__dirname);

console.log(`Part 1 example: ${solve1(example)}`);
console.log(`Part 1 solution: ${solve1(input)}`);
console.log(`Part 2 example: ${solve2(example)}`);
console.log(`Part 2 solution: ${solve2(input)}`);

function solve1(lines: string[]) {
  const series = lines.map((x) => x.split(" ")).map((l) => l.map((v) => +v));
  let result = series.map((x) => getDif(x, 0) + x[x.length - 1]);
  return result.reduce((acc, c) => acc + c);
}

function solve2(lines: string[]) {
  let series = lines.map((x) => x.split(" ")).map((l) => l.map((v) => +v));
  series = series.map((x) => x.reverse());
  let result = series.map((x) => getDif(x, 0) + x[x.length - 1]);
  return result.reduce((acc, c) => acc + c);
}

function getDif(arr: number[], c: number) {
  let returnarr = [];
  for (let i = 0; i < arr.length - 1; i++) {
    returnarr.push(arr[i + 1] - arr[i]);
  }

  c = c + returnarr[returnarr.length - 1];
  return returnarr.every((x) => x === 0) ? c : getDif(returnarr, c);
}
