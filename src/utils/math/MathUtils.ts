/**
 * Speedy floor faster than Math.floor(a)
 * @param a Value to floor
 * @returns The floored number
 */
export function floor(a: number) {
  return a | a;
}
/**
 * Checks is number in range
 * @param a Value to check
 * @param min Minimal of range
 * @param max Maximum of range
 * @returns is number in range
 */
export function IsInRange(a: number, min: number, max: number): boolean{
    return a >= min && a <= max;
}
/**
 * Clamps number between min and max
 * @param a Value to clamp
 * @param min The minimum value
 * @param max The maximum value
 * @returns Clamped number
 */
export function Clamp(a: number, min: number, max: number): number{
    return Math.min(max, Math.max(min, a));
}
/**
 * Clamps number between 0 and 1
 * @param a Value to clamp
 * @returns Clamped01 number
 */
export function Clamp01(a: number): number{
    return Clamp(a, 0, 1);
}
/**
 * A Lerp function returns the value between two numbers at specified decimal midpoints.
 * @param x The minimum of range
 * @param y The maximum of range
 * @param a Decimal midpoint
 * @returns Value between two numbers
 */
export function Lerp(x: number, y: number, a: number): number{
    return x * (1 - a) + y * a;
}
export function InvertedLerp(x: number, y: number, a: number): number{
    return Clamp01((a - x) / (y - x));
}
export function Range(x1: number, y1: number, x2: number, y2: number, a: number){
    return Lerp(x2, y2, InvertedLerp(x1, y1, a));
}