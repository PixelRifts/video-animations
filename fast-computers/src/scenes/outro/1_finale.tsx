import { Gradient, Line, makeScene2D, Node, Rect, Txt, Video } from "@motion-canvas/2d";
import { all, cancel, chain, createRef, createRefArray, linear, loopFor, range, run, sequence, waitFor, waitUntil } from "@motion-canvas/core";
import { RoboticText } from "../../components/defaults";
import { cosmic_grad_ramps } from "../../components/palette";

import agnerfog from "../../video/AgnerFog.mp4";

export default makeScene2D(function* (view) {
    

    //#region Background Shenanigans
        const stage_refs = createRefArray<Rect>();
        const stage_labels = createRefArray<Txt>();
        const stage_ref_backings = createRefArray<Rect>();
        const stage_ref_frontings = createRefArray<Rect>();
        const stage_ref_big_front = createRefArray<Rect>();
        const part3_label = createRef<Txt>();
    
        const stage_posns: [number,number][] = [ [-700, 200], [-300, -300], [300, -300], [700, 200] ];
        const stage_lbl_strs: string[] = [ "1", "2", "3", "4" ]
        const stage_back_colors = [ "#231833ff", "#1d1a36ff", "#101b37ff", "#101c34ff" ]
        view.add(<>
            {range(4).map(i => <>
                <Rect
                    ref={stage_refs}
                    size={[200, 200]}
                    position={stage_posns[i]}
                    rotation={45} zIndex={-11}
                    lineWidth={20}
                    stroke={cosmic_grad_ramps[1][i]}
                />
                <Rect
                    ref={stage_ref_backings}
                    size={[230, 230]}
                    position={stage_posns[i]}
                    rotation={45} zIndex={-11}
                    lineWidth={2}
                    stroke={cosmic_grad_ramps[1][i]}
                />
                <Rect
                    ref={stage_ref_frontings}
                    size={[170, 170]}
                    position={stage_posns[i]}
                    rotation={45} zIndex={-11}
                    lineWidth={2}
                    stroke={cosmic_grad_ramps[1][i]}
                />
                <Rect
                    ref={stage_ref_big_front}
                    size={[300, 300]}
                    position={stage_posns[i]}
                    rotation={45} zIndex={-12}
                    fill={stage_back_colors[i]}
                />
                <RoboticText
                    ref={stage_labels}
                    position={[stage_posns[i][0], stage_posns[i][1] + 10]}
                    fontStyle={""} zIndex={-11}
                    fontSize={0}
                    text={stage_lbl_strs[i]}
                    fill={cosmic_grad_ramps[1][i]}
                />
            </>)}
        </>);
    
    
        stage_ref_big_front[3].zIndex(-10);
        stage_ref_backings[3].zIndex(5);
        stage_ref_frontings[3].zIndex(5);
        stage_labels[3].zIndex(5);
        stage_refs[3].zIndex(5);
    
        const big_front_anims = [];
        const backing_anims = [];
        const fronting_anims = [];
    
        view.add(
            <RoboticText
                ref={part3_label}
                fontSize={100}
                fill={"white"}
                fontStyle={""}
                position={[-160, -140]}
                // text={"Part I"}
                zIndex={5}
            />)
        for (let i = 0; i < 4; i++) {
            yield sequence(0.2,
                sequence(0.1,
                    all(
                        stage_ref_big_front[i].rotation(45, 0.2)
                    ),
                    (big_front_anims[i] = loopFor(Infinity, function* () { yield* stage_ref_big_front[i].rotation(stage_ref_big_front[i].rotation() + 180, 5, linear) }))
                ),
                sequence(0.1,
                    all(
                        stage_ref_backings [i].rotation(-45, 0.2),
                    ),
                    (backing_anims[i] = loopFor(Infinity, function* () { yield* stage_ref_backings[i].rotation(stage_ref_backings[i].rotation() - 180, 5, linear) }))
                ),
                all(
                    stage_refs         [i].rotation(45, 0.2),
                    // stage_labels       [i].fontSize(150, 0.2)
                ),
                sequence(0.1,
                    all(
                        stage_ref_frontings[i].rotation(45, 0.2),
                    ),
                    (fronting_anims[i] = loopFor(Infinity, function* () { yield* stage_ref_frontings[i].rotation(stage_ref_frontings[i].rotation() + 180, 5, linear) }))
                ),
            );
        }
        yield* sequence(0,
            sequence(0,
                stage_refs[3].rotation(45, 0),
                stage_refs[3].size([4000, 4000], 0),
                stage_ref_frontings[3].size([4000, 4000], 0),
                stage_ref_backings[3].size([4000, 4000], 0),
                stage_ref_big_front[3].size([4000, 4000], 0),
            ),
        );
        
        yield* waitUntil("transition_section3");
        
        yield* sequence(0.1,
            stage_ref_big_front[3].size([300, 300], 1.2),
            stage_ref_frontings[3].size([170, 170], 1.2),
            stage_refs[3].size([200, 200], 1.2),
            stage_ref_backings[3].size([230, 230], 1.2),
            stage_refs[3].rotation(45, 1.2),
            ...range(4).map(i => stage_labels[i].fontSize(150, 0.2))
        );
        stage_ref_big_front[3].zIndex(-17);
        stage_ref_backings[3].zIndex(-15);
        stage_ref_frontings[3].zIndex(-15);
        stage_labels[3].zIndex(-15);
        stage_refs[3].zIndex(-15);
    
        for (let i = 0; i < 4; i++) {
            yield sequence(0.05,
                sequence(0.05,
                    all(
                        stage_ref_big_front[i].size([0,0], 0.8),
                    ),
                ),
                sequence(0.05,
                    all(
                        stage_ref_backings [i].size([0, 0], 0.8),
                    ),
                ),
                all(
                    stage_refs         [i].size([0, 0], 0.8),
                    stage_refs         [i].rotation(0, 0.8),
                    stage_labels       [i].fontSize(0, 0.8)
                ),
                sequence(0.05,
                    all(
                        stage_ref_frontings[i].size([0, 0], 0.8),
                    ),
                ),
    
            );
            yield* waitFor(0.1);
        }
    
    //#endregion Background Shenanigans

    //#region CtrlStuff
    const example_ctrl = createRefArray<Node>();
    const example_ctrl_backs = createRefArray<Line>();
    const example_ctrl_highlights = createRefArray<Line>();
    const example_ctrl_labels = createRefArray<Txt>();

    type ctrl_popup = { pos: [number, number]; txt: string; width: number };
    const ctrl_positions: (ctrl_popup)[] = [
        { pos: [0, 0],       txt: "Bus Timing",        width: 75, },
        { pos: [-628, -254], txt: "DMA",               width: 50, },
        { pos: [461, -256],  txt: "Branch Prediction", width: 125, },
        { pos: [-871, 448],  txt: "Cache Mapping",     width: 90, },
        { pos: [-261, 345],  txt: "Wide Decoders",     width: 90, },
        { pos: [578, 155],   txt: "microop fusion",    width: 95, },
        { pos: [-249, -455], txt: "macroop fusion",    width: 95, },
        
        { pos: [-869, 56],   txt: "Subscribe",                     width: 70, },
        { pos: [218, -63],   txt: "Like",                          width: 45, },
        { pos: [280, 274],   txt: "This video took too damn long", width: 240, },
    ]
    view.add(<>
        {...ctrl_positions.map(t => <Node ref={example_ctrl} position={t.pos} scale={1.3}>
            <Line ref={example_ctrl_backs}
                points={[[-50, -50], [-50, -50], [50, -50], [50, 50], [50, 50], [-50, 50]]}
                closed fill={"#563d7f"} scale={0}
                // rotation={45}
            />
            <Line ref={example_ctrl_highlights}
                points={[[-55, -55], [-55, -55], [55, -55], [55, 55], [55, 55], [-55, 55]]}
                closed lineWidth={2} zIndex={-1}
                stroke={cosmic_grad_ramps[0][0]} scale={0}
                // rotation={45}
            />
            <RoboticText ref={example_ctrl_labels}
                zIndex={2}
                fill={cosmic_grad_ramps[1][1]}
                fontSize={60} fontStyle={""}
                // text={"PC_out"}
            />
        </Node>)}
    </>);
    const show_ctrl = function* (i: number, lab: string, winc: number = 50, compress: number = 10) {
        yield* sequence(0.7,
            sequence(0.1,
                all(
                    example_ctrl_highlights[i].rotation(45, 0.8),
                    example_ctrl_highlights[i].scale(1, 0.8),
                ),
                all(
                    example_ctrl_backs[i].rotation(45, 0.8),
                    example_ctrl_backs[i].scale(1, 0.8),
                ),
            ),
            chain(waitFor(1), example_ctrl[i].scale(0, 2.2)),
            all(
                example_ctrl_backs[i].points     ([[-50-winc+compress, -50+winc+compress], [-50+winc+compress, -50-winc+compress], [50+winc, -50-winc], [50+winc-compress, 50-winc-compress], [50-winc-compress, 50+winc-compress], [-50-winc, 50+winc]], 0.8),
                example_ctrl_highlights[i].points([[-55-winc+compress, -55+winc+compress], [-55+winc+compress, -55-winc+compress], [55+winc, -55-winc], [55+winc-compress, 55-winc-compress], [55-winc-compress, 55+winc-compress], [-55-winc, 55+winc]], 0.8),
                example_ctrl_labels[i].text(lab, 0.8),
            ),
        );
    }

    yield* sequence(0.45,
        ...ctrl_positions.map((t, i) => show_ctrl(i, t.txt, t.width)),
    );
    //#endregion CtrlStuff

    yield* waitUntil("showagnerfog");
    
    const myvideo = createRef<Video>();
    view.add(<>
        <Video ref={myvideo}
            src={agnerfog}
            scale={1}
            y={40}
            opacity={0}
            playbackRate={0.5}
        />
    </>);
    myvideo().play();
    yield* all(myvideo().y(0, 0.5), myvideo().opacity(1, 0.5));
    
    yield* waitUntil("byevideo");
    yield* all(myvideo().y(0, 0.5), myvideo().opacity(0, 0.5));

    yield* waitUntil("end")
});