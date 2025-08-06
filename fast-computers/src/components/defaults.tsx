import { Code, Txt, withDefaults } from "@motion-canvas/2d";
import { debug, PossibleVector2, Random, Vector2, waitFor } from "@motion-canvas/core";

export function* write(t: Txt, s: string, time: number = 1) {
    t.text("");
    const piece = time / s.length;
    for (const c of s) {
        t.text(t.text() + c);
        yield* waitFor(piece);
    }
}
export function* write_code(t: Code, s: string, time: number = 1) {
    t.code("");
    const piece = time / s.length;
    for (const c of s) {
        t.code.append(c);
        yield* waitFor(piece);
    }
}

export function random_rect_point_and_dir(l: number, b: number, r: Random) : [Vector2, Vector2] {
    const t = r.nextFloat(0, 2 * (l + b));
    const hl = l/2, hb = b/2;
    const pos = t < l ? new Vector2(-hl+t, -hb) :
                t < 2*l ? new Vector2(hl-(t-l), hb) :
                t < 2*l+b ? new Vector2(hl, -hb+(t-2*l)) :
                new Vector2(-hl, hb-(t-2*l-b));
    return [pos, pos.normalized];
}

export const SqText = withDefaults(Txt, {
    fontFamily: "Orbitron",
    fontWeight: 800,
});

export const star_coords: PossibleVector2[] = [
    [-0.01028*20, -0.99995*20], [-0.22768*20, -0.30669*20],
    [-0.95418*20, -0.29922*20], [-0.36204*20,  0.12176*20],
    [-0.57943*20,  0.81502*20], [ 0.00393*20,  0.38195*20],
    [ 0.59607*20,  0.80293*20], [ 0.36447*20,  0.11429*20],
    [ 0.94783*20, -0.31878*20], [ 0.22132*20, -0.31131*20],
];

export const seagreen_light  = "#57ff8377";
export const seagreen        = "#57ff83";
export const seagreen_shaded = "#57ff83AA";



export const RoboticText = withDefaults(Txt, {
    fontFamily: "Teko",
    fontWeight: 700,
    fontStyle: "italic"
});

export const ThinRoboticText = withDefaults(Txt, {
    fontFamily: "Teko",
    fontWeight: 400,
    fontStyle: "italic"
});
