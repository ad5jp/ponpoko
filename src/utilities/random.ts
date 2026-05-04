// from から to までの整数を返す（toも含む）
export function random_int(from: number, to: number): number {
  const range = to - from + 1;
  return from + Math.floor(Math.random() * range);
}

// from から to までの小数を返す（to未満）
export function random_float(from: number, to: number): number {
  const range = to - from;
  return from + Math.random() * range;
}

// base の値を プラマイ N% の範囲で上下させる（端数四捨五入）
export function shake(base: number, n: number): number {
  const rate = random_int(100 - n, 100 + n) / 100;
  return Math.round(base * rate);
}

// N% の確率で true を返す
export function chance(n: number): boolean {
  return Math.random() < n / 100;
}
