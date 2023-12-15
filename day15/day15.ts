import { getExampleInput, getPuzzleInput } from "../helper/inputs";

const example: string[] = getExampleInput(__dirname);
const input: string[] = getPuzzleInput(__dirname);

console.log(`Part 1 example: ${solve1(example)}`);
console.log(`Part 1 solution: ${solve1(input)}`);
console.log(`Part 2 example: ${solve2(example)}`);
console.log(`Part 2 solution: ${solve2(input)}`);

type Lens = {
  raw: string;
  label: string;
  op: string;
  f: number;
  box: number;
};

function solve1(lines: string[], sum = 0) {
  let ls = lines[0].split(",");
  sum = ls.reduce((acc, x) => acc + hash(x), 0)
  return sum;
}

function solve2(lines: string[], sum = 0) {
  let lenses: Lens[] = parseLenses(lines);
  let boxes = new Map<number, Lens[]>();

  lenses.forEach((l: Lens) => {
    let cbox = boxes.get(l.box) ? boxes.get(l.box) : [];
    let gotlens = cbox.filter((f) => f.label === l.label).length > 0;
    if (l.op === "=") {
      cbox.map((f) => {
        if (f.label === l.label) {
          f.f = l.f;
          f.raw = l.raw;
        }
      });
    }
    if (l.op === "=" && !gotlens) {
      cbox.push(l);
    }
    if (l.op === "-" && gotlens) {
      cbox = cbox.filter((f) => f.label !== l.label);
    }
    boxes.set(l.box, cbox);
  });

  boxes.forEach((s) => {
    let boxsum = 0;
    if (s.length > 0) {
      let b = s[0].box + 1;
      for (let i = 0; i < s.length; i++) {
        boxsum = boxsum + b * (i + 1) * s[i].f;
      }
    }
    sum = sum + boxsum;
  });

  return sum;
}

function hash(line: string) {
  let result = 0;
  for (let i = 0; i < line.length; i++) {
    result = result + line.charCodeAt(i);
    result = result * 17;
    result = result % 256;
  }
  return result;
}

function parseLenses(lines: string[]) {
  lines = lines[0].split(",");
  let lenses: Lens[] = [];
  lines.forEach((l) => {
    let op = l.includes("=") ? "=" : "-";
    let splitstring = l.split(op);
    lenses.push({
      label: splitstring[0],
      op: op,
      f: +splitstring[1],
      raw: l,
      box: hash(splitstring[0]),
    });
  });
  return lenses;
}
