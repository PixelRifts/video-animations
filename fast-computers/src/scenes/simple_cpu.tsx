import { Line, makeScene2D } from "@motion-canvas/2d";
import { createRef, createRefArray, waitFor, waitUntil } from "@motion-canvas/core";

export default makeScene2D(function* (view) {
    const data_bus = createRefArray<Line>();
    const control_bus = createRefArray<Line>();

    view.add(<>
        
    </>)

    yield* waitUntil("end");
});