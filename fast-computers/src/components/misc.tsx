import { Line } from "@motion-canvas/2d";
import { easeInCirc, easeInOutCirc, easeInOutSine, easeInSine, easeOutCirc, easeOutSine, Signal, tween, Vector2 } from "@motion-canvas/core";

export function* wiggle(item: Signal<any, any, any, any>, dA: any, dB: any, duration: number) {
    const oldsize = item();
    yield* item(dA, duration/4, easeOutSine);
    yield* item(dB, duration/2, easeInOutSine);
    yield* item(oldsize, duration/4, easeInSine);
}

export function get_perp(k: Line): Vector2 {
    //@ts-expect-error
    const p1: Vector2 = typeof k.points()[0] == 'function' ? k.points()[0]() : k.points()[0];
    //@ts-expect-error
    const p2: Vector2 = typeof k.points()[1] == 'function' ? k.points()[1]() : k.points()[1];
    const edge = p2.sub(p1);
    return edge.perpendicular.scale(0.1);
}