import { Code, Node } from "@motion-canvas/2d";
import { all, debug, waitFor } from "@motion-canvas/core";

export type SimpleProcedure = () => void;

export function* fade_in_up(n: Node, amount=40, time=0.5) {
    yield* all(
        n.opacity(1, time),
        n.y(n.y()-amount, time)
    );
}

export function* fade_out_up(n: Node, amount=40, time=0.5) {
    yield* all(
        n.opacity(0, time),
        n.y(n.y()-amount, time)
    );
}

export function* write_code(c: Code, s: string, time=1.5) {
    let per_char = time / s.length;

    for (let i = 0; i < s.length; i++) {
        yield* c.code.append(s.charAt(i), 0);
        yield* waitFor(per_char);
    }
}

export function* run_simple(p: SimpleProcedure) {
    p();
}