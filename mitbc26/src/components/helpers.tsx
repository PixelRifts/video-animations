import { Code, Rect, Txt, withDefaults } from "@motion-canvas/2d";
import { Origin, Signal, Vector2, easeInCirc, easeOutCirc } from "@motion-canvas/core";

export const RoboticTxt = withDefaults(Txt, {
    fontFamily: "Audiowide",
    fontWeight: 400,
    fontStyle: "bold",
})

export const MonoTxt = withDefaults(Txt, {
    fontFamily: "Space Mono",
    fontWeight: 400,
    fontStyle: "bold",
})

export const palette = {
    GREENS: [ "#243B30", "#17251E", "#0A100D" ],
    REDS:   [ "#362127", "#1F1316", "#100A0B" ],
}

export function* append_to_code(str: Code, word: string, duration: number) {
    const for_one = duration / word.length;
    for (const letter of word) {
        yield* str.code(str.code().fragments + letter, for_one);
    }
}

export function* wiggle(item: Signal<any, any, any, any>, dA: any, dB: any, duration: number) {
    const oldsize = item();
    yield* item(dA, duration/4, easeOutCirc);
    yield* item(oldsize, duration/4, easeInCirc);
    
    yield* item(dB, duration/4, easeOutCirc);
    yield* item(oldsize, duration/4, easeInCirc);
}

export function get_rect_tournament_line(a: Rect, b: Rect) {
    return () => [
        a.position().add(a.getOriginDelta(Origin.Right)),
        new Vector2(Vector2.lerp(a.position().add(a.getOriginDelta(Origin.Right)), b.position().add(b.getOriginDelta(Origin.Left)), 0.5).x, a.position().y),
        new Vector2(Vector2.lerp(a.position().add(a.getOriginDelta(Origin.Right)), b.position().add(b.getOriginDelta(Origin.Left)), 0.5).x, b.position().y),
        b.position().add(b.getOriginDelta(Origin.Left)),
    ];
}