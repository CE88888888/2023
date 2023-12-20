import { getExampleInput, getPuzzleInput } from "../helper/inputs";

const example: string[] = getExampleInput(__dirname);
const input: string[] = getPuzzleInput(__dirname);

const queue = [];
let sumlow = 0;
let sumhigh = 0;

abstract class Module {
  id: string;
  type: string;
  dest: string[];
  connected?: any[];
  abstract receive(inc: string, source: string): void;
  abstract send(): void;

  constructor(id: string, type: string, dest: any[]) {
    this.id = id;
    this.type = type;
    this.dest = dest;
  }
}

class FlipFlop extends Module {
  on = false;

  constructor(id: string, dest: any[]) {
    super(id, "FF", dest);
  }

  receive(inc: string, s: string): void {
    if (inc === "low") {
      this.on = !this.on;
      this.send();
    }
  }

  send(): void {
    this.dest.forEach((d) => {
      const signal = this.on ? "high" : "low";
      send(queue, d, signal, this.id);
    });
  }
}

class Conjuction extends Module {
  connected = [];

  constructor(id: string, dest: any[], connected: any[]) {
    super(id, "CJ", dest);
    this.connected = connected;
  }

  send(): void {
    this.dest.forEach((d) => {
      let signal = "high";
      if (this.connected.every((i) => i[1] === "high")) {
        signal = "low";
      }
      send(queue, d, signal, this.id);
    });
  }

  receive(inc: string, s: string): void {
    let i = this.connected.findIndex((i) => i[0] === s);
    if (i > -1) {
      this.connected[i][1] = inc;
    } else {
      this.connected.push([s, inc]);
    }
    this.send();
  }
}

class Broadcast extends Module {
  constructor(id: string, dest: any[]) {
    super(id, "BC", dest);
  }

  send(): void {
    this.dest.forEach((d) => send(queue, d, "low", this.id));
  }

  receive(inc: string, s: string) {
    this.send();
  }
}

console.log(`Part 1 example: ${solve1(example)}`);
console.log(`Part 1 solution: ${solve1(input)}`);
console.log(`Part 2 example: ${solve2(example)}`);
console.log(`Part 2 solution: ${solve2(input)}`);

function solve1(lines: string[], sum = 0) {
  const modules = getModules(lines);
  sumhigh = 0;
  sumlow = 0;

  const cycles = [];
  let i = 0;
  while (i < 1000) {
    pushButton(modules, i);
    i++;
  }

  return sumhigh * sumlow;
}

function solve2(lines: string[], sum = 0) {
  const modules = getModules(lines);
  const watchpoints = getConnectedToUnknown(lines, modules);

  const cycles = [];
  let i = 0;
  while (i < 10000) {
    pushButton(modules, i, watchpoints, cycles);
    i++;
  }

  let modulos = watchpoints.map((wp) => {
    return cycles
      .filter((c) => c.id === wp)
      .map((x) => x.i)
      .reduce((acc, x) => x - acc);
  });
  let result = modulos.reduce((acc, x) => x * acc);

  return result;
}

function pushButton(
  modules: Module[],
  i: number,
  watchpoints = [],
  cycles = []
) {
  send(queue, "broadcaster", "low", "button");
  while (queue.length > 0) {
    let next = queue.shift();
    let m = modules.find((m) => m.id === next[0]);
    if (m !== undefined) {
      m.receive(next[1], next[2]);
      //part2
      watchpoints.forEach((wp) => {
        if (next[0] === wp && next[1] === "low") {
          cycles.push({ id: wp, i: i });
        }
      });
    }
  }
}

function send(queue: any[], id: string, signal: string, source: string) {
  if (signal === "low") sumlow++;
  if (signal === "high") sumhigh++;
  queue.push([id, signal, source]);
}

function getModules(lines: string[]) {
  const modules: Module[] = [];
  lines.forEach((l) => {
    const id = l.slice(1, l.indexOf(" "));
    const dest = l.slice(l.indexOf("-> ") + 3).split(", ");
    let m = undefined;
    if (l[0] === "%") {
      m = new FlipFlop(id, dest);
    }
    if (l[0] === "&") {
      m = new Conjuction(id, dest, getConnected(lines, id));
    }
    if (l[0] === "b") {
      m = new Broadcast("broadcaster", dest);
    }
    if (m) modules.push(m);
  });

  return modules;
}

function getConnected(lines: string[], id: string) {
  const connected = lines.filter((l) => l.slice(l.indexOf(">")).includes(id));
  const result = connected.map((l) => {
    return [l.slice(1, l.indexOf(" ")), "low"];
  });
  return result;
}

function getConnectedToUnknown(lines: string[], modules: Module[]) {
  let arr = lines.map((l) => l.slice(l.indexOf(">") + 2).split(", ")).flat();
  let unknown = arr.find((u) => modules.filter((m) => m.id === u).length < 1);

  let x = modules.find((m) => m.dest.includes(unknown));
  return x.connected.map((x) => x[0]);
}
