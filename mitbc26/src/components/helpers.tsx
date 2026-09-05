import { Circle, Code, Rect, Txt, withDefaults } from "@motion-canvas/2d";
import { Origin, Signal, SimpleSignal, Vector2, createSignal, easeInCirc, easeInOutSine, easeOutCirc, loop, spawn, useTime } from "@motion-canvas/core";

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
    GREENS: ["#243B30", "#17251E", "#0A100D"],
    REDS: ["#362127", "#1F1316", "#100A0B"],
}

export function* append_to_code(str: Code, word: string, duration: number) {
    const for_one = duration / word.length;
    for (const letter of word) {
        yield* str.code(str.code().fragments + letter, for_one);
    }
}

export function* wiggle(item: Signal<any, any, any, any>, dA: any, dB: any, duration: number) {
    const oldsize = item();
    yield* item(dA, duration / 4, easeOutCirc);
    yield* item(oldsize, duration / 4, easeInCirc);

    yield* item(dB, duration / 4, easeOutCirc);
    yield* item(oldsize, duration / 4, easeInCirc);
}

export function get_rect_tournament_line(a: Rect, b: Rect) {
    return () => [
        a.position().add(a.getOriginDelta(Origin.Right)),
        new Vector2(Vector2.lerp(a.position().add(a.getOriginDelta(Origin.Right)), b.position().add(b.getOriginDelta(Origin.Left)), 0.5).x, a.position().y),
        new Vector2(Vector2.lerp(a.position().add(a.getOriginDelta(Origin.Right)), b.position().add(b.getOriginDelta(Origin.Left)), 0.5).x, b.position().y),
        b.position().add(b.getOriginDelta(Origin.Left)),
    ];
}

export function edge_point(circle: Circle, target: Vector2): Vector2 {
    const center = circle.position();
    const radius = circle.size().x / 2 + circle.lineWidth() / 2; // touch the outer stroke edge
    return center.add(target.sub(center).normalized.scale(radius));
}

function* wiggle_loop(signal: SimpleSignal<number>, offset: number, speed: number) {
    yield* loop(Infinity, () =>
        signal(offset + 0.15, speed, easeInOutSine).to(offset - 0.15, speed, easeInOutSine),
    );
}

function routing_offset(
    from: Circle,
    to: Circle,
    obstacles: Circle[],
    clearance = 30,
): number {
    const start = from.position();
    const end = to.position();
    const dir = end.sub(start);
    const len = dir.magnitude;
    const unit = dir.normalized;
    const normal = unit.perpendicular;

    let offset = 0;
    for (const other of obstacles) {
        if (other === from || other === to) continue;

        const rel = other.position().sub(start);
        const along = rel.dot(unit);
        if (along <= 0 || along >= len) continue;

        const across = rel.dot(normal);
        const radius = other.size().x / 2 + other.lineWidth() / 2;
        const needed = radius + clearance - Math.abs(across);
        if (needed <= 0) continue;

        const pushed = (across >= 0 ? -1 : 1) * needed;
        if (Math.abs(pushed) > Math.abs(offset)) offset = pushed;
    }
    return offset;
}

export function living_wire(from: Circle, to: Circle,
    obstacles: Circle[],
    { amplitude = 25, speedA = 1.6, speedB = 2.4 } = {},
) {
    const wobbleA = createSignal(0);
    const wobbleB = createSignal(0);
    spawn(wiggle_loop(wobbleA, 1, speedA))
    spawn(wiggle_loop(wobbleB, 1, speedB));

    return {
        points: () => {
            const start = from.position();
            const end = to.position();
            const normal = end.sub(start).normalized.perpendicular;
      
            const bow = routing_offset(from, to, obstacles, amplitude + 20);
      
            const mid1 = start.lerp(end, 0.33).add(normal.scale(bow + wobbleA() * amplitude));
            const mid2 = start.lerp(end, 0.66).add(normal.scale(bow + wobbleB() * amplitude));
      
            return [edge_point(from, mid1), mid1, mid2, edge_point(to, mid2)];
        },
    };

}

