import { getExampleInput, getPuzzleInput } from "../helper/inputs";
import * as fs from "fs";

//const example: string[] = getExampleInput(__dirname);
const example: string = fs.readFileSync(__dirname + "/ex.txt", "utf8");
const input: string = fs.readFileSync(__dirname + "/input.txt", "utf8");
//const input: string[] = getPuzzleInput(__dirname);

console.log(`Part 1 example: ${solve1(example)}`);
console.log(`Part 1 solution: ${solve1(input)}`);
console.log(`Part 2 brute force example: ${solve2(example)}`);
//console.log(`Part 2 brute force solution: ${solve2(input)}`);
console.log(`Part 2 proper example: ${solve3(example)}`);
console.log(`Part 2 proper solution: ${solve3(input)}`);

function solve1(lines: string, sum = 0) {
  let [head, ...tail] = parse(lines);
  let seeds = head as number[];
  let rest = tail as number[][][];

  let [
    seed2soil,
    soil2fert,
    fert2water,
    water2light,
    light2temp,
    temp2humid,
    humid2loc,
  ] = rest;

  let result: number[] = [];

  seeds.forEach((seed) => {
    let soil = mapIt(seed, seed2soil);
    let fert = mapIt(soil, soil2fert);
    let water = mapIt(fert, fert2water);
    let light = mapIt(water, water2light);
    let temp = mapIt(light, light2temp);
    let humid = mapIt(temp, temp2humid);
    let loc = mapIt(humid, humid2loc);
    result.push(loc);
  });

  return Math.min(...result);
}

function solve2(lines: string, sum = 0) {
  let [head, ...tail] = parse(lines);
  let seeds = head as number[];
  let rest = tail as number[][][];

  let [
    seed2soil,
    soil2fert,
    fert2water,
    water2light,
    light2temp,
    temp2humid,
    humid2loc,
  ] = rest;

  let res = 1462648396;

  let moreseeds = [];
  for (let i = 0; i < seeds.length; i = i + 2) {
    moreseeds.push([seeds[i], seeds[i + 1]]);
  }

  moreseeds = sanitise(moreseeds);

  moreseeds.forEach((seedcombo) => {
    let i = 0;
    while (i < seedcombo[1] - 1) {
      let seed = seedcombo[0] + i;
      let soil = mapIt(seed, seed2soil);
      let fert = mapIt(soil, soil2fert);
      let water = mapIt(fert, fert2water);
      let light = mapIt(water, water2light);
      let temp = mapIt(light, light2temp);
      let humid = mapIt(temp, temp2humid);
      let loc = mapIt(humid, humid2loc);
      if (loc < res) {
        res = loc;
      }
      i++;
    }
  });

  return res;
}

function solve3(lines: string) {
  let [head, ...tail] = parse(lines);
  let seeds = head as number[];
  let rest = tail as number[][][];

  let [
    seed2soil,
    soil2fert,
    fert2water,
    water2light,
    light2temp,
    temp2humid,
    humid2loc,
  ] = rest;

  let moreseeds = [];
  for (let i = 0; i < seeds.length; i = i + 2) {
    moreseeds.push([seeds[i], seeds[i + 1]]);
  }

  moreseeds = sanitise(moreseeds);

  let soilarr = mutateRange(moreseeds, seed2soil);
  let fertarr = mutateRange(soilarr, soil2fert);
  let waterarr = mutateRange(fertarr, fert2water);
  let lightarr = mutateRange(waterarr, water2light);
  let temparr = mutateRange(lightarr, light2temp);
  let humidarr = mutateRange(temparr, temp2humid);
  let locarr = mutateRange(humidarr, humid2loc);

  let result = locarr.map((x) => x[0]).filter(x => x > 0);

  result = sortArray(result);

  return Math.min(...result);
}

function mutateRange(moreseeds: any[], mutationMap: number[][]) {
  let arr = [];
  moreseeds.forEach((seed) => {
    let smin = seed[0];
    let smax = seed[0] + seed[1] - 1;

    let overlaps = mutationMap.filter((m) => {
      let mmin = m[1];
      let mmax = m[1] + m[2] - 1;

      if (between(smin, mmin, mmax) || between(smax, mmin, mmax)) {
        return true;
      }

      if (between(mmin, smin, smax) || between(mmax, smin, smax)) {
        return true;
      }

      return false;
    });

    if (overlaps.length === 0) {
      arr.push(seed);
    } else {
      overlaps = sortArray(overlaps);

      let pointer = smin;
      for (let i = 0; i < overlaps.length; i++) {
        let xmin = overlaps[i][1];
        let xmax = overlaps[i][1] + overlaps[i][2] - 1;
        let mut = overlaps[i][0] - overlaps[i][1];

        if (pointer > xmin) {
          xmin = pointer;
        }

        if (pointer < xmin) {
          arr.push([pointer, xmin - pointer]);
          pointer = xmin;
        }

        if (pointer === xmin) {
          if (smax <= xmax) {
            arr.push([xmin + mut, smax - xmin]);
            pointer = smax;
          } else {
            arr.push([xmin + mut, xmax - xmin]);
            pointer = xmax;
          }
        }

        if (i === overlaps.length - 1 && pointer < smax) {
          arr.push([pointer, smax - pointer]);
        }
      }
    }
  });

  return sanitise(arr);
}

function mapIt(n: number, arr: number[][]) {
  let result = n;
  arr.forEach((r) => {
    if (n >= r[1] && n <= r[1] + r[2] && result === n) {
      result = r[0] + (n - r[1]);
    }
  });

  return result;
}

function sanitise(seedarray: number[][]) {
  seedarray = sortArray(seedarray)

  let sarr = [];
  for (let i = 0; i < seedarray.length; i++) {
    if (i + 1 === seedarray.length) {
      sarr.push(seedarray[i]);
      continue;
    }
    let j = i + 1;
    let imin = seedarray[i][0];
    let imax = seedarray[i][0] + seedarray[i][1] - 1;
    let jmin = seedarray[j][0];
    let jmax = seedarray[j][0] + seedarray[j][1] - 1;

    if (imax < jmin) {
      sarr.push(seedarray[i]);
      continue;
    }

    if (imin < jmin && imax < jmax) {
      seedarray[i][1] = jmax - imin;
      sarr.push(seedarray[i]);
      i++;
      continue;
    }

    if (imin <= jmin && imax >= jmax) {
      sarr.push(seedarray[i]);
      i++;
      continue;
    }

    if (imin === jmin && imax < jmax) {
      sarr.push(seedarray[j]);
      i++;
      continue;
    }
  }
  //Deduplication of arrays within arrays is somehow exotic in JS
  //Parsing to string, add to set for dedup, parse back to number[][]
  const uniqueSet = new Set(sarr.map((x) => x.join()));
  return [...uniqueSet].map((x) => x.split(",")).map((x) => x.map((y) => +y));
}

function parse(lines: string) {
  let nl = lines.split("\r\n\r\n");

  let [s, s2s, s2f, f2w, w2l, l2t, t2h, h2l] = nl;

  let seeds = s
    .replace("seeds: ", "")
    .split(" ")
    .map((x) => +x);
  let seed2soil = parseMap(s2s, "seed-to-soil map:\r\n");
  let soil2fert = parseMap(s2f, "soil-to-fertilizer map:\r\n");
  let fert2water = parseMap(f2w, "fertilizer-to-water map:\r\n");
  let water2light = parseMap(w2l, "water-to-light map:\r\n");
  let light2temp = parseMap(l2t, "light-to-temperature map:\r\n");
  let temp2humid = parseMap(t2h, "temperature-to-humidity map:\r\n");
  let humid2loc = parseMap(h2l, "humidity-to-location map:\r\n");

  return [
    seeds,
    seed2soil,
    soil2fert,
    fert2water,
    water2light,
    light2temp,
    temp2humid,
    humid2loc,
  ];

  function parseMap(input: string, startline: string) {
    return input
      .replace(startline, "")
      .split("\r\n")
      .map((x) => x.split(" ").map((y) => +y));
  }
}

function between(x: number, min: number, max: number): boolean {
  return x >= min && x <= max;
}

function sortArray(arr: number[][]) {
  arr.sort((n1, n2) => {
    if (n1[0] > n2[0]) {
      return 1;
    }

    if (n1[0] < n2[0]) {
      return -1;
    }
    return 0;
  });

  return arr;
}