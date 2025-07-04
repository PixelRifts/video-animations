import { makeScene2D } from "@motion-canvas/2d";
import { Direction, slideTransition, waitFor, waitUntil } from "@motion-canvas/core";


export default makeScene2D(function* (view) {
    yield* slideTransition(Direction.Top);
    yield* waitFor(1);
    yield* waitUntil("end");
})