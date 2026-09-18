import { Video, makeScene2D } from "@motion-canvas/2d";
import { all, createRef, waitFor, waitUntil } from "@motion-canvas/core";

import showcasermp4 from "../video/showcaser.mp4";

export default makeScene2D(function* (view) {
    
    yield* waitUntil("HomelessMatch1")
    const showcaservideo = createRef<Video>();
    yield view.add(<Video ref={showcaservideo}
        src={showcasermp4}
        scale={1} radius={5}
        x={2000} lineWidth={8}
        stroke={"#4e345a"}
        playbackRate={2.5}
        time={1.5}
    />);
    yield* all(showcaservideo().x(0, 1.2));
    showcaservideo().play();
    
    yield* waitFor(5);
    yield* showcaservideo().x(-2000, 1.2);
    
    yield* waitUntil("end");
})