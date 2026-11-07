// Exact rational arithmetic: inheritance shares must never be floating point.
export interface Fr { n: number; d: number }
const gcd = (a: number, b: number): number => (b === 0 ? Math.abs(a) : gcd(b, a % b));
export const fr = (n: number, d = 1): Fr => { const g = gcd(n, d) || 1; return { n: n / g, d: d / g }; };
export const ZERO = fr(0);
export const add = (a: Fr, b: Fr): Fr => fr(a.n * b.d + b.n * a.d, a.d * b.d);
export const sub = (a: Fr, b: Fr): Fr => fr(a.n * b.d - b.n * a.d, a.d * b.d);
export const mul = (a: Fr, b: Fr): Fr => fr(a.n * b.n, a.d * b.d);
export const div = (a: Fr, b: Fr): Fr => fr(a.n * b.d, a.d * b.n);
export const num = (a: Fr): number => a.n / a.d;
export const isZero = (a: Fr): boolean => a.n === 0;
export const gt = (a: Fr, b: Fr): boolean => a.n * b.d > b.n * a.d;
export const text = (a: Fr): string => (a.d === 1 ? String(a.n) : `${a.n}/${a.d}`);
export const lcm = (a: number, b: number): number => (a / gcd(a, b)) * b;
