import { getExampleInput, getPuzzleInput } from "../helper/inputs";

const example: string[] = getExampleInput(__dirname);
const input: string[] = getPuzzleInput(__dirname);

console.log(`Part 1 example: ${solve1(example)}`);
console.log(`Part 1 solution: ${solve1(input)}`);
console.log(`Part 2 example: ${solve2(example)}`);
console.log(`Part 2 solution: ${solve2(input)}`);

type WF = { id: string; rules: Rule[] };
type Rule = { r: string; dest: string };

function solve1(lines: string[], sum = 0) {
  const { parts, workflows } = parse(lines);
  const success_rules: string[] = filterAcceptationRules(workflows);

  parts.forEach((p) => {
    if (anyRuleTrue(success_rules, p[0], p[1], p[2], p[3])) {
      sum = sum + p[0] + p[1] + p[2] + p[3];
    }
  });
  return sum;
}

function solve2(lines: string[], sum = 0) {
  const { parts, workflows } = parse(lines);
  const success_rules: string[] = filterAcceptationRules(workflows);

  success_rules.forEach((a) => {
    sum = sum + calcCombinations(a.split(" && "));
  });

  return sum;
}

function calcCombinations(arr: string[]) {
  let [xmin, xmax, mmin, mmax, amin, amax, smin, smax] = [
    0, 4001, 0, 4001, 0, 4001, 0, 4001,
  ];

  arr.forEach((r) => {
    let v = r[0];
    let amount = +r.slice(2);
    if (r[1] === ">") {
      if (v === "x") xmin = Math.max(xmin, amount);
      if (v === "m") mmin = Math.max(mmin, amount);
      if (v === "a") amin = Math.max(amin, amount);
      if (v === "s") smin = Math.max(smin, amount);
    }
    if (r[1] === "<") {
      if (v === "x") xmax = Math.min(xmax, amount);
      if (v === "m") mmax = Math.min(mmax, amount);
      if (v === "a") amax = Math.min(amax, amount);
      if (v === "s") smax = Math.min(smax, amount);
    }
  });

  const xc = xmax - xmin - 1;
  const mc = mmax - mmin - 1;
  const ac = amax - amin - 1;
  const sc = smax - smin - 1;
  return xc * mc * ac * sc;
}

function anyRuleTrue(rules: string[], x, m, a, s) {
  let result = false;
  rules.forEach((r) => {
    if (eval(r)) {
      result = true;
    }
  });
  return result;
}

function flattenWF(wfs: WF[], id: string) {
  if (id === "A" || id === "R") {
    return { id: id, rules: [{ r: "true", dest: id }] };
  }

  const wf: WF = wfs.find((w) => w.id === id);
  let newrules = [];
  for (let i = 0; i < wf.rules.length; i++) {
    let next = flattenWF(wfs, wf.rules[i].dest);
    next.rules.forEach((nr) => {
      let x = wf.rules[i].r + " && " + nr.r;
      newrules.push({ r: x, dest: nr.dest });
    });

    if (i !== wf.rules.length - 1 && wf.rules[i].r.length > 0) {
      wf.rules[i + 1].r =
        changeCompare(wf.rules[i].r) + " && " + wf.rules[i + 1].r;
    }
  }
  if (newrules.length > 0) {
    wf.rules = newrules;
  }

  return wf;
}

function changeCompare(s: string) {
  const i = s.lastIndexOf(">");
  const j = s.lastIndexOf("<");
  if (i > -1 && i > j) {
    s = s.slice(0, i) + "<" + (+s.slice(i + 1) + 1).toString();
  } else {
    if (j > -1) {
      s = s.slice(0, j) + ">" + (+s.slice(j + 1) - 1).toString();
    }
  }
  return s;
}

function filterAcceptationRules(workflows: any[]) {
  const flatWF: WF = flattenWF(workflows, "in");
  const accRules = flatWF.rules.filter((r) => r.dest === "A");

  let acc: string[] = accRules.map((a) => a.r.replaceAll("p.", ""));
  acc = acc.map((a) => a.replaceAll(" && true", ""));
  return acc;
}

function parse(lines: string[]) {
  let i = lines.findIndex((s) => s === "");
  const wfline = lines.slice(0, i);
  const partline = lines.slice(i + 1).map((s) => s.slice(1, -1));

  const parts: number[][] = [];
  partline.forEach((pl) => {
    const arr = pl.split(",").map((s) => s.slice(2));
    parts.push([+arr[0], +arr[1], +arr[2], +arr[3]]);
  });

  const workflows: WF[] = [];
  wfline.forEach((wf) => {
    const id = wf.split("{")[0];
    const wfarr = wf.split("{")[1].slice(0, -1);
    workflows.push({ id: id, rules: createRules(wfarr.split(",")) });
  });

  return { parts: parts, workflows: workflows };
}

function createRules(arr: string[]) {
  const rules: Rule[] = [];
  for (let i = 0; i < arr.length; i++) {
    let [r, d] = arr[i].split(":");
    let rc = "p." + r;
    if (d === undefined) {
      d = r;
      rc = "true";
    }
    rules.push({ r: rc, dest: d });
  }
  return rules;
}
