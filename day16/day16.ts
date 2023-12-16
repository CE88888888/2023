import { getExampleInput, getPuzzleInput } from "../helper/inputs";

const example: string[] = getExampleInput(__dirname);
const input: string[] = getPuzzleInput(__dirname);

console.log(`Part 1 example: ${solve1(example)}`);
console.log(`Part 1 solution: ${solve1(input)}`);
console.log(`Part 2 example: ${solve2(example)}`);
console.log(`Part 2 solution: ${solve2(input)}`);

type Point = {
  v: string;
  x: number;
  y: number;
  dir: Dir;
};

type Dir = "left" | "right" | "up" | "down";

function solve1(lines: string[], sum = 0) {
  let points: Point[] = [];
  let gridraw = [];
  lines.forEach((l) => {
    gridraw.push([...l]);
  });

  const s: Point = {
    v: gridraw[0][0],
    x: 0,
    y: 0,
    dir: "right",
  };
  points.push(s);

  let ene = new Map<string, Point>();

  for (let i = 0; i < points.length; i++) {
    const p = points[i];
    ene.set(p.x.toString() + "," + p.y.toString(), p);

    if (i % 1000 === 0) {
      console.log(i, ene.size);
    }
    let np = { ...p };
    let next = [];

    if (p.v === ".") {
      next.push(np);
    }
    if (p.v === "/") {
      np.dir = rotate(p, "/");
      next.push(np);
    }
    if (p.v === "\\") {
      np.dir = rotate(p, "\\");
      next.push(np);
    }

    if (p.v === "-") {
      if (p.dir === "left" || p.dir === "right") {
        next.push(np);
      } else {
        let np1 = { ...p };
        let np2 = { ...p };
        np1.dir = "left";
        np2.dir = "right";
        next.push(np1);
        next.push(np2);
      }
    }

    if (p.v === "|") {
      if (p.dir === "up" || p.dir === "down") {
        next.push(np);
      } else {
        let np1 = { ...p };
        let np2 = { ...p };
        np1.dir = "up";
        np2.dir = "down";
        next.push(np1);
        next.push(np2);
      }
    }


    next.forEach((x) => {
      x = move(x);
      if (!outOfBounds(x, gridraw)) {
        x.v = gridraw[x.y][x.x];
        if (
          points.filter((i) => x.x === i.x && x.y === i.y && x.dir === i.dir)
            .length < 1
        ) {
          points.push(x);
        }
      }
    });
  }

  return ene.size; //6774, 7107 too low
}

function rotate(p: Point, mirror: string): Dir {
  if (mirror === "/") {
    switch (p.dir) {
      case "right":
        return "up";
      case "left":
        return "down";
      case "up":
        return "right";
      case "down":
        return "down";
    }
  }
  if (mirror === "\\") {
    switch (p.dir) {
      case "right":
        return "down";
      case "down":
        return "right";
      case "left":
        return "up";
      case "up":
        return "left";
    }
  }
}

function outOfBounds(np: Point, gridraw: any[]) {
  return (
    np.x > gridraw[0].length || np.y > gridraw.length-1 || np.x < 0 || np.y < 0
  );
}

function move(p: Point) {
  switch (p.dir) {
    case "left":
      p.x = p.x - 1;
      break;
    case "right":
      p.x = p.x + 1;
      break;
    case "down":
      p.y = p.y + 1;
      break;
    case "up":
      p.y = p.y - 1;
      break;
  }
  return p;
}

function solve2(lines: string[], sum = 0) {
  return sum;
}
