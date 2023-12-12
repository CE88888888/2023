import { getExampleInput, getPuzzleInput } from "../helper/inputs";

const example: string[] = getExampleInput(__dirname);
const input: string[] = getPuzzleInput(__dirname);
const cache = new Map<string, number>();

console.log(`Part 1 example: ${solve1(example)}`);
console.log(`Part 1 solution: ${solve1(input)}`);
console.log(`Part 2 example: ${solve2(example)}`);
console.log(`Part 2 solution: ${solve2(input)}`);

type Spring = {
  record: string;
  groups: number[];
};

function solve1(lines: string[], sum = 0) {
  let springs = parse(lines);
  springs.forEach((s) => {
    let ct = count(s.record, s.groups);
    sum = sum + ct;
  });

  return sum;
}

function solve2(lines: string[], sum = 0) {
  let springs = parse(lines);

  springs.forEach((s) => {
    s.record = (s.record + "?").repeat(4) + s.record;
    s.groups = s.groups.concat(s.groups, s.groups, s.groups, s.groups);
    sum = sum + count(s.record, s.groups);
    sum = sum;
  });

  return sum;
}

function count(rec: string, groups: number[]): number {
  let result = 0;
  let signature = `${rec}${groups.join()}`;

  if (groups.length === 0) {
    return rec.includes("#") ? 0 : 1;
  }

  if (cache.has(signature)) {
    return cache.get(signature);
  }

  if (rec[0] === "." || rec[0] === "?") {
    result = result + count(rec.slice(1), groups);
  }
  
  if (rec[0] === "#" || rec[0] === "?") {
    if (
      groups[0] <= rec.length &&
      !rec.slice(0, groups[0]).includes(".") &&
      rec[groups[0]] !== "#" //cant insert next to #
    ) {
      result = result + count(rec.slice(groups[0] + 1), groups.slice(1));
    }
  }

  cache.set(signature, result);
  return result;
}

function parse(lines: string[]) {
  let arr: Spring[] = [];
  lines.forEach((line) => {
    let [s, groups] = line.split(" ");
    let spring: Spring = {
      record: s,
      groups: groups.split(",").map((g) => +g),
    };
    arr.push(spring);
  });
  return arr;
}
