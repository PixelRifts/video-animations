import { Node } from "@motion-canvas/2d/lib/components";
import { all, waitFor } from "@motion-canvas/core/lib/flow";
import { Reference, useRandom } from "@motion-canvas/core/lib/utils";

export function* fadeInUp(node: Reference<Node>, time: number = 0.5) {
    yield* all(
        node().opacity(1, time),
        node().position.y(node().position.y() - 40, time),
    );
}

export function* fadeOutUp(node: Reference<Node>, time: number = 0.5) {
    yield* all(
        node().opacity(0, time),
        node().position.y(node().position.y() - 40, time),
    );
}

export function* fadeInDown(node: Reference<Node>, time: number = 0.5) {
    yield* all(
        node().opacity(1, time),
        node().position.y(node().position.y() + 40, time),
    );
}

export function* fadeOutDown(node: Reference<Node>, time: number = 0.5) {
    yield* all(
        node().opacity(0, time),
        node().position.y(node().position.y() + 40, time),
    );
}

export function* flicker_in(node: Node, groups: number = 2) {
    const random = useRandom();
    let c = random.nextFloat(0.1, 0.2);
    yield* all(
        node.opacity(1.00, c),
    );
    yield* waitFor(random.nextFloat(0.01, 0.02));
    let shift = 0; let final = 0;
    for (let i = 0; i < groups; i++) {
        for (let j = 0; j < random.nextInt(2, 6-final); j++) {
            c = random.nextFloat(0.02, 0.04);
            yield* all(
                node.opacity(0.05, c),
            );
            yield* waitFor(random.nextFloat(0.01, 0.02));

            c = random.nextFloat(0.02, 0.04);
            yield* all(
                node.opacity(1.0, c),
            );
            yield* waitFor(random.nextFloat(0.01+(shift/3), 0.02+(shift/3)));
        }
        
        yield* waitFor(random.nextFloat(shift+0.3, shift+0.4));
        shift += 0.2;
        final += 2;
    }
    c = random.nextFloat(0.01, 0.02);
    yield* all(
        node.opacity(1.0, c),
    );
    yield* waitFor(random.nextFloat(0.01, 0.02));
}

export function* flicker_out(node: Node, groups: number = 2) {
    const random = useRandom();
    let c = random.nextFloat(0.1, 0.2);
    yield* all(
        node.opacity(0.00, c),
    );
    yield* waitFor(random.nextFloat(0.01, 0.02));
    let shift = 0; let final = 0;
    for (let i = 0; i < groups; i++) {
        for (let j = 0; j < random.nextInt(2, 6-final); j++) {
            c = random.nextFloat(0.02, 0.04);
            yield* all(
                node.opacity(0.95, c),
            );
            yield* waitFor(random.nextFloat(0.01, 0.02));

            c = random.nextFloat(0.02, 0.04);
            yield* all(
                node.opacity(0.0, c),
            );
            yield* waitFor(random.nextFloat(0.01+(shift/3), 0.02+(shift/3)));
        }
        
        yield* waitFor(random.nextFloat(shift+0.3, shift+0.4));
        shift += 0.2;
        final += 2;
    }
    c = random.nextFloat(0.01, 0.02);
    yield* all(
        node.opacity(0.0, c),
    );
    yield* waitFor(random.nextFloat(0.01, 0.02));
}