import { Signal, TimingFunction, easeInCirc, easeInCubic, easeOutCirc, easeOutCubic, waitFor } from "@motion-canvas/core";

export function lerp(a: number, b: number, t: number): number {
    return (1-t)*a + t*b;
}

export function bilerp(a: number, b: number, c: number, d: number, x: number, y: number): number {
    return lerp(lerp(a, b, x), lerp(c, d, x), y);
}

export function range_check(v: number, a: number, b: number): boolean {
    return v >= a && v <= b;
}

type Procedure = () => void;
export function* delayed_exec(proc: Procedure, delay: number) {
    yield* waitFor(delay);
    proc();
}

export function* flash(item: Signal<any, any, any, any>, size: any, duration: number) {
    const oldsize = item();
    yield* item(size, duration/3);
    yield* waitFor(duration/3);
    yield* item(oldsize, duration/3);
}
export function* flash_delay(item: Signal<any, any, any, any>, size: any, duration: number, wait_pct: number = 1/3) {
    const oldsize = item();
    const io_pct = duration * (1-wait_pct);
    yield* item(size, io_pct/2);
    yield* waitFor(duration * wait_pct);
    yield* item(oldsize, io_pct/2);
}

export function* wiggle(item: Signal<any, any, any, any>, dA: any, dB: any, duration: number) {
    const oldsize = item();
    yield* item(dA, duration/4, easeOutCirc);
    yield* item(oldsize, duration/4, easeInCirc);
    
    yield* item(dB, duration/4, easeOutCirc);
    yield* item(oldsize, duration/4, easeInCirc);
}

export function* flashend(item: Signal<any, any, any, any>, val: any, endval: any, duration: number) {
    yield* item(val, duration/3);
    yield* waitFor(duration/3);
    yield* item(endval, duration/3);
}