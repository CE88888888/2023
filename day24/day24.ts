import { getExampleInput, getPuzzleInput } from "../helper/inputs";

const example: string[] = getExampleInput(__dirname);
const input: string[] = getPuzzleInput(__dirname);

console.log(`Part 1 example: ${solve1(example, 0, true)}`);
console.log(`Part 1 solution: ${solve1(input)}`);
// console.log(`Part 2 example: ${solve2(example)}`);
// console.log(`Part 2 solution: ${solve2(input)}`);

function solve1(lines: string[], sum = 0, example = false) {
  const hails = parse(lines)
  let coord = findXY(hails[0], hails[1])

  const limitmin = (example)? 7 : 200000000000000
  const limitmax = (example)? 27 : 400000000000000

  for (let i = 0; i < hails.length-1; i++) {
    const hail1 = hails[i]
    for (let j = i+1; j < hails.length; j++) {
      const hail2 = hails[j]
      let {x, y} = findXY(hail1, hail2)
      if (betweenlimit(x,y,limitmin,limitmax)) {
        sum++
      }
    }
  }

  return sum;
}

function solve2(lines: string[], sum = 0) {
  return sum;
}

function findXY(arr1: number[], arr2: number[]) {
  const [xpos1, ypos1, zc1, xv1, yv1, za1] = arr1
  const [xpos2, ypos2, zpos2, xv2, yv2, zv2] = arr2
 
  const a1 = -1
  const b1 = xv1*(1/yv1)
  const c1 = (-1*(ypos1/yv1)*xv1)+xpos1
  
  const a2 = -1
  const b2 = xv2*(1/yv2)
  const c2 = (-1*(ypos2/yv2)*xv2)+xpos2

  const x = ((b1*c2)-(b2*c1))/((a1*b2)-(a2*b1))
  const y = ((c1*a2)-(c2*a1))/((a1*b2)-(a2*b1))

  if ((x-xpos1)/xv1 < 0 ||(x-xpos2)/xv2 < 0  ) {
    return { x: 0, y: 0}
  }

  return {x: x, y: y}
}

function parse(lines: string[]) {
  const result  = []
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    result.push(l.replace(" @", ",").split(", ").map(x => +x))
  }
  return result
}

function betweenlimit(x: number, y: number, limitmin: number, limitmax: number) {
  if (x < limitmin) return false
  if (y < limitmin) return false
  if (x > limitmax) return false
  if (y > limitmax) return false
  return true
}
