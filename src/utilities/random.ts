// base の値を from 〜 to の倍率範囲で上下させる（端数四捨五入）
export function rate(base: number, from: number, to: number): number {
  const rate = from + (to - from) * Math.random();
  return Math.round(base * rate);
}
