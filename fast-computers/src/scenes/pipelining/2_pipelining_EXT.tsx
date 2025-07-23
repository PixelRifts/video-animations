import { makeScene2D } from "@motion-canvas/2d";
import { waitFor, waitUntil } from "@motion-canvas/core";

export default makeScene2D(function* (view) {
    yield* waitFor(2);
    yield* waitUntil("end");
})