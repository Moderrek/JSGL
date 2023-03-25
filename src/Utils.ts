export function IsInRange(a: number, min: number, max: number): boolean{
    return a >= min && a <= max;
}
export function Clamp(a: number, min: number, max: number): number{
    return Math.min(max, Math.max(min, a));
}
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