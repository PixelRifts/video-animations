import { CameraView } from "@ksassnowski/motion-canvas-camera";
import { Node, makeScene2D } from "@motion-canvas/2d";
import { Color, all, createRef, sequence, waitFor, waitUntil } from "@motion-canvas/core";
import { NeonLine, NeonRect, NeonText, NeonVideo } from "../neon/neon_items";
import { shiftx_all, shifty, shifty_all } from "../animations/misc";
import { flicker_in, flicker_out } from "../animations/io";

import helloworkdvid from "../extern/helloworkd.mp4";
import armalignmentvid from "../extern/armalignment.mp4";
import ballmovvid from "../extern/ballmov.mp4";
import ballboingvid from "../extern/ballboing.mp4";
import balldedvid from "../extern/ballded.mp4";
import tadavid from "../extern/tada_noaudio.mp4";

export default makeScene2D(function* (_view) {
    const view = createRef<CameraView>();
    _view.add(<CameraView ref={view} width={"100%"} height={"100%"} />);

    const currvid = createRef<NeonVideo>();
    view().add(<>
        <NeonVideo
            ref={currvid}
            video_source={helloworkdvid}
            x={0} y={0}
            width={1440} height={830}
            intensity={1.0}
            glow={new Color("#283")}
        />
    </>);
    currvid().seek_and_play(7);
    yield* waitUntil("nodemo");
    yield* all(currvid().video_alpha(0, 0.5), currvid().alpha(0, 0.5));
    yield* waitUntil("yeetle");
    const playarea = createRef<NeonRect>();
    const leftbumper = createRef<NeonRect>();
    const rightbumper = createRef<NeonRect>();
    view().add(<>
        <NeonRect
            ref={playarea}
            x={-400} y={-100}
            width={800} height={500}
            glow={new Color("#238")} alpha={0}
        />
        <NeonRect
            ref={leftbumper}
            x={-720} y={-200}
            width={30} height={200} border={3}
            glow={"#838"} alpha={0}
        />
        <NeonRect
            ref={rightbumper}
            x={-80} y={-40}
            width={30} height={200} border={3}
            glow={new Color("#838")} alpha={0}
        />
    </>);
    yield* playarea().flicker_in(1);
    yield* waitFor(1);
    yield* sequence(0.1, leftbumper().flicker_in(1), rightbumper().flicker_in(1));
    yield* waitFor(3);
    yield* shiftx_all(-1000, 0.5, playarea(), leftbumper(), rightbumper());
    const stack = createRef<Node>();
    const stackleft = createRef<NeonLine>();
    const stackright = createRef<NeonLine>();
    const stackbottom = createRef<NeonLine>();
    const sz1 = createRef<NeonRect>();
    const sz2 = createRef<NeonRect>();
    const sz4 = createRef<NeonRect>();
    const sz1_lbl = createRef<NeonText>();
    const sz2_lbl = createRef<NeonText>();
    const sz4_lbl = createRef<NeonText>();
    view().add(<>
        <Node ref={stack} x={-600} y={50} opacity={0}>
            <NeonLine
                ref={stackleft}
                points={[[-200,-300],[-200, 300]]}
                border={10} glow={"#388"}
            />
            <NeonLine
                ref={stackright}
                points={[[200,-300],[200, 300]]}
                border={10} glow={"#388"}
            />
            <NeonLine
                ref={stackbottom}
                points={[[-205,300],[205, 300]]}
                border={10} glow={"#388"}
            />
        </Node>
        <NeonRect
            ref={sz1}
            x={-600} y={280-100}
            width={300} height={40} border={6}
            alpha={0}
        />
        <NeonRect
            ref={sz4}
            x={-600} y={140-100}
            width={300} height={160} border={6}
            alpha={0}
        />
        <NeonRect
            ref={sz2}
            x={-600} y={-20-100}
            width={300} height={80} border={6}
            alpha={0}
        />
        <NeonText
            ref={sz1_lbl}
            x={-250} y={300} size={40}
            txt={"0x2F00000"} border={6}
            alpha={0} text_alpha={0}
        />
        <NeonText
            ref={sz4_lbl}
            x={-250} y={220} size={40}
            txt={"0x2F00001"} border={6}
            alpha={0} text_alpha={0}
        />
        <NeonText
            ref={sz2_lbl}
            x={-250} y={20} size={40}
            txt={"0x2F00005"} border={6}
            alpha={0} text_alpha={0}
        />
    </>);
    yield* flicker_in(stack(), 1);
    yield* waitFor(1);
    yield* sequence(0.1,
        all(sz1().alpha(1, 0.5), shifty(sz1(), 100, 0.5)),
        all(sz4().alpha(1, 0.5), shifty(sz4(), 100, 0.5)),
        all(sz2().alpha(1, 0.5), shifty(sz2(), 100, 0.5)),
    );
    yield* sequence(0.1,
        sz1_lbl().flicker_in(1),
        sz4_lbl().flicker_in(1),
        sz2_lbl().flicker_in(1),
    );
    yield* waitFor(2);

    currvid().video_source(armalignmentvid);
    currvid().x(400); currvid().y(0);
    currvid().width(800); currvid().height(600);
    currvid().seek_and_play(0);
    yield* all(currvid().alpha(1, 0.5), currvid().video_alpha(1, 0.5));

    yield* waitUntil("alignme");
    yield* sequence(0.1,
        shifty_all(-120, 0.5, sz2(), sz2_lbl()),
        shifty_all(-120, 0.5, sz4(), sz4_lbl()),
        all(sz4_lbl().txt("0x2F00004", 0.5), sz4_lbl().glow("#283", 0.5)),
        all(sz2_lbl().txt("0x2F00008", 0.5), sz2_lbl().glow("#283", 0.5)),
    );
    yield* waitUntil("endthething");
    yield* all(
        flicker_out(stack(), 1),
        sz1().flicker_out(1), sz4().flicker_out(1), sz2().flicker_out(1),
        sz1_lbl().flicker_out(1), sz4_lbl().flicker_out(1), sz2_lbl().flicker_out(1),
        currvid().flicker_out(1),
    );

    yield* waitUntil("steps");
    const ballmov_vid = createRef<NeonVideo>();
    const ballboing_vid = createRef<NeonVideo>();
    const ballded_vid = createRef<NeonVideo>();
    view().add(<>
        <NeonVideo
            ref={ballmov_vid}
            video_source={ballmovvid}
            x={-600} y={0}
            width={400} height={800}
            intensity={1.0}
            glow={new Color("#283")}
            alpha={0} video_alpha={0}
        />
        <NeonVideo
            ref={ballboing_vid}
            video_source={ballboingvid}
            x={0} y={0}
            width={400} height={800}
            intensity={1.0}
            glow={new Color("#283")}
            alpha={0} video_alpha={0}
        />
        <NeonVideo
            ref={ballded_vid}
            video_source={balldedvid}
            x={600} y={0}
            width={400} height={800}
            intensity={1.0}
            glow={new Color("#283")}
            alpha={0} video_alpha={0}
        />
    </>);
    ballmov_vid().seek_and_play(1);
    yield* all(ballmov_vid().alpha(1, 0.5), ballmov_vid().video_alpha(1, 0.5));
    ballboing_vid().seek_and_play(1);
    yield* all(ballboing_vid().alpha(1, 0.5), ballboing_vid().video_alpha(1, 0.5));
    ballded_vid().seek_and_play(1);
    yield* all(ballded_vid().alpha(1, 0.5), ballded_vid().video_alpha(1, 0.5));
    yield* waitFor(3);
    yield* all(
        all(ballmov_vid().alpha(0, 0.5), ballmov_vid().video_alpha(0, 0.5)),
        all(ballded_vid().alpha(0, 0.5), ballded_vid().video_alpha(0, 0.5)),
    );
    yield* waitUntil("unshowthese");
    yield* all(ballboing_vid().alpha(0, 0.5), ballboing_vid().video_alpha(0, 0.5));
    currvid().video_source(tadavid);
    currvid().x(0); currvid().y(0);
    currvid().width(1440); currvid().height(830);
    currvid().seek_and_play(0);
    yield* waitFor(2);
    yield* all(currvid().alpha(1, 0.5), currvid().video_alpha(1, 0.5));

    yield* waitUntil("unshowthese2");
    yield* all(currvid().alpha(0, 0.5), currvid().video_alpha(0, 0.5));
    yield* waitUntil("end");
});