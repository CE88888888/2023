import { getExampleInput, getPuzzleInput } from "../helper/inputs";
import { lcm } from "../helper/crt";

const example: string[] = getExampleInput(__dirname);
const input: string[] = getPuzzleInput(__dirname);

console.log(`Part 1 example: ${solve1(example)}`);
console.log(`Part 1 solution: ${solve1(input)}`);
console.log(`Part 2 example: ${solve2(example)}`);
console.log(`Part 2 solution: ${solve2(input)}`);

function solve1(lines: string[], sum = 0) {
  let ins = lines[0];
  let maparr = lines.slice(2);
  let maps = [];
  maparr.forEach((m) => maps.push(parse(m)));
  sum = getEnd(ins, maps, "AAA", false);

  return sum;
}

function solve2(lines: string[], sum = 0) {
  let ins = lines[0];
  let maparr = lines.slice(2);
  let maps, cm = [];
  maparr.forEach((m) => maps.push(parse(m)));

  maps.forEach((m) => {
    if (m[0].indexOf("A") >= 0) {
      cm.push([m[0], 0]);
    }
  });

  let result = cm.map((x) => (x[1] = getEnd(ins, maps, x[0], true)));
  sum = result.reduce((acc, x) => lcm(acc, x));

  return sum;
}

function getEnd(ins: string, maps: any[], start: string, part2: boolean) {
  let cycleCount = 0;
  let found = false;
  let current = start;
  while (!found) {
    for (let i = 0; i < ins.length; i++) {
      if (found) {
        break;
      }
      let instruction = ins[i];
      let mi = maps.findIndex((x) => x[0] === current);
      if (instruction === "L") {
        current = maps[mi][1];
      } else {
        current = maps[mi][2];
      }
      cycleCount = cycleCount + 1;

      if (current == "ZZZ" && !part2) {
        found = true;
      }

      if (current.endsWith("Z") && part2) {
        found = true;
      }
    }
  }
  return cycleCount;
}

function parse(s: string) {
  return s
    .replaceAll(" ", "")
    .replaceAll("(", "")
    .replaceAll(")", "")
    .replaceAll("=", ",")
    .split(",");
}


