// Rounds a raw numeric score/statistic to 2 decimal places for display, without
// trailing zeros (e.g. 87.0 -> "87", 87.333... -> "87.33").
export function formatScore(value: number): string {
  return Number(value.toFixed(2)).toString()
}
