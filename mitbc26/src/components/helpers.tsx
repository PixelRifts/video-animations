import { Code, Txt, withDefaults } from "@motion-canvas/2d";

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