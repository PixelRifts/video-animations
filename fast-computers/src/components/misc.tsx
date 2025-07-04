import { easeInCirc, easeInOutCirc, easeInOutSine, easeInSine, easeOutCirc, easeOutSine, Signal, tween } from "@motion-canvas/core";

export function* wiggle(item: Signal<any, any, any, any>, dA: any, dB: any, duration: number) {
    const oldsize = item();
    yield* item(dA, duration/4, easeOutSine);
    yield* item(dB, duration/2, easeInOutSine);
    yield* item(oldsize, duration/4, easeInSine);
}