import { Img, makeScene2D } from "@motion-canvas/2d";
import { waitUntil, createRef, all } from "@motion-canvas/core";

import winconpng from "../video/wincon0.png";
import catrngpng from "../video/catrng.png";

export default makeScene2D(function* (view) {

    yield* waitUntil("whydothis");
    const winconimg = createRef<Img>();
    view.add(<>
        <Img ref={winconimg}
            src={winconpng}
            x={2000} scale={1.8}
        />
    </>)
    yield* all(winconimg().x(0, 1.2));
    
    yield* waitUntil("nomoreimg");
    yield* all(winconimg().x(-2000, 1.2));

    
    yield* waitUntil("catrngyee");
    const catrngimg = createRef<Img>();
    view.add(<>
        <Img ref={catrngimg}
            src={catrngpng}
            x={2000} scale={1.8}
        />
    </>)
    yield* all(catrngimg().x(0, 1.2));
    
    yield* waitUntil("catrngnay");
    yield* all(catrngimg().x(-2000, 1.2));
});