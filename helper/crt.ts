export function gcd(x: number, y: number) {
  return y === 0 ? x : gcd(y, x % y);
}
export function lcm(x: number, y: number) {
  return (x * y) / gcd(x, y);
}
