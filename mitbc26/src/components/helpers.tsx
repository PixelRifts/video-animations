import { Code, Txt, withDefaults } from "@motion-canvas/2d";
import { Signal, easeInCirc, easeOutCirc } from "@motion-canvas/core";

export const RoboticTxt = withDefaults(Txt, {
    fontFamily: "Audiowide",
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