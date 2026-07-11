import { Img, makeScene2D } from "@motion-canvas/2d";
import { createRef, easeOutBack, waitFor, waitUntil } from "@motion-canvas/core";


export default makeScene2D(function* (view) {
    yield* waitUntil("catstart");
    
    yield* waitUntil("brokenspec");
    const spec_img = createRef<Img>();
    view.add(<>
        <Img ref={spec_img}
            src={cats_were_dumb}
            scale={1.2} y={1500}
            radius={5}
            stroke={"#221725"} lineWidth={16}
        />
    </>);
    yield* spec_img().y(0, 1.2, easeOutBack);
    
    yield* waitUntil("end");
});

import cats_were_dumb from "../../video/CatSpec.png";