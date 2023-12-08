export function gcd(x: number, y: number) {
  return y === 0 ? x : gcd(y, x % y);
}
export function lcm(x: number, y: number) {
  return Math.abs((x * y)) / gcd(x, y);
}
