import { getExampleInput, getPuzzleInput } from "../helper/inputs";

const example: string[] = getExampleInput(__dirname);
const input: string[] = getPuzzleInput(__dirname);

console.log(`Part 1 example: ${solve1(example)}`);
console.log(`Part 1 solution: ${solve1(input)}`);
console.log(`Part 2 example: ${solve2(example)}`);
console.log(`Part 2 solution: ${solve2(input)}`);

type Springline = {
  record: string;
  groups: number[];
};

function solve1(lines: string[], sum = 0) {
  let springs = parse(lines);
  springs.forEach((s) => {
    sum = sum + findperms(s.record, s.groups);
  });
  return sum;
}

function solve2(lines: string[], sum = 0) {
  let springs = parse(lines);
  springs.forEach((s) => {
    let record = (s.record + "?").repeat(4) + s.record;
    let groups = s.groups.concat(s.groups, s.groups, s.groups, s.groups);
    sum = sum + findperms(record, groups);
  });
  return sum;
}

function findperms(record: string, groups: number[]) {
  let next: number[][] = [[1, 1, 1]];
  //Map does not allow multikey, Array doesn't work properly (it probaly saves its memory address).
  //Using an array is fine for part 1, for part 2 it gets too large.
  let perms = new Map<string, number>(); 
  perms.set("0 0", 1);

  for (let i = 0; i < record.length; i++) {
    let char = record[i];
    next = [];
    for (let [key, value] of perms) {
      let groupid = +key.split(" ")[0];
      let groupamount = +key.split(" ")[1];
      //Path 1
      if (char !== "#") {
        if (groupamount === 0) {
          next.push([groupid, groupamount, value]);
        } else { //add one
          if (groupamount === groups[groupid]) {
            next.push([groupid + 1, 0, value]);
          }
        }
      } //Path 2
      if (char !== ".") {
        if (groupid < groups.length && groupamount < groups[groupid]) {
          next.push([groupid, groupamount + 1, value]);
        }
      }
    }
    perms.clear(); 
    for (let i = 0; i < next.length; i++) {
      let [groupid, groupamount, value] = next[i];
      const key = groupid.toString() + " " + groupamount.toString();
      let current = perms.get(key) === undefined ? 0 : perms.get(key);
      perms.set(key, value + current);
    }
  }

  let result = 0;
  for (let [key, value] of perms) {
    let groupid = +key.split(" ")[0];
    let groupamount = +key.split(" ")[1];
    if (isValid(groupid, groupamount, groups)) {
      result = result + value;
    }
  }
  return result;
}

function isValid(groupid: number, groupamount: number, groups: number[]) {
  return (
    groupid == groups.length ||
    (groupid == groups.length - 1 && groupamount == groups[groupid])
  );
}

function parse(lines: string[]): Springline[] {
  let arr = [];
  lines.forEach((line) => {
    let [s, order] = line.split(" ");
    let groups = order.split(",").map((x) => +x);
    arr.push({ record: s, groups: groups });
  });
  return arr;
}